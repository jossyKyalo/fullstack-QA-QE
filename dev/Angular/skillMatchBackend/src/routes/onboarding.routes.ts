import express from "express";
import { createJobSeekerProfile } from "../controllers/onboardingController";
import { uploadOnboardingFiles } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/onboarding",  uploadOnboardingFiles, createJobSeekerProfile);

export default router;
