"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const protect_1 = require("../middlewares/auth/protect");
const roleMiddleware_1 = require("../middlewares/auth/roleMiddleware");
const router = express_1.default.Router();
// Public route: Register a new user
router.post("/", userController_1.createUser);
// Private routes: Require authentication
router.use(protect_1.protect);
// Admin-only routes
router.get("/", roleMiddleware_1.adminGuard, userController_1.getUsers); // Get all users (Admin)
router.get('/metrics', userController_1.getMetrics); // admin dashboard metrics
router.get('/search', userController_1.searchUsers); // Search users (Admin)
router.get("/:user_id", roleMiddleware_1.adminGuard, userController_1.getUserById); // Get a user by ID (Admin)
router.put("/:user_id", roleMiddleware_1.adminGuard, userController_1.updateUser); // Update user (Admin)
router.delete("/:user_id", roleMiddleware_1.adminGuard, userController_1.deleteUser); // Delete user (Admin)
exports.default = router;
