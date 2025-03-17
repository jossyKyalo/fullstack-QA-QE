import { Request, Response } from "express";
import pool from "../config/db.config";

// Add a new book (Only Admin)
export const addBook = async (req: Request, res: Response) => {
    const { title, author, genre, year, pages, publisher, description, image, price } = req.body;
    const { user_id, role } = (req as any).user; // Extract user info
    const created_at = new Date();

    if (role !== "admin") {
        res.status(403).json({ message: "Access denied. Only admins can add books." });
        return
    }

    try {
        const result = await pool.query(
            `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, price, created_by, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [title, author, genre, year, pages, publisher, description, image, price, user_id, created_at]
        );

        res.status(201).json({ message: "Book added successfully", book: result.rows[0] });
        return
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
};

// Get all books with filtering and pagination
export const getAllBooks = async (req: Request, res: Response) => {
    const { title, author, genre, year, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = "SELECT * FROM books WHERE 1=1";
    const values: any[] = [];

    if (title) {
        query += " AND title ILIKE $" + (values.length + 1);
        values.push(`%${title}%`);
    }
    if (author) {
        query += " AND author ILIKE $" + (values.length + 1);
        values.push(`%${author}%`);
    }
    if (genre) {
        query += " AND genre ILIKE $" + (values.length + 1);
        values.push(`%${genre}%`);
    }
    if (year) {
        query += " AND year = $" + (values.length + 1);
        values.push(Number(year));
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(Number(limit), offset);

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
        return
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return
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
        return
    }
};

// Update book details (Only by the creator)
export const updateBook = async (req: Request, res: Response) => {
    const { book_id } = req.params;
    const { title, author, genre, year, pages, publisher, description, image, price } = req.body;
    const { user_id } = (req as any).user; // Extract user ID
    const updated_at = new Date();

    try {
        const result = await pool.query(
            `UPDATE books 
            SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, image=$8, price=$9, updated_at=$10
            WHERE book_id=$11 AND created_by=$12 RETURNING *`,
            [title, author, genre, year, pages, publisher, description, image, price, updated_at, book_id, user_id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found or unauthorized" });
            return
        }

        res.json({ message: "Book updated successfully", book: result.rows[0] });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
};

// Delete book (Only Admin)
export const deleteBook = async (req: Request, res: Response) => {
    const { book_id } = req.params;
    const { role } = (req as any).user; // Extract user role

    if (role !== "admin") {
        res.status(403).json({ message: "Access denied. Only admins can delete books." });
        return
    }

    try {
        const result = await pool.query("DELETE FROM books WHERE book_id=$1", [book_id]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return
        }

        res.json({ message: "Book deleted successfully" });
        return
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return
    }
};
