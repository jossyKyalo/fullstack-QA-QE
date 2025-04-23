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
exports.getJobSeekerDashboard = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const getJobSeekerDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["user-id"];
    try {
        const jobseekerInfo = yield db_config_1.default.query(`SELECT headline, years_experience, location, remote_preference
       FROM jobseekers WHERE user_id = $1`, [userId]);
        const skills = yield db_config_1.default.query(`SELECT skill_name, proficiency FROM jobseeker_skills WHERE user_id = $1`, [userId]);
        const preferences = yield db_config_1.default.query(`SELECT employment_type FROM jobseeker_preferences WHERE user_id = $1`, [userId]);
        res.status(200).json({
            profile: jobseekerInfo.rows[0],
            skills: skills.rows,
            preferences: preferences.rows,
        });
    }
    catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).json({ error: "Could not load dashboard data" });
    }
});
exports.getJobSeekerDashboard = getJobSeekerDashboard;
