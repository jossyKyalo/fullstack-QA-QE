"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const generateTokens = (user) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!jwtSecret || !refreshSecret) {
        throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables");
    }
    try {
        const accessToken = jsonwebtoken_1.default.sign({ user_id: user.user_id.toString(), user_type: user.user_type, email: user.email, full_name: user.full_name }, // user_id as string
        jwtSecret, { expiresIn: "7d" });
        const refreshToken = jsonwebtoken_1.default.sign({ user_id: user.user_id.toString() }, // user_id as string
        refreshSecret, { expiresIn: "30d" });
        return { accessToken, refreshToken };
    }
    catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Error generating authentication tokens");
    }
};
exports.generateTokens = generateTokens;
