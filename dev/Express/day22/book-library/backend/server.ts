import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { readFileSync } from "fs";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 3001;
console.log(`📌 Server starting on port: ${PORT}`);

const app = express();

// Enable CORS for frontend access
app.use(cors({
  origin: "http://localhost:5174",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Load books data from JSON file
const dbPath = path.join(__dirname, "../data/books.json"); 
let booksData: any = { books: [] };

try {
  const fileContent = readFileSync(dbPath, "utf-8");
  booksData = JSON.parse(fileContent);
} catch (error) {
  console.error("🚨 Failed to load books data:", error);
}

// 🏠 Home Route
app.get("/", (req, res) => {
  res.send("📚 Welcome to the Book API! Explore available books.");
});

// 📌 Get All Books
app.get("/api/books", (req, res) => {
  res.json(booksData.books);
});

// 🔍 Filter Books with Query Parameters
app.get("/api/books/search", (req: Request, res: Response) => {
  try {
    const { title, author, genre, year, pages, publisher } = req.query;
    let filtered = [...booksData.books];

    if (title) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes((title as string).toLowerCase())
      );
    }

    if (author) {
      filtered = filtered.filter(book => 
        book.author.toLowerCase().includes((author as string).toLowerCase())
      );
    }

    if (genre) {
      filtered = filtered.filter(book => 
        book.genre.toLowerCase().includes((genre as string).toLowerCase())
      );
    }

    if (year) {
      const parsedYear = Number(year);
      if (!isNaN(parsedYear)) {
        filtered = filtered.filter(book => book.year === parsedYear);
      }
    }

    if (pages) {
      const minPages = Number(pages);
      if (!isNaN(minPages)) {
        filtered = filtered.filter(book => book.pages >= minPages);
      }
    }

    if (publisher) {
      filtered = filtered.filter(book => 
        book.publisher.toLowerCase().includes((publisher as string).toLowerCase())
      );
    }

    res.json(filtered);
  } catch (error) {
    console.error("🚨 Error in filtering books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is live at http://localhost:${PORT}`);
});
