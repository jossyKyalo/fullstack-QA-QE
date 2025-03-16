import express from "express";
import { borrowBook, returnBook, getAllBorrows, getUserBorrows } from "../controllers/borrowController";
import { protect } from "../middlewares/auth/protect";
import { adminGuard, customerGuard } from "../middlewares/auth/roleMiddleware";

const router = express.Router();

// Customers borrow a book
router.post("/borrow", protect, customerGuard, borrowBook);

// Customers & Admins return a book
router.post("/return/:borrow_id", protect, returnBook);

// Admins get all borrow records
router.get("/all", protect, adminGuard, getAllBorrows);

// Customers get their own borrow records
router.get("/my-borrows", protect, customerGuard, getUserBorrows);

export default router;
