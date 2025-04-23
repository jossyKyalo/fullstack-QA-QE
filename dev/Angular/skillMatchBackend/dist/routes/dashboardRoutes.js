"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/dashboard.routes.ts
const express_1 = __importDefault(require("express"));
const checkOnboarding_middleware_1 = require("../middlewares/checkOnboarding.middleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
router.get("/dashboard", checkOnboarding_middleware_1.checkOnboarding, dashboardController_1.getJobSeekerDashboard);
exports.default = router;
