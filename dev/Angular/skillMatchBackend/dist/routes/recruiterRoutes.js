"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruiterController_1 = require("../controllers/recruiterController");
const protect_1 = require("../middlewares/auth/protect");
const router = express_1.default.Router();
router.use(protect_1.protect);
// Recruiter dashboard routes
router.get('/profile/:id', recruiterController_1.getRecruiterProfile);
router.get('/metrics/:id', recruiterController_1.getRecruiterMetrics);
router.get('/jobs/active/:id', recruiterController_1.getActiveJobs);
router.get('/candidates/matches/:id', recruiterController_1.getCandidateMatches);
router.post('/jobs', recruiterController_1.createJob);
router.get('/search', recruiterController_1.searchCandidates);
router.post('/contact', recruiterController_1.contactCandidate);
router.post('/test-job', (req, res) => {
    console.log('Hit the /test-job route!');
    res.status(200).json({ message: 'Test POST job route works!' });
});
exports.default = router;
