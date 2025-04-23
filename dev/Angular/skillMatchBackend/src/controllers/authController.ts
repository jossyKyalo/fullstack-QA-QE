import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asyncHandler";
import { UserRequest } from "../utils/types/userTypes";
import pool from "../config/db.config";
import { generateTokens } from "../utils/helpers/generateToken";

// Register a new user (Job Seeker, Recruiter, Admin)
export const registerUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, full_name, password, user_type = 'job_seeker',company_id, position,resume_document, headline, current_company, years_experience, remote_preference, profile_picture} = req.body; 

    // Check if user exists
    const userExists = await pool.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into DB
    const newUserResult = await pool.query(
        "INSERT INTO users (email, full_name, password, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id, email, full_name, user_type",
        [email, full_name, hashedPassword, user_type]
    );
    const newUser = newUserResult.rows[0];
    const newUserId = newUser.user_id;
    if (user_type === 'recruiter') {
        await pool.query(
            "INSERT INTO recruiters (user_id, company_id, position) VALUES ($1, $2, $3)",
            [newUserId, company_id || null, position || null]
        );
    } else if (user_type === 'job_seeker') {
        await pool.query(
            "INSERT INTO jobseekers (user_id, resume_document, headline, current_company, years_experience, remote_preference, profile_picture) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [
                newUserId,
                resume_document || null,
                headline || null,
                current_company || null,
                years_experience || null,
                remote_preference || null,
                profile_picture ? Buffer.from(profile_picture, 'base64') : null  
            ]
        );
    }

    // Generate JWT Token
    generateTokens(res, newUserId, user_type);

    res.status(201).json({
        message: "User registered successfully",
        user: newUser
    });

    next();
});

// Login a user (Job Seeker, Recruiter, Admin)
export const loginUser = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if user exists
    const userQuery = await pool.query(
        `SELECT user_id,  email, full_name, password, user_type, last_login
         FROM users WHERE email = $1`,
        [email]
    );

    if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    const user = userQuery.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }

    // Generate JWT Token
    const { accessToken, refreshToken } = generateTokens(res, user.user_id, user.user_type);

    // Update last login timestamp
    await pool.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1", [user.user_id]);

    res.status(200).json({
        message: "Login successful",
        user: {
            id: user.user_id,
            email: user.email,
            full_name: user.full_name,
            user_type: user.user_type
        },
        access_token: accessToken
    });

    next();
});

// Logout a user (clear cookies)
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
