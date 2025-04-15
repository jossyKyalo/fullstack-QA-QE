import express from "express";
import { createJobSeekerProfile } from "../controllers/onboardingController";
import { uploadProfilePhoto } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/onboarding", uploadProfilePhoto.single("profilePhoto"), createJobSeekerProfile);

export default router;
