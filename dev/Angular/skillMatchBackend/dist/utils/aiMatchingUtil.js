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
exports.findMatchesForJob = exports.calculateMatchScore = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const calculateMatchScore = (jobId, jobseekerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get job skills
        const jobSkillsQuery = `
      SELECT js.skill_id, s.skill_name, js.importance_level
      FROM jobskills js
      JOIN skills s ON js.skill_id = s.skill_id
      WHERE js.job_id = $1
    `;
        const jobSkillsResult = yield db_config_1.default.query(jobSkillsQuery, [jobId]);
        if (jobSkillsResult.rows.length === 0) {
            return 0; // No skills required for this job
        }
        // Get jobseeker's user_id
        const jobseekerQuery = 'SELECT user_id FROM jobseekers WHERE jobseeker_id = $1';
        const jobseekerResult = yield db_config_1.default.query(jobseekerQuery, [jobseekerId]);
        if (jobseekerResult.rows.length === 0) {
            return 0; // Jobseeker not found
        }
        const userId = jobseekerResult.rows[0].user_id;
        // Get candidate skills
        const candidateSkillsQuery = `
      SELECT us.skill_id, s.skill_name, us.proficiency_score
      FROM userskills us
      JOIN skills s ON us.skill_id = s.skill_id
      WHERE us.user_id = $1
    `;
        const candidateSkillsResult = yield db_config_1.default.query(candidateSkillsQuery, [userId]);
        // Create a map of candidate skills for easy lookup
        const candidateSkillsMap = new Map();
        candidateSkillsResult.rows.forEach(skill => {
            candidateSkillsMap.set(skill.skill_id, skill.proficiency_score);
        });
        // Calculate match score
        let totalScore = 0;
        let totalWeight = 0;
        jobSkillsResult.rows.forEach(jobSkill => {
            const skillId = jobSkill.skill_id;
            const importanceLevel = jobSkill.importance_level;
            totalWeight += importanceLevel;
            // Check if candidate has this skill
            if (candidateSkillsMap.has(skillId)) {
                const proficiencyScore = candidateSkillsMap.get(skillId);
                // Normalize proficiency to 0-1 range
                const normalizedProficiency = proficiencyScore / 100;
                // Weight the score by importance
                totalScore += normalizedProficiency * importanceLevel;
            }
        });
        // Calculate final score (0-100 scale)
        const matchScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
        return Math.min(100, Math.max(0, matchScore));
    }
    catch (error) {
        console.error('Error calculating match score:', error);
        return 0;
    }
});
exports.calculateMatchScore = calculateMatchScore;
const findMatchesForJob = (jobId_1, ...args_1) => __awaiter(void 0, [jobId_1, ...args_1], void 0, function* (jobId, limit = 10) {
    try {
        // Get job details
        const jobQuery = 'SELECT * FROM jobs WHERE job_id = $1';
        const jobResult = yield db_config_1.default.query(jobQuery, [jobId]);
        if (jobResult.rows.length === 0) {
            return []; // Job not found
        }
        // Get all jobseekers
        const jobseekersQuery = `
      SELECT js.*, u.full_name, u.email
      FROM jobseekers js
      JOIN users u ON js.user_id = u.user_id
    `;
        const jobseekersResult = yield db_config_1.default.query(jobseekersQuery);
        // Calculate match score for each jobseeker
        const matchPromises = jobseekersResult.rows.map((jobseeker) => __awaiter(void 0, void 0, void 0, function* () {
            const score = yield (0, exports.calculateMatchScore)(jobId, jobseeker.jobseeker_id);
            return {
                jobseeker_id: jobseeker.jobseeker_id,
                name: jobseeker.full_name,
                position: jobseeker.headline || jobseeker.current_company,
                location: 'Not specified',
                matchScore: score
            };
        }));
        const matches = yield Promise.all(matchPromises);
        // Sort by match score and take top matches
        return matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, limit);
    }
    catch (error) {
        console.error('Error finding matches for job:', error);
        return [];
    }
});
exports.findMatchesForJob = findMatchesForJob;
