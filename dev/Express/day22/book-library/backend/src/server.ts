import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import bookRoutes from "./routes/bookRoutes";
//import  asyncHandler  from "./middlewares/asyncHandler";
import pool from "./config/db.config";
 
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

 
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: "GET, POST, PUT, PATCH, DELETE",
    credentials: true,
  })
);


app.use(express.static(path.join(__dirname, "public")));

// Database connection test
app.get("/api/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW();");
    client.release();
    res.json({ message: "Database connected successfully!", time: result.rows[0].now });
  } catch (error: unknown) {
    console.error("Database connection error:", error);
    const errMessage= error instanceof Error ? error.message : "Unknown occurred";
    res.status(500).json({ message: "Database connection failed",   errMessage });
  }
});

// Routes
app.use("/api/books", bookRoutes);

// Error Handling Middleware
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
  
    let errMessage = "Internal Server Error";
    if (err instanceof Error) {
      errMessage = err.message;
    }
  
    res.status(500).json({ message: errMessage });
  });

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
