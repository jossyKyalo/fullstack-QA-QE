import { Request, Response } from "express";
import pool from "../db/db.config";


export const addBook = async (req: Request, res: Response) => {
    const { title, author, genre, year, pages, publisher, description, image, price } = req.body;
    const created_by = (req as any).user.user_id;
    const created_at = new Date();

    try {
        const result = await pool.query(
            `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, price, created_by, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [title, author, genre, year, pages, publisher, description, image, price, created_by, created_at]
        );

        res.status(201).json({ message: "Book added successfully", book: result.rows[0] });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Get all books
export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM books ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Get a book by ID
export const getBookById = async (req: Request, res: Response) => {
    const { book_id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM books WHERE book_id=$1", [book_id]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Update book details (Only Admin)
export const updateBook = async (req: Request, res: Response) => {
    const { book_id } = req.params;
    const { title, author, genre, year, pages, publisher, description, image, price } = req.body;
    const updated_at = new Date();
    const created_by = (req as any).user.user_id;  

    try {
        const result = await pool.query(
            `UPDATE books 
            SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, image=$8, price=$9, updated_at=$10
            WHERE book_id=$11 AND created_by=$12 RETURNING *`,
            [title, author, genre, year, pages, publisher, description, image, price, updated_at, book_id, created_by]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found or unauthorized" });
            return
        }

        res.json({ message: "Book updated successfully", book: result.rows[0] });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
// Delete book (Only Admin)
export const deleteBook = async (req: Request, res: Response) => {
    const { book_id } = req.params;
    const created_by = (req as any).user.user_id;  

    try {
        const result = await pool.query("DELETE FROM books WHERE book_id=$1 AND created_by=$2", [book_id, created_by]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found or unauthorized" });
            return
        }

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

