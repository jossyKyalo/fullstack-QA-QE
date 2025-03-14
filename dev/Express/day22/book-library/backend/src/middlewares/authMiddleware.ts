import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../db/db.config";
import dotenv from 'dotenv'

dotenv.config();

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access denied, no token provided" });
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};


export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user_id = (req as any).user.user_id;

    try {
        const result = await pool.query("SELECT role_id FROM users WHERE user_id=$1", [user_id]);

        if (result.rows[0].role_id !== 1) {   
            res.status(403).json({ message: "Access denied, only admins can perform this action" });
            return
        }

        next();
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
