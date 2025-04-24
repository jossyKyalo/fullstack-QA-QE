"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const db_config_1 = __importDefault(require("../config/db.config"));
const generateToken_1 = require("../utils/helpers/generateToken");
// Register a new user (Job Seeker, Recruiter, Admin)
exports.registerUser = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, full_name, password, user_type = 'job_seeker' } = req.body;
    // Check if user exists
    const userExists = yield db_config_1.default.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    // Hash password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
    // Insert user into DB
    const newUserResult = yield db_config_1.default.query("INSERT INTO users (email, full_name, password, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id, email, full_name, user_type", [email, full_name, hashedPassword, user_type]);
    const newUser = newUserResult.rows[0];
    const newUserId = newUser.user_id;
    if (user_type === 'recruiter') {
        yield db_config_1.default.query("INSERT INTO recruiters (user_id) VALUES ($1)", [newUserId]);
    }
    else if (user_type === 'job_seeker') {
        yield db_config_1.default.query("INSERT INTO jobseekers (user_id) VALUES ($1)", [
            newUserId
        ]);
    }
    // Generate JWT Token
    (0, generateToken_1.generateTokens)({
        user_id: newUserId,
        user_type: user_type,
        email: newUser.email,
        full_name: newUser.full_name,
    });
    res.status(201).json({
        message: "User registered successfully",
        user: newUser
    });
    next();
}));
// Login a user (Job Seeker, Recruiter, Admin)
exports.loginUser = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if user exists
    const userQuery = yield db_config_1.default.query(`SELECT user_id,  email, full_name, password, user_type, last_login
         FROM users WHERE email = $1`, [email]);
    if (userQuery.rows.length === 0) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    const user = userQuery.rows[0];
    // Compare passwords
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
    }
    let onboardingComplete = false;
    if (user.user_type === 'job_seeker') {
        const jobSeekerQuery = yield db_config_1.default.query("SELECT onboarding_complete FROM jobseekers WHERE user_id = $1", [user.user_id]);
        if (jobSeekerQuery.rows.length > 0) {
            onboardingComplete = jobSeekerQuery.rows[0].onboarding_complete;
        }
    }
    // Generate JWT Token
    const { accessToken, refreshToken } = (0, generateToken_1.generateTokens)({
        user_id: user.user_id,
        user_type: user.user_type,
        email: user.email,
        full_name: user.full_name,
    });
    // Update last login timestamp
    yield db_config_1.default.query("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1", [user.user_id]);
    res.status(200).json({ accessToken, refreshToken, user });
    next();
}));
// Logout a user (clear cookies)
exports.logoutUser = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("access_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0) // Expire immediately
    });
    res.cookie("refresh_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0) // Expire immediately
    });
    res.status(200).json({ message: "User logged out successfully" });
    next();
}));
