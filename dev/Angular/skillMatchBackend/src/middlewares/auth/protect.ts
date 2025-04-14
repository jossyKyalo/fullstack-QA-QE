import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../../config/db.config";
import { UserRequest } from "../../utils/types/userTypes";
import asyncHandler from "../asyncHandler";

 
export const protect = asyncHandler(async (req: UserRequest, res: Response, next: NextFunction) => {
    let token;

     
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

 
    if (!token && req.cookies?.access_token) {
        token = req.cookies.access_token;
    }

    
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return
    }

    try {
         
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { user_id: string; user_type: string };

        
        const userQuery = await pool.query(
            `SELECT user_id, email, full_name, user_type FROM users WHERE user_id = $1`,
            [decoded.user_id]
        );
        

        
        if (userQuery.rows.length === 0) {
            res.status(401).json({ message: "User not found" });
            return
        }

      
        req.user = userQuery.rows[0];

        next();  
    } catch (error) {
        console.error("JWT Error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
});
