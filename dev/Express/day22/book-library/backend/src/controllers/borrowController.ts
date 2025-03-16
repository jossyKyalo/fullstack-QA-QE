import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import { UserRequest } from "../utils/types/userTypes";

// Borrow a Book (Only Customers)
export const borrowBook = asyncHandler(async (req: UserRequest, res: Response) => {
    const { book_id } = req.body;
    const borrower_id = req.user.user_id;
    const borrow_date = new Date();
    const return_date = new Date();
    return_date.setDate(return_date.getDate() + 14); // Default return period: 2 weeks

    try {
        // Check if book exists and is available
        const book = await pool.query("SELECT * FROM books WHERE book_id=$1", [book_id]);
        if (book.rowCount === 0) return res.status(404).json({ message: "Book not found" });

        // Insert borrow record
        const result = await pool.query(
            `INSERT INTO borrows (book_id, borrower_id, borrow_date, return_date, status) 
            VALUES ($1, $2, $3, $4, 'Borrowed') RETURNING *`,
            [book_id, borrower_id, borrow_date, return_date]
        );

        res.status(201).json({ message: "Book borrowed successfully", borrow: result.rows[0] });
    } catch (error) {
        console.error("Error borrowing book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Return a Book (Customer or Admin)
export const returnBook = asyncHandler(async (req: UserRequest, res: Response) => {
    const { borrow_id } = req.params;
    const user_id = req.user.user_id;

    try {
        // Check if the borrow record exists
        const borrow = await pool.query("SELECT * FROM borrows WHERE borrow_id=$1", [borrow_id]);
        if (borrow.rowCount === 0) return res.status(404).json({ message: "Borrow record not found" });

        // Ensure only the borrower or an Admin can return the book
        if (borrow.rows[0].borrower_id !== user_id && req.user.role_name !== "Admin") {
            return res.status(403).json({ message: "Unauthorized to return this book" });
        }

        // Update status to returned
        await pool.query("UPDATE borrows SET status='Returned', actual_return_date=NOW() WHERE borrow_id=$1", [borrow_id]);
        res.json({ message: "Book returned successfully" });
    } catch (error) {
        console.error("Error returning book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all borrowed books (Admin Only)
export const getAllBorrows = asyncHandler(async (req: UserRequest, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM borrows ORDER BY borrow_date DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a user's borrowed books (Customer)
export const getUserBorrows = asyncHandler(async (req: UserRequest, res: Response) => {
    const user_id = req.user.user_id;
    try {
        const result = await pool.query("SELECT * FROM borrows WHERE borrower_id=$1 ORDER BY borrow_date DESC", [user_id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching user's borrowed books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
