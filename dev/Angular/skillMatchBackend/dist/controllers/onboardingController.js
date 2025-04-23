"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJobSeekerProfile = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const createJobSeekerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { userId, headline, currentCompany, yearsExperience, remotePreference, preferredLocation, skills, preferences, } = req.body;
    const files = req.files;
    const profilePhoto = (_a = files.profilePhoto) === null || _a === void 0 ? void 0 : _a[0];
    const resume = (_b = files.resume) === null || _b === void 0 ? void 0 : _b[0];
    const client = yield db_config_1.default.connect();
    try {
        yield client.query("BEGIN");
        // 1. Insert into jobseekers
        const jobseekerInsert = yield client.query(`INSERT INTO jobseekers (user_id, headline, current_company, years_experience, remote_preference, preferred_location, profile_picture, resume_document)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING jobseeker_id`, [
            userId,
            headline,
            currentCompany,
            yearsExperience,
            remotePreference,
            preferredLocation,
            (profilePhoto === null || profilePhoto === void 0 ? void 0 : profilePhoto.buffer) || null,
            (resume === null || resume === void 0 ? void 0 : resume.buffer) || null,
        ]);
        const jobseekerId = jobseekerInsert.rows[0].jobseeker_id;
        // 2. Insert skills
        for (const skill of skills) {
            const skillName = (_c = skill.name) === null || _c === void 0 ? void 0 : _c.trim();
            const category = ((_d = skill.category) === null || _d === void 0 ? void 0 : _d.trim()) || 'technical';
            if (!skillName) {
                console.warn(`Skipping invalid skill: ${JSON.stringify(skill)}`);
                continue;
            }
            const skillRes = yield client.query(`INSERT INTO skills (skill_name, category)
     VALUES ($1, $2)
     ON CONFLICT (skill_name) DO UPDATE SET skill_name = EXCLUDED.skill_name
     RETURNING skill_id`, [skillName, category]);
            const skillId = skillRes.rows[0].skill_id;
            yield client.query(`INSERT INTO userskills (user_id, skill_id, proficiency_score)
     VALUES ($1, $2, $3)`, [userId, skillId, skill.proficiency || 50]);
        }
        // 3. Insert employment preferences
        if ((preferences === null || preferences === void 0 ? void 0 : preferences.employmentTypes) && Array.isArray(preferences.employmentTypes)) {
            for (const type of preferences.employmentTypes) {
                yield client.query(`INSERT INTO jobseeker_employment_preferences (jobseeker_id, employment_type)
                 VALUES ($1, $2)
                 ON CONFLICT DO NOTHING`, [jobseekerId, type]);
            }
        }
        else {
            console.warn('Employment preferences not provided or invalid.');
        }
        // 4. Mark onboarding complete
        yield client.query(`UPDATE jobseekers SET onboarding_complete = true WHERE jobseeker_id = $1`, [jobseekerId]);
        yield client.query("COMMIT");
        res.status(201).json({ message: "Onboarding completed successfully" });
    }
    catch (error) {
        yield client.query("ROLLBACK");
        console.error("Onboarding error:", error);
        res.status(500).json({ error: "Failed to complete onboarding" });
    }
    finally {
        client.release();
    }
});
exports.createJobSeekerProfile = createJobSeekerProfile;
