import { Request, Response } from "express";
import db from "../config/db.config";

export const createJobSeekerProfile = async (req: Request, res: Response) => {
    const {
        userId,
        headline,
        currentCompany,
        yearsExperience,
        remotePreference,
        preferredLocation,
        skills,
        preferences,
    } = req.body;

    const files = req.files as {
        profilePhoto?: Express.Multer.File[];
        resume?: Express.Multer.File[];
    };

    const profilePhoto = files.profilePhoto?.[0];
    const resume = files.resume?.[0];

    const client = await db.connect();

    try {
        await client.query("BEGIN");

        // 1. Insert into jobseekers
        const jobseekerInsert = await client.query(
            `INSERT INTO jobseekers (user_id, headline, current_company, years_experience, remote_preference, preferred_location, profile_picture, resume_document)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING jobseeker_id`,
            [
                userId,
                headline,
                currentCompany,
                yearsExperience,
                remotePreference,
                preferredLocation,
                profilePhoto?.buffer || null,
                resume?.buffer || null,
            ]
        );

        const jobseekerId = jobseekerInsert.rows[0].jobseeker_id;

        // 2. Insert skills
        for (const skill of skills) {
            const skillName = skill.name?.trim();
            const category = skill.category?.trim() || 'technical';

            if (!skillName) {
                console.warn(`Skipping invalid skill: ${JSON.stringify(skill)}`);
                continue;  
            }

            const skillRes = await client.query(
                `INSERT INTO skills (skill_name, category)
     VALUES ($1, $2)
     ON CONFLICT (skill_name) DO UPDATE SET skill_name = EXCLUDED.skill_name
     RETURNING skill_id`,
                [skillName, category]
            );

            const skillId = skillRes.rows[0].skill_id;

            await client.query(
                `INSERT INTO userskills (user_id, skill_id, proficiency_score)
     VALUES ($1, $2, $3)`,
                [userId, skillId, skill.proficiency || 50]
            );
        }


        // 3. Insert employment preferences
        if (preferences?.employmentTypes && Array.isArray(preferences.employmentTypes)) {
            for (const type of preferences.employmentTypes) {
              await client.query(
                `INSERT INTO jobseeker_employment_preferences (jobseeker_id, employment_type)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`,
                [jobseekerId, type]
              );
            }
          } else {
            console.warn('Employment preferences not provided or invalid.');
          }
          

        // 4. Mark onboarding complete
        await client.query(
            `UPDATE jobseekers SET onboarding_complete = true WHERE jobseeker_id = $1`,
            [jobseekerId]
        );

        await client.query("COMMIT");
        res.status(201).json({ message: "Onboarding completed successfully" });

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Onboarding error:", error);
        res.status(500).json({ error: "Failed to complete onboarding" });

    } finally {
        client.release();
    }
};
