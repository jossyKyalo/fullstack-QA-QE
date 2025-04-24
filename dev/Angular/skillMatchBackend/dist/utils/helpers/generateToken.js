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
const generateTokens = (userId, role) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!jwtSecret || !refreshSecret) {
        throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables");
    }
    try {
        // Generate access token (e.g., 15 mins or 7 days for testing)
        const accessToken = jsonwebtoken_1.default.sign({ user_id: userId, user_type: role }, jwtSecret, { expiresIn: "7d" });
        // Generate refresh token (e.g., 30 days)
        const refreshToken = jsonwebtoken_1.default.sign({ user_id: userId }, refreshSecret, { expiresIn: "30d" });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Error generating authentication tokens");
    }
};
exports.generateTokens = generateTokens;
