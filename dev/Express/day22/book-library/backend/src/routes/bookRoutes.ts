import express from "express";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware";
import { addBook, getAllBooks, getBookById, updateBook, deleteBook } from "../controllers/bookController";

const router = express.Router();

router.post("/",  authenticateUser, isAdmin, addBook); // Add a book (Only Admin)
router.get("/", getAllBooks); // Get all books
router.get("/:book_id", getBookById); // Get single book
router.put("/:book_id", authenticateUser, isAdmin, updateBook); // Update book (Only Admin)
router.delete("/:book_id", authenticateUser, isAdmin, deleteBook); // Delete book (Only Admin)

export default router;
