"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.updateBook = exports.getBookById = exports.getAllBooks = exports.addBook = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
// Add a new book (Only Admin)
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, year, pages, publisher, description, image, price, total_copies } = req.body;
    const { role_name } = req.user; // Extract user role
    if (role_name !== "Admin") {
        res.status(403).json({ message: "Access denied. Only admins can add books." });
        return;
    }
    try {
        const available_copies = total_copies; // Initially, available copies = total copies
        const result = yield db_config_1.default.query(`INSERT INTO books (title, author, genre, year, pages, publisher, description, image, price, total_copies, available_copies) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`, [title, author, genre, year, pages, publisher, description, image, price, total_copies, available_copies]);
        res.status(201).json({ message: "Book added successfully", book: result.rows[0] });
        return;
    }
    catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.addBook = addBook;
// Get all books with filtering and pagination
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, genre, year, page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    let query = "SELECT * FROM books WHERE 1=1";
    const values = [];
    if (title) {
        query += " AND title ILIKE $" + (values.length + 1);
        values.push(`%${title}%`);
    }
    if (author) {
        query += " AND author ILIKE $" + (values.length + 1);
        values.push(`%${author}%`);
    }
    if (genre) {
        query += " AND genre ILIKE $" + (values.length + 1);
        values.push(`%${genre}%`);
    }
    if (year) {
        query += " AND year = $" + (values.length + 1);
        values.push(Number(year));
    }
    query += ` ORDER BY  book_id DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(Number(limit), offset);
    try {
        const result = yield db_config_1.default.query(query, values);
        res.json(result.rows);
        return;
    }
    catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.getAllBooks = getAllBooks;
// Get a book by ID
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id } = req.params;
    try {
        const result = yield db_config_1.default.query("SELECT * FROM books WHERE book_id=$1", [book_id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json(result.rows[0]);
        return;
    }
    catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.getBookById = getBookById;
// Update book details (Only Admin)
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id } = req.params;
    const { title, author, genre, year, pages, publisher, description, image, price, total_copies, available_copies } = req.body;
    const { role_name } = req.user; // Extract user role
    if (role_name !== "Admin") {
        res.status(403).json({ message: "Access denied. Only admins can update books." });
        return;
    }
    try {
        const result = yield db_config_1.default.query(`UPDATE books 
            SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, image=$8, price=$9, total_copies=$10, available_copies=$11
            WHERE book_id=$12 RETURNING *`, [title, author, genre, year, pages, publisher, description, image, price, total_copies, available_copies, book_id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json({ message: "Book updated successfully", book: result.rows[0] });
        return;
    }
    catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.updateBook = updateBook;
// Delete book (Only Admin)
const deleteBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { book_id } = req.params;
    const { role_name } = req.user; // Extract user role
    if (role_name !== "Admin") {
        res.status(403).json({ message: "Access denied. Only admins can delete books." });
        return;
    }
    try {
        const result = yield db_config_1.default.query("DELETE FROM books WHERE book_id=$1", [book_id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json({ message: "Book deleted successfully" });
        return;
    }
    catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
});
exports.deleteBook = deleteBook;
