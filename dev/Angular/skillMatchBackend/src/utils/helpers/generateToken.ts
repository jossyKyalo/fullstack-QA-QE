import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const generateTokens = (user: { user_id: number; user_type: string; email: string; full_name: string }) => {
    const jwtSecret = process.env.JWT_SECRET;
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!jwtSecret || !refreshSecret) {
        throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables");
    }

    try {
        const accessToken = jwt.sign(
            { user_id: user.user_id.toString(), user_type: user.user_type, email: user.email, full_name: user.full_name }, // user_id as string
            jwtSecret,
            { expiresIn: "7d" }
        );

        const refreshToken = jwt.sign(
            { user_id: user.user_id.toString() }, // user_id as string
            refreshSecret,
            { expiresIn: "30d" }
        );

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating JWT:", error);
        throw new Error("Error generating authentication tokens");
    }
};