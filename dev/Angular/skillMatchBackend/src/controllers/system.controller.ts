import { Request, Response } from 'express';
import * as si from 'systeminformation';
import asyncHandler from '../middlewares/asyncHandler';
import pool from '../config/db.config';

// Get current system metrics
export const getSystemMetrics = asyncHandler(async (req: Request, res: Response) => {
    const [cpu, mem, disks] = await Promise.all([
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
    const previousMetrics = await pool.query(
        `SELECT * FROM system_metrics 
     ORDER BY timestamp DESC 
     LIMIT 1`
    );

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
    await pool.query(
        `INSERT INTO system_metrics (cpu_usage, memory_usage, disk_usage, response_time)
     VALUES ($1, $2, $3, $4)`,
        [metrics.cpu.usage, metrics.memory.usage, metrics.disk.usage, metrics.responseTime.value]
    );

    res.json(metrics);
});

// Get historical metrics
export const getHistoricalMetrics = asyncHandler(async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 7;

    const historicalData = await pool.query(
        `SELECT cpu_usage, memory_usage, timestamp 
     FROM system_metrics 
     WHERE timestamp >= NOW() - INTERVAL '${days} days'
     ORDER BY timestamp ASC`
    );

    const metrics = {
        cpu: historicalData.rows.map(row => row.cpu_usage),
        memory: historicalData.rows.map(row => row.memory_usage)
    };

    res.json(metrics);
});
 

// Get server statuses
export const getServerStatuses = asyncHandler(async (req: Request, res: Response) => {
    try {
      // Get real system information
      const [systemUptime, cpuLoad, memory, processes] = await Promise.all([
        si.time(),
        si.currentLoad(),
        si.mem(),
        si.processes()
      ]);
  
      // Check for database process (PostgreSQL)
      const postgresProcess = processes.list.find(p => 
        p.name.toLowerCase().includes('postgres') || 
        p.name.toLowerCase().includes('psql')
      );
      
      // Check for any job queue processes (example: Redis, RabbitMQ, etc.)
      const queueProcess = processes.list.find(p => 
        p.name.toLowerCase().includes('redis') || 
        p.name.toLowerCase().includes('rabbit') ||
        p.name.toLowerCase().includes('queue')
      );
  
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
        uptime: await getDatabaseUptime(), 
        load: postgresProcess ? Math.round(postgresProcess.cpu) : 0
      };
  
      const jobQueueServer = {
        name: 'Job Queue Server',
        status: queueProcess ? (queueProcess.cpu > 80 ? 'degraded' : 'online') : 'offline',
        uptime: queueProcess ? await getProcessUptime(queueProcess.pid) : 0,
        load: queueProcess ? Math.round(queueProcess.cpu) : 0
      };
      
      res.json([applicationServer, databaseServer, jobQueueServer]);
    } catch (error) {
      console.error('Error getting server statuses:', error);
      res.status(500).json({ error: 'Failed to retrieve server statuses' });
    }
  });
  
  // Helper function to get PostgreSQL uptime
  async function getDatabaseUptime() {
    try {
      // Query PostgreSQL for its uptime
      const uptimeResult = await pool.query(`
        SELECT extract(epoch from current_timestamp - pg_postmaster_start_time()) as uptime;
      `);
      return Math.floor(uptimeResult.rows[0].uptime);
    } catch (error) {
      console.error('Error getting database uptime:', error);
      return 0; // Return 0 if we can't get the uptime
    }
  }
  
  // Helper function to get process uptime from PID
  async function getProcessUptime(pid: number) {
    try {
      const processData = await si.processLoad(pid.toString());
      const systemTime = await si.time();
      return systemTime.uptime;
    } catch (error) {
      console.error(`Error getting process uptime for PID ${pid}:`, error);
      return 0;
    }
  }