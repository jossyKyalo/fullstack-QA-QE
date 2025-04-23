"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadOnboardingFiles = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.uploadOnboardingFiles = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, //10MB for resumes
}).fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "resume", maxCount: 1 },
]);
