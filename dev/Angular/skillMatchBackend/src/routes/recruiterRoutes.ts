// src/routes/recruiterRoutes.ts
import express from 'express';
import { 
  getRecruiterProfile,
  getRecruiterMetrics,
  getActiveJobs,
  getCandidateMatches,
  createJob,
  searchCandidates,
  contactCandidate
} from '../controllers/recruiterController';
import { authenticateToken, isRecruiter } from '../middlewares/authMiddleware';

const router = express.Router();
 
router.use(authenticateToken);
router.use(isRecruiter);

// Recruiter dashboard routes
router.get('/profile/:id', getRecruiterProfile);
router.get('/metrics/:id', getRecruiterMetrics);
router.get('/jobs/active/:id', getActiveJobs);
router.get('/candidates/matches/:id', getCandidateMatches);
router.post('/jobs', createJob);
router.get('/search', searchCandidates);
router.post('/contact', contactCandidate);

export default router;