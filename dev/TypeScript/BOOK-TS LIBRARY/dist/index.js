var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e, _f;
import { fetchBooks, markDystopian } from "./products";
document.addEventListener("DOMContentLoaded", () => __awaiter(void 0, void 0, void 0, function* () {
    yield fetchBooks(markDystopian);
}));
// Filtering Books
(_a = document.getElementById("genre-filter")) === null || _a === void 0 ? void 0 : _a.addEventListener("change", () => __awaiter(void 0, void 0, void 0, function* () {
    const genre = document.getElementById("genre-filter").value;
    const books = yield fetchBooks();
    const filteredBooks = genre === "all" ? books : books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    displayBooks(filteredBooks);
}));
(_b = document.getElementById("search-bar")) === null || _b === void 0 ? void 0 : _b.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const books = yield fetchBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
}));
(_c = document.getElementById("year-filter")) === null || _c === void 0 ? void 0 : _c.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const minYear = document.getElementById("year-filter").value;
    const books = yield fetchBooks();
    const filteredBooks = minYear === "" ? books : books.filter(book => book.year >= parseInt(minYear));
    displayBooks(filteredBooks);
}));
(_d = document.getElementById("page-filter")) === null || _d === void 0 ? void 0 : _d.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const minPages = document.getElementById("page-filter").value;
    const books = yield fetchBooks();
    const filteredBooks = minPages === "" ? books : books.filter(book => book.pages >= parseInt(minPages));
    displayBooks(filteredBooks);
}));
// Sorting Books
let sortYearAsc = true;
(_e = document.getElementById("sort-year-btn")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield fetchBooks();
    const sortedBooks = books.sort((a, b) => (sortYearAsc ? a.year - b.year : b.year - a.year));
    displayBooks(sortedBooks);
    sortYearAsc = !sortYearAsc;
}));
let sortPagesAsc = true;
(_f = document.getElementById("sort-pages-btn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    const books = yield fetchBooks();
    const sortedBooks = books.sort((a, b) => (sortPagesAsc ? a.pages - b.pages : b.pages - a.pages));
    displayBooks(sortedBooks);
    sortPagesAsc = !sortPagesAsc;
}));
function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    if (!bookList)
        return;
    bookList.innerHTML = books.length === 0 ? "<p>No books found.</p>" : "";
    books.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");
        bookItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
        `;
        bookList.appendChild(bookItem);
    });
}
//# sourceMappingURL=index.js.map