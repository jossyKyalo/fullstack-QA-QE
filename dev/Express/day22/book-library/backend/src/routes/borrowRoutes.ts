import express from "express";
import { borrowBook, returnBook, getAllBorrows, getUserBorrows } from "../controllers/borrowController";
import { protect } from "../middlewares/auth/protect";
import { adminGuard, borrowerGuard } from "../middlewares/auth/roleMiddleware";

const router = express.Router();

// Borrowers borrow a book
router.post("/borrow", protect, borrowerGuard, borrowBook);

// Borrowers & Admins return a book
router.post("/return/:borrow_id", protect, returnBook);

// Admins get all borrow records
router.get("/all", protect, adminGuard, getAllBorrows);

// Borrowers get their own borrow records
router.get("/my-borrows", protect, borrowerGuard, getUserBorrows);

export default router;
