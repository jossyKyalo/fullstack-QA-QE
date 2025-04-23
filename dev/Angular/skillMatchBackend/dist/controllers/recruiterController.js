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
exports.contactCandidate = exports.searchCandidates = exports.createJob = exports.getCandidateMatches = exports.getActiveJobs = exports.getRecruiterMetrics = exports.getRecruiterProfile = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const getRecruiterProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiterId = parseInt(req.params.id);
        const recruiterQuery = `
      SELECT r.*, u.full_name, u.email, c.company_name
      FROM recruiters r
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN companies c ON r.company_id = c.company_id
      WHERE r.recruiter_id = $1
    `;
        const recruiterResult = yield db_config_1.default.query(recruiterQuery, [recruiterId]);
        if (recruiterResult.rows.length === 0) {
            res.status(404).json({ message: 'Recruiter not found' });
            return;
        }
        res.status(200).json(recruiterResult.rows[0]);
        return;
    }
    catch (error) {
        console.error('Error fetching recruiter profile:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.getRecruiterProfile = getRecruiterProfile;
const getRecruiterMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiterId = parseInt(req.params.id);
        // Get application rate
        const applicationRateQuery = `
      SELECT COUNT(a.application_id) as total_applications, 
             COUNT(DISTINCT j.job_id) as total_jobs
      FROM jobs j
      LEFT JOIN applications a ON j.job_id = a.job_id
      WHERE j.recruiter_id = $1 AND j.status = 'active'
    `;
        const applicationRateResult = yield db_config_1.default.query(applicationRateQuery, [recruiterId]);
        const { total_applications, total_jobs } = applicationRateResult.rows[0];
        const applicationRate = total_jobs > 0 ? ((total_applications / total_jobs) * 100).toFixed(1) : '0';
        // Get candidate quality (average match score)
        const qualityQuery = `
      SELECT AVG(a.match_score) as avg_quality
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      WHERE j.recruiter_id = $1
    `;
        const qualityResult = yield db_config_1.default.query(qualityQuery, [recruiterId]);
        const candidateQuality = (qualityResult.rows[0].avg_quality || 0).toFixed(1);
        // Get average time to hire
        const timeToHireQuery = `
      SELECT AVG(EXTRACT(DAY FROM a.applied_date - j.created_at)) as avg_days
      FROM applications a
      JOIN jobs j ON a.job_id = j.job_id
      WHERE j.recruiter_id = $1 AND a.status = 'hired'
    `;
        const timeToHireResult = yield db_config_1.default.query(timeToHireQuery, [recruiterId]);
        const avgTimeToHire = Math.round(timeToHireResult.rows[0].avg_days || 0);
        // Create metrics array (you would normally calculate trends from historical data)
        const metrics = [
            {
                title: 'Application rate',
                value: `${applicationRate}%`,
                trend: '+3.5%',
                isPositive: true
            },
            {
                title: 'Candidate Quality',
                value: `${candidateQuality}/10`,
                trend: '+0.4%',
                isPositive: true
            },
            {
                title: 'Avg. Time to Hire',
                value: `${avgTimeToHire} days`,
                trend: '-10 days',
                isPositive: true
            }
        ];
        res.status(200).json(metrics);
        return;
    }
    catch (error) {
        console.error('Error fetching recruiter metrics:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.getRecruiterMetrics = getRecruiterMetrics;
const getActiveJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiterId = parseInt(req.params.id);
        const jobsQuery = `
      SELECT j.*, c.company_name, c.industry,
             (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.job_id) as applicant_count
      FROM jobs j
      LEFT JOIN companies c ON j.company_id = c.company_id
      WHERE j.recruiter_id = $1 AND j.status = 'active'
      ORDER BY j.created_at DESC
    `;
        const jobsResult = yield db_config_1.default.query(jobsQuery, [recruiterId]);
        const activeJobs = jobsResult.rows.map(job => ({
            job_id: job.job_id,
            title: job.title,
            department: job.industry || 'General',
            location: job.location,
            applicants: parseInt(job.applicant_count) || 0,
            description: job.description,
            remote_option: job.remote_option,
            employment_type: job.employment_type,
            created_at: job.created_at,
            status: job.status
        }));
        res.status(200).json(activeJobs);
        return;
    }
    catch (error) {
        console.error('Error fetching active jobs:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.getActiveJobs = getActiveJobs;
const getCandidateMatches = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recruiterId = parseInt(req.params.id);
        // Get recruiter's active jobs
        const recruiterJobsQuery = `
      SELECT job_id FROM jobs
      WHERE recruiter_id = $1 AND status = 'active'
    `;
        const recruiterJobsResult = yield db_config_1.default.query(recruiterJobsQuery, [recruiterId]);
        const jobIds = recruiterJobsResult.rows.map(job => job.job_id);
        if (jobIds.length === 0) {
            res.status(200).json([]);
            return;
        }
        // Get matches for those jobs
        const matchesQuery = `
      SELECT m.*, j.title as job_title, j.location as job_location,
             u.full_name, js.current_company, js.headline
      FROM matches m
      JOIN jobseekers js ON m.jobseeker_id = js.jobseeker_id
      JOIN users u ON js.user_id = u.user_id
      JOIN jobs j ON m.job_id = j.job_id
      WHERE m.job_id = ANY($1::int[]) AND m.status = 'pending'
      ORDER BY m.match_score DESC
      LIMIT 10
    `;
        const matchesResult = yield db_config_1.default.query(matchesQuery, [jobIds]);
        const candidates = matchesResult.rows.map(match => ({
            jobseeker_id: match.jobseeker_id,
            name: match.full_name,
            position: match.headline || match.current_company,
            location: match.job_location,
            matchScore: parseFloat(match.match_score) || 0
        }));
        res.status(200).json(candidates);
        return;
    }
    catch (error) {
        console.error('Error fetching candidate matches:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.getCandidateMatches = getCandidateMatches;
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, location, remote_option, employment_type, company_id, recruiter_id } = req.body;
        const insertJobQuery = `
      INSERT INTO jobs (
        company_id, 
        recruiter_id, 
        title, 
        description, 
        location, 
        remote_option, 
        employment_type, 
        status
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active') 
      RETURNING *
    `;
        const values = [
            company_id,
            recruiter_id,
            title,
            description,
            location,
            remote_option,
            employment_type
        ];
        const result = yield db_config_1.default.query(insertJobQuery, values);
        res.status(201).json(result.rows[0]);
        return;
    }
    catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.createJob = createJob;
const searchCandidates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            res.status(400).json({ message: 'Search query is required' });
            return;
        }
        const searchQuery = `
      SELECT js.*, u.full_name, u.email
      FROM jobseekers js
      JOIN users u ON js.user_id = u.user_id
      LEFT JOIN userskills us ON u.user_id = us.user_id
      LEFT JOIN skills s ON us.skill_id = s.skill_id
      WHERE 
        u.full_name ILIKE $1 OR
        js.headline ILIKE $1 OR
        js.current_company ILIKE $1 OR
        s.skill_name ILIKE $1
      GROUP BY js.jobseeker_id, u.user_id
      LIMIT 20
    `;
        const searchResults = yield db_config_1.default.query(searchQuery, [`%${query}%`]);
        const candidates = searchResults.rows.map(row => ({
            jobseeker_id: row.jobseeker_id,
            name: row.full_name,
            position: row.headline || row.current_company,
            location: 'Not specified', // This info might need to be added to your schema
            years_experience: row.years_experience
        }));
        res.status(200).json(candidates);
        return;
    }
    catch (error) {
        console.error('Error searching candidates:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.searchCandidates = searchCandidates;
const contactCandidate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender_id, receiver_id, related_job_id, content } = req.body;
        const insertMessageQuery = `
      INSERT INTO messages (sender_id, receiver_id, related_job_id, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
        const result = yield db_config_1.default.query(insertMessageQuery, [sender_id, receiver_id, related_job_id, content]);
        res.status(201).json(result.rows[0]);
        return;
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
        return;
    }
});
exports.contactCandidate = contactCandidate;
