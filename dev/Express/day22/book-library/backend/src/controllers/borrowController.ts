import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Borrow a book
export const borrowBook = async (req: Request, res: Response) => {
    try {
        const { user_id, book_id, borrow_date, return_date } = req.body;

        // Check if the book exists
        const book = await prisma.books.findUnique({ where: { book_id } });
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return
        }

        // Check if the book is already borrowed
        const borrowed = await prisma.borrows.findFirst({
            where: { book_id, status: "borrowed" },
        });

        if (borrowed) {
            res.status(400).json({ message: "Book is already borrowed" });
            return
        }

        // Create borrow record
        const borrow = await prisma.borrows.create({
            data: {
                user_id,
                book_id,
                borrow_date: new Date(borrow_date),
                return_date: new Date(return_date),
                status: "borrowed",
            },
        });

        res.status(201).json({ message: "Book borrowed successfully", borrow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Return a book
export const returnBook = async (req: Request, res: Response) => {
    try {
        const { borrow_id } = req.params;

        // Check if the borrow record exists
        const borrow = await prisma.borrows.findUnique({
            where: { borrow_id: Number(borrow_id) },
        });

        if (!borrow) {
            res.status(404).json({ message: "Borrow record not found" });
            return
        }

        if (borrow.status === "returned") {
            res.status(400).json({ message: "Book has already been returned" });
            return
        }

        // Update status to returned
        const updatedBorrow = await prisma.borrows.update({
            where: { borrow_id: Number(borrow_id) },
            data: { status: "returned" },
        });

        res.status(200).json({ message: "Book returned successfully", updatedBorrow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateBorrow = async (req: Request, res: Response) => {
    try {
        const { borrow_id } = req.params;
        const { return_date, status } = req.body;

        // Check if borrow record exists
        const borrow = await prisma.borrows.findUnique({
            where: { borrow_id: Number(borrow_id) },
        });

        if (!borrow) {
            res.status(404).json({ message: "Borrow record not found" });
            return
        }

        // Update the borrow record
        const updatedBorrow = await prisma.borrows.update({
            where: { borrow_id: Number(borrow_id) },
            data: {
                return_date: return_date ? new Date(return_date) : borrow.return_date,
                status: status || borrow.status,
                updated_at: new Date(), // Ensure updated_at is refreshed
            },
        });

        res.status(200).json({ message: "Borrow record updated successfully", updatedBorrow });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all borrow records (Admin)
export const getAllBorrows = async (req: Request, res: Response) => {
    try {
        const borrows = await prisma.borrows.findMany({
            include: { user: true, book: true },
        });
        res.status(200).json(borrows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get borrow history for a specific user
export const getUserBorrowHistory = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        const borrows = await prisma.borrows.findMany({
            where: { user_id: Number(user_id) },
            include: { book: true },
        });

        res.status(200).json(borrows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
