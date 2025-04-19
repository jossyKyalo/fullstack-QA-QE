import { Request, Response } from "express";
import pool from "../config/db.config";
import asyncHandler from "../middlewares/asyncHandler";
import bcrypt from "bcryptjs";
import { UserRequest } from "../utils/types/userTypes";
import * as cron from 'node-cron';

export const getMetrics = asyncHandler(async (req: Request, res: Response) => {
    const [totalUsers, jobSeekers, recruiters] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM users'),
        pool.query("SELECT COUNT(*) FROM users WHERE user_type = 'job_seeker'"),
        pool.query("SELECT COUNT(*) FROM users WHERE user_type = 'recruiter'")
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

    const result = await pool.query(growthMetricsQuery);
    const growthMetrics: Record<string, number> = {};
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
});


export const updateGrowthMetrics = async () => {
    try {
        // Current counts
        const [totalUsers, jobSeekers, recruiters] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query("SELECT COUNT(*) FROM users WHERE user_type = 'job_seeker'"),
            pool.query("SELECT COUNT(*) FROM users WHERE user_type = 'recruiter'")
        ]);

        const totalCount = parseInt(totalUsers.rows[0].count);
        const jobSeekersCount = parseInt(jobSeekers.rows[0].count);
        const recruitersCount = parseInt(recruiters.rows[0].count);

        // Historical counts
        const [prevTotalUsers, prevJobSeekers, prevRecruiters] = await Promise.all([
            pool.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'total_users' ORDER BY recorded_at DESC LIMIT 1`),
            pool.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'job_seekers' ORDER BY recorded_at DESC LIMIT 1`),
            pool.query(`SELECT value FROM historicalmetrics WHERE metric_name = 'recruiters' ORDER BY recorded_at DESC LIMIT 1`)
        ]);

        const calculateGrowth = (current: number, previous?: number): number => {
            if (!previous || previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        };

        const totalGrowth = calculateGrowth(totalCount, prevTotalUsers.rows[0]?.value);
        const jobSeekersGrowth = calculateGrowth(jobSeekersCount, prevJobSeekers.rows[0]?.value);
        const recruitersGrowth = calculateGrowth(recruitersCount, prevRecruiters.rows[0]?.value);

        // Update growth metrics
        await Promise.all([
            pool.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['total_users_growth', totalGrowth]),
            pool.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['job_seekers_growth', jobSeekersGrowth]),
            pool.query('INSERT INTO systemmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['recruiters_growth', recruitersGrowth])
        ]);

        // Update historical counts
        await Promise.all([
            pool.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['total_users', totalCount]),
            pool.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['job_seekers', jobSeekersCount]),
            pool.query('INSERT INTO historicalmetrics (metric_name, value, recorded_at) VALUES ($1, $2, NOW())',
                ['recruiters', recruitersCount])
        ]);

        console.log('✅ Growth metrics updated:', {
            totalGrowth, jobSeekersGrowth, recruitersGrowth
        });

        return {
            totalGrowth,
            jobSeekersGrowth,
            recruitersGrowth
        };
    } catch (error) {
        console.error('❌ Error updating growth metrics:', error);
        throw error;
    }
};


export const initializeMetrics = async () => {
    const result = await pool.query('SELECT COUNT(*) FROM historicalmetrics');
    if (parseInt(result.rows[0].count) === 0) {
        console.log('📊 Initializing metrics...');
        await updateGrowthMetrics();
    }
};


cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Scheduled growth metrics update');
    try {
        await updateGrowthMetrics();
    } catch (error) {
        console.error('❌ Scheduled update error:', error);
    }
});

// Get all users with pagination and filtering (Admin only)
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const userType = req.query.role as string;

    let usersWhereClause = '';
    let countWhereClause = '';
    const usersValues: any[] = [limit, offset];
    const countValues: any[] = [];

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

    const [usersResult, countResult] = await Promise.all([
        pool.query(usersQuery, usersValues),
        pool.query(countQuery, countValues)
    ]);

    const transformedUsers = usersResult.rows.map(user => ({
        id: user.user_id,
        name: user.full_name,
        email: user.email,
        role: user.user_type,
        status: user.status,
        initials: user.full_name.split(' ').map((n: any) => n[0]).join('').toUpperCase(),
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
    }));

    res.status(200).json({
        users: transformedUsers,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        currentPage: page,
        total: parseInt(countResult.rows[0].count)
    });
});

// Get a user by ID
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const result = await pool.query(
        "SELECT user_id, email, full_name, user_type FROM users WHERE user_id = $1",
        [user_id]
    );

    if (result.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.status(200).json(result.rows[0]);
});

// Create a new user (Admin only)
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, full_name, password, user_type } = req.body;

    // Check if email already exists
    const existingUser = await pool.query(
        "SELECT user_id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Users table
    const newUser = await pool.query(
        "INSERT INTO users (email, full_name, password, user_type) VALUES ($1, $2, $3, $4) RETURNING user_id, full_name, email, user_type",
        [email, full_name, hashedPassword, user_type]
    );

    // Create corresponding profile based on user type
    if (user_type === 'job_seeker') {
        await pool.query(
            "INSERT INTO jobseekers (user_id) VALUES ($1)",
            [newUser.rows[0].user_id]
        );
    } else if (user_type === 'recruiter') {
        await pool.query(
            "INSERT INTO recruiters (user_id) VALUES ($1)",
            [newUser.rows[0].user_id]
        );
    }

    res.status(201).json(newUser.rows[0]);
});

// Update user (Admin only)
export const updateUser = asyncHandler(async (req: UserRequest, res: Response) => {
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

    const updatedUser = await pool.query(updateQuery, [
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
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;

    // Delete user from Users table (cascade will handle related records)
    const deletedUser = await pool.query(
        "DELETE FROM users WHERE user_id = $1 RETURNING user_id",
        [user_id]
    );

    if (deletedUser.rows.length === 0) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.status(200).json({ message: "User deleted successfully" });
});

export const searchUsers = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
        res.status(400);
        throw new Error('Search query parameter "q" is required');
    }

    const [usersResult, countResult] = await Promise.all([
        pool.query(`
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

        pool.query(`
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
        initials: user.full_name.split(' ').map((n: any) => n[0]).join('').toUpperCase(),
        color: `hsl(${Math.random() * 360}, 70%, 80%)`
    }));

    res.status(200).json({
        users: transformedUsers,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        currentPage: page,
        total: parseInt(countResult.rows[0].count)
    });
});
