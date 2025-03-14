import express from "express";
import { borrowBook, returnBook, updateBorrow, getAllBorrows, getUserBorrowHistory } from "../controllers/borrowController";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware";

const router = express.Router();

// Borrow a book
router.post("/", authenticateUser, borrowBook);

// Return a book
router.put("/return/:borrow_id", authenticateUser, returnBook);

// Update borrow record (Only Admins)
router.put("/:borrow_id", authenticateUser, isAdmin, updateBorrow); 

// Get all borrow records (Admin only)
router.get("/", authenticateUser, isAdmin, getAllBorrows);

// Get user borrow history
router.get("/:user_id", authenticateUser, getUserBorrowHistory);

export default router;
