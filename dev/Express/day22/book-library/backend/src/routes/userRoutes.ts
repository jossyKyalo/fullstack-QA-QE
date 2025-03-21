import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controllers/userController";
import { protect } from "../middlewares/auth/protect";
import { adminGuard } from "../middlewares/auth/roleMiddleware";

const router = express.Router();

// Public route: Register a new user
router.post("/", createUser);

// Private routes: Require authentication
router.use(protect);

// Admin-only routes
router.get("/", adminGuard, getUsers); // Get all users (Admin)
router.get("/:user_id", adminGuard, getUserById); // Get a user by ID (Admin)
router.put("/:user_id", adminGuard, updateUser); // Update user (Admin)
router.delete("/:user_id", adminGuard, deleteUser); // Delete user (Admin)

export default router;
