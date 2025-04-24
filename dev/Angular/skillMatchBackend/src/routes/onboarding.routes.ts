import express from 'express';
import { createJobSeekerProfile } from '../controllers/onboardingController';
import { protect } from '../middlewares/auth/protect';
import uploadOnboardingFiles from '../middlewares/upload.middleware';  

const router = express.Router();

router.post('/onboarding', protect, uploadOnboardingFiles, createJobSeekerProfile);

export default router;