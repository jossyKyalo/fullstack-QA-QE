import express from "express";
import { borrowBook, returnBook, getAllBorrows, getUserBorrows } from "../controllers/borrowController";
import { protect } from "../middlewares/auth/protect";
import { adminGuard} from "../middlewares/auth/roleMiddleware";

const router = express.Router();
router.use(protect);

// Borrowers borrow a book
router.post("/", borrowBook);

// Borrowers & Admins return a book
router.post("/:borrow_id", returnBook);

// Admins get all borrow records
router.get("/all",  adminGuard, getAllBorrows);

// Borrowers get their own borrow records
router.get("/", protect, getUserBorrows);

export default router;
