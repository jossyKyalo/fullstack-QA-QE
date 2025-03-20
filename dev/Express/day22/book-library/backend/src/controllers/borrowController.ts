import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import { UserRequest } from "../utils/types/userTypes";

// Borrow a Book (Only Customers)
export const borrowBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
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

        // Update book copy status to borrowed
        await pool.query(
            "UPDATE bookcopies SET status = 'Borrowed' WHERE copy_id = $1",
            [copy_id]
        );

        // Update available copies count in books table
        await pool.query(
            "UPDATE books SET available_copies = available_copies - 1 WHERE book_id = $1",
            [book_id]
        );

        // Insert borrow record
        const result = await pool.query(
            `INSERT INTO borrowers (user_id, copy_id, librarian_id, borrow_date, return_date, status) 
             VALUES ($1, $2, $3, $4, $5, 'Borrowed') RETURNING *`,
            [user_id, copy_id, librarian_id, borrow_date, return_date]
        );

        res.status(201).json({ message: "Book borrowed successfully", borrow: result.rows[0] });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Return a Book (Customer or Admin)
export const returnBook = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { borrower_id } = req.params;
    const user_id = req.user.user_id;

    try {
        // Check if the borrow record exists
        const borrowQuery = await pool.query(
            "SELECT b.*, bc.book_id FROM borrowers b JOIN bookcopies bc ON b.copy_id = bc.copy_id WHERE b.borrower_id=$1",
            [borrower_id]
        );

        if (borrowQuery.rowCount === 0) {
            res.status(404).json({ message: "Borrow record not found" });
            return;
        }

        const borrowRecord = borrowQuery.rows[0];

        // Only the borrower or an Admin can return the book
        if (borrowRecord.user_id !== user_id && req.user.role_name !== "Admin") {
            res.status(403).json({ message: "Unauthorized to return this book" });
            return;
        }

        const copy_id = borrowRecord.copy_id;
        const book_id = borrowRecord.book_id;

        // Update borrow record status to returned
        await pool.query(
            "UPDATE borrowers SET status='Returned', return_date=NOW() WHERE borrower_id=$1",
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

// Get all borrowed books (Admin Only)
export const getAllBorrows = asyncHandler(async (req: UserRequest, res: Response) => {
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

// Get a user's borrowed books (Customer)
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