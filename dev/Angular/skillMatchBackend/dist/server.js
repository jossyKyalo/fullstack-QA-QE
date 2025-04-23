"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const systemPerformance_route_1 = __importDefault(require("./routes/systemPerformance.route"));
const db_config_1 = __importDefault(require("./config/db.config"));
const onboarding_routes_1 = __importDefault(require("./routes/onboarding.routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const recruiterRoutes_1 = __importDefault(require("./routes/recruiterRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:4200", "http://skill-match-ai.s3-website.eu-north-1.amazonaws.com"],
    methods: "GET, POST ,PUT, DELETE",
    credentials: true
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api", onboarding_routes_1.default);
app.use("/api/system", systemPerformance_route_1.default);
app.use('/api/recruiters', recruiterRoutes_1.default);
// Dummy skill search
app.get('/api/skills/search', (req, res) => {
    var _a;
    const term = (_a = req.query.term) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const skills = ['JavaScript', 'Java', 'Python', 'Angular', 'React'];
    const filtered = skills.filter(skill => skill.toLowerCase().includes(term));
    res.json(filtered);
});
// Dummy skill extraction
app.post('/api/skills/extract', (req, res) => {
    const { resumeText } = req.body;
    res.json({ extractedSkills: ['JavaScript', 'Teamwork', 'Problem Solving'] });
});
// Root Route
app.get("/", (req, res) => {
    res.send("SkillMatch.ai is ready to match your skills...");
});
// Database Connection Test
db_config_1.default.connect()
    .then(() => console.log("Connected to Database"))
    .catch((err) => console.error("Database Connection Error:", err));
// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
