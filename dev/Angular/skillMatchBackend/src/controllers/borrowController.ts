import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import { UserRequest } from "../utils/types/userTypes";

// Borrow a Book (Only Borrowers)
export const borrowBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Check if user is a Borrower
    if (req.user.role_name !== "Borrower") {
        res.status(403).json({ message: "Only Borrowers can request books" });
        return;
    }

    const { book_id, librarian_id } = req.body;
    const user_id = req.user.user_id;
    const borrow_date = new Date();
    const return_date = new Date();
    return_date.setDate(return_date.getDate() + 14); // Default return period: 2 weeks

    try {
        // Check if book exists
        const book = await pool.query("SELECT * FROM books WHERE book_id=$1", [book_id]);
        if (book.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        // Check if an available copy exists
        const availableCopy = await pool.query(
            `SELECT copy_id 
             FROM bookcopies 
             WHERE book_id = $1 
             AND status = 'Available'
             LIMIT 1`,
            [book_id]
        );

        if (availableCopy.rowCount === 0) {
            res.status(400).json({ message: "No available copies of this book" });
            return;
        }

        const copy_id = availableCopy.rows[0].copy_id;

        // Update book copy status to Reserved
        await pool.query("UPDATE bookcopies SET status = 'Reserved' WHERE copy_id = $1", [copy_id]);

        // Insert borrow record with Reserved status
        const result = await pool.query(
            `INSERT INTO borrowers (user_id, copy_id, librarian_id, borrow_date, return_date, status) 
             VALUES ($1, $2, $3, $4, $5, 'Reserved') RETURNING *`,
            [user_id, copy_id, librarian_id, borrow_date, return_date]
        );

        res.status(201).json({ 
            message: "Borrow request submitted. Waiting for librarian approval.", 
            borrow: result.rows[0] 
        });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Approve or Decline Borrow Request (Only Librarians)
export const approveBorrowRequest = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Check if user is a Librarian
    if (req.user.role_name !== "Librarian") {
        res.status(403).json({ message: "Unauthorized: Only librarians can approve borrow requests" });
        return;
    }

    const { borrower_id, action } = req.body; // action can be 'Approve' or 'Decline'

    try {
        // Check if the borrow record exists and get the related book information
        const borrowQuery = await pool.query(
            `SELECT b.*, bc.book_id 
             FROM borrowers b 
             JOIN bookcopies bc ON b.copy_id = bc.copy_id 
             WHERE b.borrower_id=$1`, 
            [borrower_id]
        );
        
        if (borrowQuery.rowCount === 0) {
            res.status(404).json({ message: "Borrow request not found" });
            return;
        }

        const borrowRecord = borrowQuery.rows[0];

        if (borrowRecord.status !== "Reserved") {
            res.status(400).json({ message: "This borrow request has already been processed" });
            return;
        }

        if (action === "Approve") {
            // Update borrow record status
            await pool.query("UPDATE borrowers SET status='Borrowed' WHERE borrower_id=$1", [borrower_id]);

            // Update book copy status to borrowed
            await pool.query("UPDATE bookcopies SET status = 'Borrowed' WHERE copy_id = $1", [borrowRecord.copy_id]);

            // Decrease available copies count
            await pool.query("UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1", [borrowRecord.book_id]);

            res.json({ message: "Borrow request approved successfully" });
        } else if (action === "Decline") {
            // Update the book copy back to Available
            await pool.query("UPDATE bookcopies SET status = 'Available' WHERE copy_id = $1", [borrowRecord.copy_id]);
            
            // Remove borrow request
            await pool.query("DELETE FROM borrowers WHERE borrower_id=$1", [borrower_id]);

            res.json({ message: "Borrow request declined" });
        } else {
            res.status(400).json({ message: "Invalid action. Use 'Approve' or 'Decline'" });
        }
    } catch (error) {
        console.error("Error approving borrow request:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Return a Book (Borrower, Admin, or Librarian)
export const returnBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { borrower_id } = req.params;
    const user_id = req.user.user_id;
    const role_name = req.user.role_name;

    try {
        // Check if the borrow record exists
        const borrowQuery = await pool.query(
            `SELECT b.borrower_id, b.user_id, b.copy_id, b.status, bc.book_id 
             FROM borrowers b 
             JOIN bookcopies bc ON b.copy_id = bc.copy_id 
             WHERE b.borrower_id=$1`,
            [borrower_id]
        );

        if (borrowQuery.rowCount === 0) {
            res.status(404).json({ message: "Borrow record not found" });
            return;
        }

        const borrowRecord = borrowQuery.rows[0];

        // Authorization check: Only the borrower, Admin, or Librarian can return the book
        if (borrowRecord.user_id !== user_id && role_name !== "Admin" && role_name !== "Librarian") {
            res.status(403).json({ message: "Unauthorized to return this book" });
            return;
        }

        // Check if book is already returned
        if (borrowRecord.status === "Returned") {
            res.status(400).json({ message: "Book is already returned" });
            return;
        }

        const copy_id = borrowRecord.copy_id;
        const book_id = borrowRecord.book_id;

        // Update borrow record status to returned with current date
        await pool.query(
            "UPDATE borrowers SET status='Returned', return_date=CURRENT_DATE WHERE borrower_id=$1",
            [borrower_id]
        );

        // Update book copy status to available
        await pool.query(
            "UPDATE bookcopies SET status='Available' WHERE copy_id=$1",
            [copy_id]
        );

        // Update available copies count in books table
        await pool.query(
            "UPDATE books SET available_copies = available_copies + 1 WHERE book_id = $1",
            [book_id]
        );

        res.json({ message: "Book returned successfully" });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all borrowed books (Admin and Librarian Only)
export const getAllBorrows = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Check if user is Admin or Librarian
    if (req.user.role_name !== "Admin" && req.user.role_name !== "Librarian") {
        res.status(403).json({ message: "Unauthorized: Only Admins and Librarians can view all borrowed books" });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT b.borrower_id, u.name AS borrower_name, lib.name AS librarian_name,
                    bc.copy_id, bk.title, bk.author, bk.image,
                    b.borrow_date, b.return_date, b.status 
             FROM borrowers b
             JOIN users u ON b.user_id = u.user_id
             JOIN users lib ON b.librarian_id = lib.user_id
             JOIN bookcopies bc ON b.copy_id = bc.copy_id
             JOIN books bk ON bc.book_id = bk.book_id
             ORDER BY b.borrow_date DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a user's borrowed books (Borrower)
export const getUserBorrows = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const user_id = req.user.user_id;

    try {
        const result = await pool.query(
            `SELECT b.borrower_id, bc.copy_id, bk.title, bk.author, bk.image,
                    b.borrow_date, b.return_date, b.status 
             FROM borrowers b
             JOIN bookcopies bc ON b.copy_id = bc.copy_id
             JOIN books bk ON bc.book_id = bk.book_id
             WHERE b.user_id=$1 
             ORDER BY b.borrow_date DESC`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user's borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// New function: Check for overdue books (Librarian and Admin)
export const checkOverdueBooks = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    // Check if user is Librarian or Admin
    if (req.user.role_name !== "Librarian" && req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Unauthorized: Only Librarians and Admins can check overdue books" });
        return;
    }

    try {
        // Find books where return_date is in the past and status is still 'Borrowed'
        const result = await pool.query(
            `SELECT b.borrower_id, u.name AS borrower_name, u.email AS borrower_email,
                    bk.title, bk.author, bk.image,
                    b.borrow_date, b.return_date, b.status,
                    CURRENT_DATE - b.return_date AS days_overdue
             FROM borrowers b
             JOIN users u ON b.user_id = u.user_id
             JOIN bookcopies bc ON b.copy_id = bc.copy_id
             JOIN books bk ON bc.book_id = bk.book_id
             WHERE b.status = 'Borrowed' AND b.return_date < CURRENT_DATE
             ORDER BY days_overdue DESC`
        );

        // Mark books as overdue in database
        if (result.rows.length > 0) {
            const borrowerIds = result.rows.map(row => row.borrower_id);
            await pool.query(
                `UPDATE borrowers SET status = 'Overdue' 
                 WHERE borrower_id = ANY($1::int[]) AND status = 'Borrowed'`,
                [borrowerIds]
            );
        }

        res.json({
            count: result.rows.length,
            overdueBooks: result.rows
        });
    } catch (error) {
        console.error("Error checking overdue books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});