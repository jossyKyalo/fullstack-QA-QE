import { Request, Response } from "express";
import db from "../config/db.config";

export const getJobSeekerDashboard = async (req: Request, res: Response) => {
  const userId = req.headers["user-id"];

  try {
    const jobseekerInfo = await db.query(
      `SELECT headline, years_experience, location, remote_preference
       FROM jobseekers WHERE user_id = $1`,
      [userId]
    );

    const skills = await db.query(
      `SELECT skill_name, proficiency FROM jobseeker_skills WHERE user_id = $1`,
      [userId]
    );

    const preferences = await db.query(
      `SELECT employment_type FROM jobseeker_preferences WHERE user_id = $1`,
      [userId]
    );

    res.status(200).json({
      profile: jobseekerInfo.rows[0],
      skills: skills.rows,
      preferences: preferences.rows,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ error: "Could not load dashboard data" });
  }
};
