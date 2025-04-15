import db from "../config/db.config";  
import { Request, Response, NextFunction } from "express";

export const checkOnboarding = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers["user-id"];

  if (!userId){
    res.status(401).json({ error: "User ID required" });
    return;
  }

  const result = await db.query(
    `SELECT * FROM jobseekers WHERE user_id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    res.status(403).json({ message: "Please complete onboarding", redirect: "/onboarding" });
    return;
  }

  next(); // User has onboarded, allow access to dashboard
};
