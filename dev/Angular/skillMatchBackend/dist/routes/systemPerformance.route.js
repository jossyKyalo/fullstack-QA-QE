"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const system_controller_1 = require("../controllers/system.controller");
const router = express_1.default.Router();
// GET /api/system/metrics - Current system metrics
router.get('/metrics', system_controller_1.getSystemMetrics);
// GET /api/system/historical - Historical system metrics
router.get('/historical', system_controller_1.getHistoricalMetrics);
// GET /api/system/servers - Server statuses
router.get('/servers', system_controller_1.getServerStatuses);
exports.default = router;
