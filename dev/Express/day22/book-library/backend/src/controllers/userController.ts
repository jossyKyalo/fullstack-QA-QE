import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import bcrypt from "bcryptjs";
import { UserRequest } from "../utils/types/userTypes";

//  Get all users (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const result = await pool.query("SELECT user_id, name, email, role_id FROM users ORDER BY user_id ASC");
    res.status(200).json(result.rows);
});

//  Get a user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await pool.query("SELECT user_id, name, email, role_id FROM users WHERE user_id = $1", [id]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return 
    }

    res.status(200).json(result.rows[0]);
});

//  Create a new user (Admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role_id } = req.body;

    // Check if email already exists
    const existingUser = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return 
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await pool.query(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
        [name, email, hashedPassword, role_id]
    );

    res.status(201).json(newUser.rows[0]);
});

//  Update user details (Admin & Manager)
export const updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, role_id } = req.body;

    // Only Admins can change roles
    if (req.user.role_name !== "Admin" && role_id) {
        res.status(403).json({ message: "Only Admins can change roles" });
        return 
    }

    // Update user
    const updatedUser = await pool.query(
        "UPDATE users SET name = $1, email = $2, role_id = $3 WHERE user_id = $4 RETURNING user_id, name, email, role_id",
        [name, email, role_id, id]
    );

    if (updatedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return 
    }

    res.status(200).json(updatedUser.rows[0]);
});

//  Delete user (Admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Delete user
    const deletedUser = await pool.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id", [id]);

    if (deletedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return 
    }

    res.status(200).json({ message: "User deleted successfully" });
});
