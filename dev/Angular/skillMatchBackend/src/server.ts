import { setupAliases } from "import-aliases";
setupAliases()
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "@app/routes/authRoutes";
import userRoutes from "@app/routes/userRoutes";
import pool from "@app/config/db.config";  
import onboardingRoutes from "./routes/onboarding.routes";
import bodyParser from "body-parser";


dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:4200", 
    methods: "GET, PUT, DELETE",
    credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/onboarding", onboardingRoutes);
 

// Root Route
app.get("/", (req, res) => {
  res.send("SkillMatch.ai is ready to match your skills...");
});

// Database Connection Test
pool.connect()
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.error("Database Connection Error:", err));

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
