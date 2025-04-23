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
exports.getServerStatuses = exports.getHistoricalMetrics = exports.getSystemMetrics = void 0;
const si = __importStar(require("systeminformation"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const db_config_1 = __importDefault(require("../config/db.config"));
// Get current system metrics
exports.getSystemMetrics = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [cpu, mem, disks] = yield Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize()
    ]);
    // Calculate aggregate disk usage across all drives
    const totalDiskSpace = disks.reduce((acc, disk) => acc + disk.size, 0);
    const totalUsedSpace = disks.reduce((acc, disk) => acc + disk.used, 0);
    const aggregateDiskUsage = (totalUsedSpace / totalDiskSpace) * 100;
    // Get disk details for monitoring
    const diskDetails = disks.map(disk => ({
        mount: disk.mount,
        type: disk.type,
        usedPercent: (disk.used / disk.size) * 100,
        total: disk.size,
        used: disk.used,
        free: disk.size - disk.used
    }));
    // Get previous metrics from database for change calculation
    const previousMetrics = yield db_config_1.default.query(`SELECT * FROM system_metrics 
     ORDER BY timestamp DESC 
     LIMIT 1`);
    const metrics = {
        cpu: {
            usage: Math.round(cpu.currentLoad),
            change: previousMetrics.rows[0] ?
                Math.round((cpu.currentLoad - previousMetrics.rows[0].cpu_usage) * 10) / 10 : 0
        },
        memory: {
            usage: Math.round((mem.used / mem.total) * 100),
            change: previousMetrics.rows[0] ?
                Math.round(((mem.used / mem.total) * 100 - previousMetrics.rows[0].memory_usage) * 10) / 10 : 0
        },
        disk: {
            usage: Math.round(aggregateDiskUsage),
            change: previousMetrics.rows[0] ?
                Math.round((aggregateDiskUsage - previousMetrics.rows[0].disk_usage) * 10) / 10 : 0,
            details: diskDetails
        },
        responseTime: {
            value: Math.round(Math.random() * 100 + 150), // Example: Random value between 150-250ms
            change: previousMetrics.rows[0] ?
                Math.round((Math.random() * 20 - 10) * 10) / 10 : 0 // Random change between -10 and +10
        }
    };
    // Store current metrics
    yield db_config_1.default.query(`INSERT INTO system_metrics (cpu_usage, memory_usage, disk_usage, response_time)
     VALUES ($1, $2, $3, $4)`, [metrics.cpu.usage, metrics.memory.usage, metrics.disk.usage, metrics.responseTime.value]);
    res.json(metrics);
}));
// Get historical metrics
exports.getHistoricalMetrics = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = parseInt(req.query.days) || 7;
    const historicalData = yield db_config_1.default.query(`SELECT cpu_usage, memory_usage, timestamp 
     FROM system_metrics 
     WHERE timestamp >= NOW() - INTERVAL '${days} days'
     ORDER BY timestamp ASC`);
    const metrics = {
        cpu: historicalData.rows.map(row => row.cpu_usage),
        memory: historicalData.rows.map(row => row.memory_usage)
    };
    res.json(metrics);
}));
// Get server statuses
exports.getServerStatuses = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get real system information
        const [systemUptime, cpuLoad, memory, processes] = yield Promise.all([
            si.time(),
            si.currentLoad(),
            si.mem(),
            si.processes()
        ]);
        // Check for database process (PostgreSQL)
        const postgresProcess = processes.list.find(p => p.name.toLowerCase().includes('postgres') ||
            p.name.toLowerCase().includes('psql'));
        // Check for any job queue processes (example: Redis, RabbitMQ, etc.)
        const queueProcess = processes.list.find(p => p.name.toLowerCase().includes('redis') ||
            p.name.toLowerCase().includes('rabbit') ||
            p.name.toLowerCase().includes('queue'));
        // Create server status objects
        const applicationServer = {
            name: 'Application Server',
            status: cpuLoad.currentLoad > 90 ? 'degraded' : 'online',
            uptime: systemUptime.uptime, // System uptime in seconds
            load: Math.round(cpuLoad.currentLoad)
        };
        const databaseServer = {
            name: 'Database Server',
            status: postgresProcess ? 'online' : 'offline',
            uptime: yield getDatabaseUptime(),
            load: postgresProcess ? Math.round(postgresProcess.cpu) : 0
        };
        const jobQueueServer = {
            name: 'Job Queue Server',
            status: queueProcess ? (queueProcess.cpu > 80 ? 'degraded' : 'online') : 'offline',
            uptime: queueProcess ? yield getProcessUptime(queueProcess.pid) : 0,
            load: queueProcess ? Math.round(queueProcess.cpu) : 0
        };
        res.json([applicationServer, databaseServer, jobQueueServer]);
    }
    catch (error) {
        console.error('Error getting server statuses:', error);
        res.status(500).json({ error: 'Failed to retrieve server statuses' });
    }
}));
// Helper function to get PostgreSQL uptime
function getDatabaseUptime() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query PostgreSQL for its uptime
            const uptimeResult = yield db_config_1.default.query(`
        SELECT extract(epoch from current_timestamp - pg_postmaster_start_time()) as uptime;
      `);
            return Math.floor(uptimeResult.rows[0].uptime);
        }
        catch (error) {
            console.error('Error getting database uptime:', error);
            return 0; // Return 0 if we can't get the uptime
        }
    });
}
// Helper function to get process uptime from PID
function getProcessUptime(pid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const processData = yield si.processLoad(pid.toString());
            const systemTime = yield si.time();
            return systemTime.uptime;
        }
        catch (error) {
            console.error(`Error getting process uptime for PID ${pid}:`, error);
            return 0;
        }
    });
}
