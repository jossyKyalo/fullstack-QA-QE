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

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string; roleId: number };

        
        const userQuery = await pool.query(
            `SELECT 
                users.user_id, users.name, users.email, users.role_id, 
                user_role.role_name 
            FROM users 
            JOIN user_role ON users.role_id = user_role.role_id 
            WHERE users.user_id = $1`,
            [decoded.userId]
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
