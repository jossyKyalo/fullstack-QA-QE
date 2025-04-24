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
import { protect } from '../middlewares/auth/protect';

const router = express.Router();
 
router.use(protect);
 

// Recruiter dashboard routes
router.get('/profile/:id', getRecruiterProfile);
router.get('/metrics/:id', getRecruiterMetrics);
router.get('/jobs/active/:id', getActiveJobs);
router.get('/candidates/matches/:id', getCandidateMatches);
router.post('/jobs', createJob);
router.get('/search', searchCandidates);
router.post('/contact', contactCandidate);

router.post('/test-job', (req, res) => {
  console.log('Hit the /test-job route!');
  res.status(200).json({ message: 'Test POST job route works!' });
 });

export default router;