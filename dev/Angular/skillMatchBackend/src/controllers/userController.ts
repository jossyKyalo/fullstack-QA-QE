import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import bcrypt from "bcryptjs";
import { UserRequest } from "../utils/types/userTypes";

// Get all users (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT user_id, email, full_name,user_type FROM users ORDER BY user_id ASC");
    res.status(200).json(result.rows);
});

// Get a user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const result = await pool.query("SELECT user_id, email, full_name, user_type FROM users WHERE user_id = $1", [user_id]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.status(200).json(result.rows[0]);
});

// Create a new user (Admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, full_name, password, user_type } = req.body;

    // Check if email already exists
    const existingUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Users table
    const newUser = await pool.query(
        "INSERT INTO users (email, full_name, password, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email, user_type",
        [full_name, email, hashedPassword, user_type]
    );

    // If the user is a job seeker, create a JobSeekers entry
    if (user_type === 'job_seeker') {
        await pool.query("INSERT INTO jobseekers (user_id) VALUES ($1)", [newUser.rows[0].user_id]);
    }

    // If the user is a recruiter, create a Recruiters entry
    if (user_type === 'recruiter') {
        await pool.query("INSERT INTO recruiters (user_id) VALUES ($1)", [newUser.rows[0].user_id]);
    }

    res.status(201).json(newUser.rows[0]);
});

// Update user (Admin only)
export const updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }

    const { user_id } = req.params;
    const { email, full_name, user_type } = req.body;

    // Only Admins can change roles
    if (req.user.user_type !== "admin" && user_type) {
        res.status(403).json({ message: "Only Admins can change roles" });
        return;
    }

    // Update user in Users table
    const updatedUser = await pool.query(
        "UPDATE users SET email = $1, full_name=$2, user_type = $3 WHERE user_id = $4 RETURNING user_id, full_name, email, user_type",
        [email, full_name, user_type, user_id]
    );

    if (updatedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.status(200).json(updatedUser.rows[0]);
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;

    // Delete user from Users table
    const deletedUser = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id", [user_id]);

    if (deletedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    // Delete associated records from JobSeekers or Recruiters tables
    await pool.query("DELETE FROM jobseekers WHERE user_id = $1", [user_id]);
    await pool.query("DELETE FROM recruiters WHERE user_id = $1", [user_id]);

    res.status(200).json({ message: "User deleted successfully" });
});
