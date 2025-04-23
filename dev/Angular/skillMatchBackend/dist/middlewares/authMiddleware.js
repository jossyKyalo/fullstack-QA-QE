"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRecruiter = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ message: 'Authentication token is required' });
            return;
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ message: 'Invalid or expired token' });
                return;
            }
            const payload = decoded;
            console.log("Decoded JWT payload:", payload);
            // Add user info to request
            req.userId = payload.id;
            req.userType = payload.user_type;
            next();
        });
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authenticateToken = authenticateToken;
const isRecruiter = (req, res, next) => {
    if (req.userType !== 'recruiter') {
        res.status(403).json({ message: 'Access denied. Recruiter role required' });
        return;
    }
    next();
};
exports.isRecruiter = isRecruiter;
