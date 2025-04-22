import pool from '../config/db.config';

interface SkillMatch {
  skill_id: number;
  skill_name: string;
  job_importance: number;
  candidate_proficiency: number;
}

export const calculateMatchScore = async (jobId: number, jobseekerId: number): Promise<number> => {
  try {
    // Get job skills
    const jobSkillsQuery = `
      SELECT js.skill_id, s.skill_name, js.importance_level
      FROM jobskills js
      JOIN skills s ON js.skill_id = s.skill_id
      WHERE js.job_id = $1
    `;
    const jobSkillsResult = await pool.query(jobSkillsQuery, [jobId]);
    
    if (jobSkillsResult.rows.length === 0) {
      return 0; // No skills required for this job
    }
    
    // Get jobseeker's user_id
    const jobseekerQuery = 'SELECT user_id FROM jobseekers WHERE jobseeker_id = $1';
    const jobseekerResult = await pool.query(jobseekerQuery, [jobseekerId]);
    
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
    const candidateSkillsResult = await pool.query(candidateSkillsQuery, [userId]);
    
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
  } catch (error) {
    console.error('Error calculating match score:', error);
    return 0;
  }
};

export const findMatchesForJob = async (jobId: number, limit: number = 10): Promise<any[]> => {
  try {
    // Get job details
    const jobQuery = 'SELECT * FROM jobs WHERE job_id = $1';
    const jobResult = await pool.query(jobQuery, [jobId]);
    
    if (jobResult.rows.length === 0) {
      return []; // Job not found
    }
    
    // Get all jobseekers
    const jobseekersQuery = `
      SELECT js.*, u.full_name, u.email
      FROM jobseekers js
      JOIN users u ON js.user_id = u.user_id
    `;
    const jobseekersResult = await pool.query(jobseekersQuery);
    
    // Calculate match score for each jobseeker
    const matchPromises = jobseekersResult.rows.map(async jobseeker => {
      const score = await calculateMatchScore(jobId, jobseeker.jobseeker_id);
      return {
        jobseeker_id: jobseeker.jobseeker_id,
        name: jobseeker.full_name,
        position: jobseeker.headline || jobseeker.current_company,
        location: 'Not specified',
        matchScore: score
      };
    });
    
    const matches = await Promise.all(matchPromises);
    
    // Sort by match score and take top matches
    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);
  } catch (error) {
    console.error('Error finding matches for job:', error);
    return [];
  }
};