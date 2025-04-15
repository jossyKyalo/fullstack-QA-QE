// controllers/onboardingController.ts
import { Request, Response } from "express";
import db from "../config/db.config";

export const createJobSeekerProfile = async (req: Request, res: Response) => {
  const {
    userId,
    headline,
    yearsExperience,
    location,
    remotePreference,
    skills,
    preferences,
  } = req.body;

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Insert into jobseekers table
    await client.query(
      `INSERT INTO jobseekers (user_id, headline, years_experience, location, remote_preference)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, headline, yearsExperience, location, remotePreference]
    );

    // 2. Insert skills
    for (const skill of skills) {
      await client.query(
        `INSERT INTO jobseeker_skills (user_id, skill_name, proficiency)
         VALUES ($1, $2, $3)`,
        [userId, skill.name, skill.proficiency]
      );
    }

    // 3. Insert preferences
    for (const type of preferences.employmentTypes) {
      await client.query(
        `INSERT INTO jobseeker_preferences (user_id, employment_type)
         VALUES ($1, $2)`,
        [userId, type]
      );
    }

    // 4. Optional: mark onboarding as complete
    await client.query(
      `UPDATE users SET onboarding_complete = true WHERE user_id = $1`,
      [userId]
    );

    await client.query("COMMIT");
    res.status(201).json({ message: "Onboarding submitted successfully" });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Onboarding error:", error);
    res.status(500).json({ error: "Failed to submit onboarding" });

  } finally {
    client.release();
  }
};
