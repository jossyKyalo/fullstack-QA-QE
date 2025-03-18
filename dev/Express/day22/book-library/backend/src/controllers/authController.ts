import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler";
import { UserRequest } from "../utils/types/userTypes";
import pool from "../config/db.config";
import {generateTokens} from "../utils/helpers/generateToken";

 
export const registerUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    const { name, email, password_hash, role_id = 1 } = req.body;

    // Check if user exists
    const userExists = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);

    if (userExists.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    // Insert user into DB
    const newUser = await pool.query(
        "INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
        [name, email, hashedPassword, role_id]
    );

    // Generate JWT Token
    generateTokens(res, newUser.rows[0].user_id, newUser.rows[0].role_id);

    res.status(201).json({
        message: "User registered successfully",
        user: newUser.rows[0]
    });

    next();
});

 
export const loginUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, password_hash } = req.body;

    // Check if user exists
    const userQuery = await pool.query(
        `SELECT users.user_id, users.name, users.email, users.password_hash, users.role_id, user_role.role_name
         FROM users
         JOIN user_role ON users.role_id = user_role.role_id
         WHERE email = $1`,
        [email]
    );

    if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    const user = userQuery.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password_hash, user.password_hash);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    // Generate JWT Token
    generateTokens(res, user.user_id, user.role_id);

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role_id: user.role_id,
            role_name: user.role_name
        }
    });

    next();
});

 
export const logoutUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    res.cookie("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0) // Expire immediately
    });

    res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0) // Expire immediately
    });

    res.status(200).json({ message: "User logged out successfully" });

    next();
});

