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
exports.checkOnboarding = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const checkOnboarding = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["user-id"];
    if (!userId) {
        res.status(401).json({ error: "User ID required" });
        return;
    }
    const result = yield db_config_1.default.query(`SELECT * FROM jobseekers WHERE user_id = $1`, [userId]);
    if (result.rows.length === 0) {
        res.status(403).json({ message: "Please complete onboarding", redirect: "/onboarding" });
        return;
    }
    next(); // User has onboarded, allow access to dashboard
});
exports.checkOnboarding = checkOnboarding;
