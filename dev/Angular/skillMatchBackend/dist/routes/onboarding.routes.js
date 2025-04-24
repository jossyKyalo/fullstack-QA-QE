"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboardingController_1 = require("../controllers/onboardingController");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/onboarding", authMiddleware_1.authenticateToken, upload_middleware_1.uploadOnboardingFiles, onboardingController_1.createJobSeekerProfile);
exports.default = router;
