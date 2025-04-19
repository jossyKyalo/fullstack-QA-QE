import express from 'express';
import {
  getSystemMetrics,
  getHistoricalMetrics,
  getServerStatuses
} from '../controllers/system.controller';

const router = express.Router();

// GET /api/system/metrics - Current system metrics
router.get('/metrics', getSystemMetrics);

// GET /api/system/historical - Historical system metrics
router.get('/historical', getHistoricalMetrics);

// GET /api/system/servers - Server statuses
router.get('/servers', getServerStatuses);

export default router;
