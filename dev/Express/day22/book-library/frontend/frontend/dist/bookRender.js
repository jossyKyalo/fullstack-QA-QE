var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchBooks } from "./api";
const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("search-bar");
const genreFilter = document.getElementById("genre-filter");
const yearFilter = document.getElementById("year-filter");
const pageFilter = document.getElementById("page-filter");
const sortPagesBtn = document.getElementById("sort-pages-btn");
let books = [];
function loadBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const filters = {
            title: searchInput.value.trim() || undefined,
            genre: genreFilter.value !== "all" ? genreFilter.value : undefined,
            year: yearFilter.value ? yearFilter.value : undefined,
            pages: pageFilter.value ? pageFilter.value : undefined
        };
        books = yield fetchBooks(filters);
        renderBooks(books);
    });
}
function renderBooks(books) {
    bookList.innerHTML = "";
    books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Year: ${book.year}</p>
            <p>Pages: ${book.pages}</p>
        `;
        bookList.appendChild(bookElement);
    });
}
sortPagesBtn.addEventListener("click", () => {
    books.sort((a, b) => a.pages - b.pages);
    renderBooks(books);
});
searchInput.addEventListener("input", loadBooks);
genreFilter.addEventListener("change", loadBooks);
yearFilter.addEventListener("input", loadBooks);
pageFilter.addEventListener("input", loadBooks);
loadBooks();
