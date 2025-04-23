import express from "express";
import { createJobSeekerProfile } from "../controllers/onboardingController";
import { uploadOnboardingFiles } from "../middlewares/upload.middleware";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/onboarding", authenticateToken, uploadOnboardingFiles, createJobSeekerProfile);

export default router;
