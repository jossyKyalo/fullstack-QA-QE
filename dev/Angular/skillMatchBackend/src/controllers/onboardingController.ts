import { Request, Response } from "express";
import db from "../config/db.config";
import { authenticateToken } from "../middlewares/authMiddleware";  

export const createJobSeekerProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId; 

    if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }

    const {
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

        // 1. Insert/Update into jobseekers
        const jobseekerInsert = await client.query(
            `INSERT INTO jobseekers (user_id, headline, current_company, years_experience, remote_preference, preferred_location, profile_picture, resume_document, onboarding_complete)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
            ON CONFLICT (user_id) DO UPDATE SET
                headline = EXCLUDED.headline,
                current_company = EXCLUDED.current_company,
                years_experience = EXCLUDED.years_experience,
                remote_preference = EXCLUDED.remote_preference,
                preferred_location = EXCLUDED.preferred_location,
                profile_picture = EXCLUDED.profile_picture,
                resume_document = EXCLUDED.resume_document,
                onboarding_complete = true
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

        const jobseekerId = jobseekerInsert.rows[0]?.jobseeker_id;

        if (jobseekerId) {
            // 2. Insert/Update skills (you might need to handle updates more carefully)
            for (const skill of skills) {
                const skillName = skill.name?.trim();
                const category = skill.category?.trim() || 'technical';

                if (!skillName) continue;

                const skillRes = await client.query(
                    `INSERT INTO skills (skill_name, category)
                    VALUES ($1, $2)
                    ON CONFLICT (skill_name) DO UPDATE SET skill_name = EXCLUDED.skill_name
                    RETURNING skill_id`,
                    [skillName, category]
                );
                const skillId = skillRes.rows[0]?.skill_id;

                if (skillId) {
                    await client.query(
                        `INSERT INTO userskills (user_id, skill_id, proficiency_score)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (user_id, skill_id) DO UPDATE SET proficiency_score = EXCLUDED.proficiency_score`,
                        [userId, skillId, skill.proficiency || 50]
                    );
                }
            }

            // 3. Insert employment preferences (handle updates if needed)
            await client.query(
                `DELETE FROM jobseeker_employment_preferences WHERE jobseeker_id = $1`,
                [jobseekerId]
            );
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

            await client.query("COMMIT");
            res.status(201).json({ message: "Onboarding completed successfully" });
        } else {
            await client.query("ROLLBACK");
            res.status(500).json({ error: "Failed to create/update jobseeker profile ID" });
        }

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Onboarding error:", error);
        res.status(500).json({ error: "Failed to complete onboarding" });

    } finally {
        client.release();
    }
};