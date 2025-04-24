import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

export const generateTokens = (userId: string, role: string) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!jwtSecret || !refreshSecret) {
        throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables");
    }

    try {
        // Generate access token (e.g., 15 mins or 7 days for testing)
        const accessToken = jwt.sign(
            { user_id: userId, user_type: role },
            jwtSecret,
            { expiresIn: "7d" }
        );

        // Generate refresh token (e.g., 30 days)
        const refreshToken = jwt.sign(
            { user_id: userId },
            refreshSecret,
            { expiresIn: "30d" }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Error generating authentication tokens");
    }
};
