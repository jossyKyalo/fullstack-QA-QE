"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.searchUsers = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getUsers = exports.initializeMetrics = exports.updateGrowthMetrics = exports.getMetrics = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cron = __importStar(require("node-cron"));
exports.getMetrics = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, jobSeekers, recruiters] = yield Promise.all([
        db_config_1.default.query('SELECT COUNT(*) FROM users'),
        db_config_1.default.query("SELECT COUNT(*) FROM users WHERE user_type = 'job_seeker'"),
        db_config_1.default.query("SELECT COUNT(*) FROM users WHERE user_type = 'recruiter'")
    ]);
    const totalCount = parseInt(totalUsers.rows[0].count);
    const jobSeekersCount = parseInt(jobSeekers.rows[0].count);
    const recruitersCount = parseInt(recruiters.rows[0].count);
    const growthMetricsQuery = `
      SELECT DISTINCT ON (metric_name) metric_name, value
      FROM systemmetrics 
      WHERE metric_name IN ('total_users_growth', 'job_seekers_growth', 'recruiters_growth')
      AND recorded_at >= NOW() - INTERVAL '1 month'
      ORDER BY metric_name, recorded_at DESC
    `;
    const result = yield db_config_1.default.query(growthMetricsQuery);
    const growthMetrics = {};
    result.rows.forEach(row => {
        growthMetrics[row.metric_name] = parseFloat(row.value);
    });
    const metrics = {
        totalUsers: {
            count: totalCount,
            growth: growthMetrics['total_users_growth'] || 0
        },
        jobSeekers: {
            count: jobSeekersCount,
            growth: growthMetrics['job_seekers_growth'] || 0
        },
        recruiters: {
            count: recruitersCount,
            growth: growthMetrics['recruiters_growth'] || 0
        }
    };
    res.json(metrics);
}));
const updateGrowthMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Current counts
        const [totalUsers, jobSeekers, recruiters] = yield Promise.all([
            db_config_1.default.query('SELECT COUNT(*) FROM users'),
            db_config_1.default.query("SELECT COUNT(*) FROM users WHERE user_type = 'job_seeker'"),
            db_config_1.default.query("SELECT COUNT(*) FROM users WHERE user_type = 'recruiter'")
        ]);
        const totalCount = parseInt(totalUsers.rows[0].count);
        const jobSeekersCount = parseInt(jobSeekers.rows[0].count);
        const recruitersCount = parseInt(recruiters.rows[0].count);
        // Historical counts
        const [prevTotalUsers, prevJobSeekers, prevRecruiters] = yield Promise.all([
            db_config_1.default.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'total_users' ORDER BY recorded_at DESC LIMIT 1`),
            db_config_1.default.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'job_seekers' ORDER BY recorded_at DESC LIMIT 1`),
            db_config_1.default.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'recruiters' ORDER BY recorded_at DESC LIMIT 1`)
        ]);
        const calculateGrowth = (current, previous) => {
            if (!previous || previous === 0)
                return 0;
            return ((current - previous) / previous) * 100;
        };
        const totalGrowth = calculateGrowth(totalCount, (_a = prevTotalUsers.rows[0]) === null || _a === void 0 ? void 0 : _a.value);
        const jobSeekersGrowth = calculateGrowth(jobSeekersCount, (_b = prevJobSeekers.rows[0]) === null || _b === void 0 ? void 0 : _b.value);
        const recruitersGrowth = calculateGrowth(recruitersCount, (_c = prevRecruiters.rows[0]) === null || _c === void 0 ? void 0 : _c.value);
        // Update growth metrics
        yield Promise.all([
            db_config_1.default.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['total_users_growth', totalGrowth]),
            db_config_1.default.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['job_seekers_growth', jobSeekersGrowth]),
            db_config_1.default.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['recruiters_growth', recruitersGrowth])
        ]);
        // Update historical counts
        yield Promise.all([
            db_config_1.default.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['total_users', totalCount]),
            db_config_1.default.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['job_seekers', jobSeekersCount]),
            db_config_1.default.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())', ['recruiters', recruitersCount])
        ]);
        console.log('✅ Growth metrics updated:', {
            totalGrowth, jobSeekersGrowth, recruitersGrowth
        });
        return {
            totalGrowth,
            jobSeekersGrowth,
            recruitersGrowth
        };
    }
    catch (error) {
        console.error('❌ Error updating growth metrics:', error);
        throw error;
    }
});
exports.updateGrowthMetrics = updateGrowthMetrics;
const initializeMetrics = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_config_1.default.query('SELECT COUNT(*) FROM historicalmetrics');
    if (parseInt(result.rows[0].count) === 0) {
        console.log('📊 Initializing metrics...');
        yield (0, exports.updateGrowthMetrics)();
    }
});
exports.initializeMetrics = initializeMetrics;
cron.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('⏰ Scheduled growth metrics update');
    try {
        yield (0, exports.updateGrowthMetrics)();
    }
    catch (error) {
        console.error('❌ Scheduled update error:', error);
    }
}));
// Get all users with pagination and filtering (Admin only)
exports.getUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const userType = req.query.role;
    let usersWhereClause = '';
    let countWhereClause = '';
    const usersValues = [limit, offset];
    const countValues = [];
    if (userType && userType !== 'All Users') {
        usersWhereClause = "WHERE user_type = $3";
        countWhereClause = "WHERE user_type = $1";
        usersValues.push(userType.toLowerCase());
        countValues.push(userType.toLowerCase());
    }
    const usersQuery = `
        SELECT 
            u.user_id,
            u.full_name,
            u.email,
            u.user_type,
            CASE 
                WHEN u.last_login >= NOW() - INTERVAL '24 hours' THEN 'Active'
                WHEN u.last_login >= NOW() - INTERVAL '7 days' THEN 'Inactive'
                ELSE 'Pending'
            END as status
        FROM users u
        ${usersWhereClause}
        ORDER BY u.created_at DESC
        LIMIT $1 OFFSET $2
    `;
    const countQuery = `
        SELECT COUNT(*) 
        FROM users 
        ${countWhereClause}
    `;
    const [usersResult, countResult] = yield Promise.all([
        db_config_1.default.query(usersQuery, usersValues),
        db_config_1.default.query(countQuery, countValues)
    ]);
    const transformedUsers = usersResult.rows.map(user => ({
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.user_type,
        status: user.status,
        initials: user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase(),
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
    }));
    res.status(200).json({
        users: transformedUsers,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        currentPage: page,
        total: parseInt(countResult.rows[0].count)
    });
}));
// Get a user by ID
exports.getUserById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    const result = yield db_config_1.default.query("SELECT user_id, email, full_name, user_type FROM users WHERE user_id = $1", [user_id]);
    if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(result.rows[0]);
}));
// Create a new user (Admin only)
exports.createUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, full_name, password, user_type } = req.body;
    // Check if email already exists
    const existingUser = yield db_config_1.default.query("SELECT user_id FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }
    // Hash password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    // Insert user into Users table
    const newUser = yield db_config_1.default.query("INSERT INTO users (email, full_name, password, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email, user_type", [email, full_name, hashedPassword, user_type]);
    // Create corresponding profile based on user type
    if (user_type === 'job_seeker') {
        yield db_config_1.default.query("INSERT INTO jobseekers (user_id) VALUES ($1)", [newUser.rows[0].user_id]);
    }
    else if (user_type === 'recruiter') {
        yield db_config_1.default.query("INSERT INTO recruiters (user_id) VALUES ($1)", [newUser.rows[0].user_id]);
    }
    res.status(201).json(newUser.rows[0]);
}));
// Update user (Admin only)
exports.updateUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User not found" });
        return;
    }
    const { user_id } = req.params;
    const { email, full_name, user_type } = req.body;
    // Only Admins can change roles
    if (req.user.user_type !== "admin" && user_type) {
        res.status(403).json({ message: "Only Admins can change roles" });
        return;
    }
    const updateQuery = `
        UPDATE users 
        SET 
            email = COALESCE($1, email),
            full_name = COALESCE($2, full_name),
            user_type = COALESCE($3, user_type),
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $4 
        RETURNING user_id, full_name, email, user_type
    `;
    const updatedUser = yield db_config_1.default.query(updateQuery, [
        email,
        full_name,
        user_type,
        user_id
    ]);
    if (updatedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json(updatedUser.rows[0]);
}));
// Delete user (Admin only)
exports.deleteUser = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    // Delete user from Users table (cascade will handle related records)
    const deletedUser = yield db_config_1.default.query("DELETE FROM users WHERE user_id = $1 RETURNING user_id", [user_id]);
    if (deletedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.status(200).json({ message: "User deleted successfully" });
}));
exports.searchUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    if (!query) {
        res.status(400);
        throw new Error('Search query parameter "q" is required');
    }
    const [usersResult, countResult] = yield Promise.all([
        db_config_1.default.query(`
          SELECT 
            u.user_id,
            u.full_name,
            u.email,
            u.user_type,
            CASE 
              WHEN u.last_login >= NOW() - INTERVAL '24 hours' THEN 'Active'
              WHEN u.last_login >= NOW() - INTERVAL '7 days' THEN 'Inactive'
              ELSE 'Pending'
            END as status
          FROM users u
          WHERE u.full_name ILIKE $1 OR u.email ILIKE $1
          LIMIT $2 OFFSET $3
        `, [`%${query}%`, limit, (page - 1) * limit]),
        db_config_1.default.query(`
          SELECT COUNT(*) 
          FROM users 
          WHERE full_name ILIKE $1 OR email ILIKE $1
        `, [`%${query}%`])
    ]);
    const transformedUsers = usersResult.rows.map(user => ({
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.user_type,
        status: user.status,
        initials: user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase(),
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
    }));
    res.status(200).json({
        users: transformedUsers,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        currentPage: page,
        total: parseInt(countResult.rows[0].count)
    });
}));
