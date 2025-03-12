import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { readFileSync, writeFileSync } from "fs";
import  pool  from "./db.config";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  methods: "GET, PUT, DELETE",
  credentials: true
})); 

 

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
//get all books
app.get("/api/books", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
//get specific book by id
app.get("/api/books/:id", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM books WHERE id=$1");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.get("/api/test-db", async (req: Request, res: Response) => {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT NOW();");
        client.release();
        
        res.json({ message: "Database connected successfully!", time: result.rows[0].now });
    } catch (error) {
        console.error("Database connection error:", error);

         
        const errMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        res.status(500).json({ message: "Database connection failed", error: errMessage });
    }
});

app.delete("/api/books/:id", async (req: Request, res: Response): Promise<void> => { 
    const bookId = req.params.id;

    try {
        const result = await pool.query("DELETE FROM books WHERE id=$1 RETURNING *", [bookId]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        res.status(200).json({ message: `Book ${bookId} deleted successfully` });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.patch("/api/books/:id", async (req: Request, res: Response): Promise<void> => {
    const bookId = req.params.id;
    const { title, genre, year, pages } = req.body;

    if (!bookId) {
        res.status(400).json({ message: "Book ID is required" });
        return;
    }

    try {
        const existingBook = await pool.query("SELECT * FROM books WHERE id=$1", [bookId]);

        if (existingBook.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }

        const updatedBook = {
            title: title || existingBook.rows[0].title,
            genre: genre || existingBook.rows[0].genre,
            year: year || existingBook.rows[0].year,
            pages: pages || existingBook.rows[0].pages,
        };

        const result = await pool.query(
            "UPDATE books SET title=$1, genre=$2, year=$3, pages=$4 WHERE id=$5 RETURNING *",
            [updatedBook.title, updatedBook.genre, updatedBook.year, updatedBook.pages, bookId]
        );

        res.status(200).json({ message: "Book updated successfully", book: result.rows[0] });

    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.put("/api/books/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const bookId = req.params.id;
        const { title, genre, year, pages } = req.body;

        if (!title || !genre || !year || !pages) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

         
        const existingBook = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);
        if (existingBook.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
 
        const updatedBook = await pool.query(
            "UPDATE books SET title=$1, genre=$2, year=$3, pages=$4 WHERE id=$5 RETURNING *",
            [title, genre, year, pages, bookId]
        );

        res.status(200).json({ message: "Book updated", book: updatedBook.rows[0] });

    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});




    


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


//from today's class:
// app.get("api/books", async (req, res)=>{
//     try {
//         const result= await pool.query("SELECT * FROM books");
//         res.json(result.rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: "Internal server error"})
//     }
// });

// //get by id
// app.get("api/books/:id", async (req: Request, res: Response)=>{
//     try {
//         const {id}= req.params;
//         const result= await pool.query("SELECT * FROM books WHERE id=$1", [id]);
//         if (result.rows.length===0){
//             res.status(404).json({message: "Bok not found"});
//             return
//         }
//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error("Error fetching book by ID:", error);
//         res.status(500).json({message: "Internal Server error"});
//     }
// });