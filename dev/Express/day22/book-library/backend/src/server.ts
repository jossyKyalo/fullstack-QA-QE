import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import { Pool } from "./db.config";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

app.use(cors({
  origin: "http://localhost:5173", 
  methods: "GET, PUT, DELETE",
  credentials: true
}));
app.use(express.json());
 

const dbPath = path.join(__dirname, "db", "db.json");
let books: any[] = [];

try {
    const fileData = readFileSync(dbPath, "utf-8");
    books = JSON.parse(fileData).books; 
} catch (error) {
    console.error("Error reading database:", error);
}

 
app.get("/api/books", (req: Request, res: Response) => {
    try {
        let { title, genre, year, pages } = req.query;
        let filteredBooks = [...books];

        if (title) {
            filteredBooks = filteredBooks.filter(book =>
                book.title.toLowerCase().includes((title as string).toLowerCase())
            );
        }

        if (genre && genre !== "all") {
            filteredBooks = filteredBooks.filter(book =>
                book.genre.toLowerCase() === (genre as string).toLowerCase()
            );
        }

        if (year) {
            const yearNum = parseInt(year as string, 10);
            if (!isNaN(yearNum)) {
                filteredBooks = filteredBooks.filter(book => book.year >= yearNum);
            }
        }

        if (pages) {
            const minPages = parseInt(pages as string, 10);
            if (!isNaN(minPages)) {
                filteredBooks = filteredBooks.filter(book => book.pages >= minPages);
            }
        }

        res.json(filteredBooks);
    } catch (error) {
        console.error("Error filtering books:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post("/api/books", (req: Request, res: Response) => {
    const newBook = req.body;
    newBook.id = books.length + 1;
    books.push(newBook);

    writeFileSync(dbPath, JSON.stringify({ books }, null, 2));
    res.status(201).json({ message: "Book added successfully", book: newBook });
});

app.get("/api/books", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
