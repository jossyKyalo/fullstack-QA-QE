import express from "express";
import {
    addBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook
} from "../controllers/bookController";
import { protect } from "../middlewares/auth/protect";
import { adminGuard } from "../middlewares/auth/roleMiddleware";

const router = express.Router();

// 📌 Public routes (Accessible to all)
router.get("/", getAllBooks); // Fetch all books (supports filtering)
router.get("/:book_id", getBookById); // Fetch a specific book

// 🔒 Protected routes (Requires authentication)
router.use(protect); // Apply authentication middleware

// 📌 Admin-only routes
router.post("/", adminGuard, addBook); // Only Admins can add books
router.delete("/:book_id", adminGuard, deleteBook); // Only Admins can delete books

// 📌 Authenticated users can update their own books
router.put("/:book_id", updateBook);

export default router;
