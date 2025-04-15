// routes/dashboard.routes.ts
import express from "express";
import { checkOnboarding } from "../middlewares/checkOnboarding.middleware";
import { getJobSeekerDashboard } from "../controllers/dashboardController";

const router = express.Router();

router.get("/dashboard", checkOnboarding, getJobSeekerDashboard);

export default router;
