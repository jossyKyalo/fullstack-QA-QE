"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const onboardingController_1 = require("../controllers/onboardingController");
const protect_1 = require("../middlewares/auth/protect");
const upload_middleware_1 = __importDefault(require("../middlewares/upload.middleware"));
const router = express_1.default.Router();
router.post('/onboarding', protect_1.protect, upload_middleware_1.default, onboardingController_1.createJobSeekerProfile);
exports.default = router;
