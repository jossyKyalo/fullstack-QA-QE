"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
const generateTokens = (res, userId, role) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!jwtSecret || !refreshSecret) {
        throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables");
    }
    try {
        // Generate short-lived access token (15 mins)
        const accessToken = jsonwebtoken_1.default.sign({ user_id: userId, user_type: role }, jwtSecret, { expiresIn: "7d" });
        // Generate long-lived refresh token (30 days)
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, refreshSecret, { expiresIn: "30d" });
        // Set access token as an HTTP-Only secure cookie
        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development", // Secure in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // Set refresh token as an HTTP-Only secure cookie
        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Error generating authentication tokens");
    }
};
exports.generateTokens = generateTokens;
