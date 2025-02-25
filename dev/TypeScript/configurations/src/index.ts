import { fetchBooks, markDystopian, displayBooks } from "./products";

document.addEventListener("DOMContentLoaded", async () => {
    const books = await fetchBooks(markDystopian);
    displayBooks(books);
});

// Filtering Books
document.getElementById("genre-filter")?.addEventListener("change", async () => {
    const genre = (document.getElementById("genre-filter") as HTMLSelectElement).value;
    const books = await fetchBooks();
    const filteredBooks = genre === "all" ? books : books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    displayBooks(filteredBooks);
});

document.getElementById("search-bar")?.addEventListener("input", async () => {
    const query = (document.getElementById("search-bar") as HTMLInputElement).value.toLowerCase();
    const books = await fetchBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
});

document.getElementById("year-filter")?.addEventListener("input", async () => {
    const minYear = (document.getElementById("year-filter") as HTMLInputElement).value;
    const books = await fetchBooks();
    const filteredBooks = minYear === "" ? books : books.filter(book => book.year >= parseInt(minYear));
    displayBooks(filteredBooks);
});

document.getElementById("page-filter")?.addEventListener("input", async () => {
    const minPages = (document.getElementById("page-filter") as HTMLInputElement).value;
    const books = await fetchBooks();
    const filteredBooks = minPages === "" ? books : books.filter(book => book.pages >= parseInt(minPages));
    displayBooks(filteredBooks);
});

// Sorting Books
let sortYearAsc = true;
document.getElementById("sort-year-btn")?.addEventListener("click", async () => {
    const books = await fetchBooks();
    const sortedBooks = books.sort((a, b) => (sortYearAsc ? a.year - b.year : b.year - a.year));
    displayBooks(sortedBooks);
    sortYearAsc = !sortYearAsc;
});

let sortPagesAsc = true;
document.getElementById("sort-pages-btn")?.addEventListener("click", async () => {
    const books = await fetchBooks();
    const sortedBooks = books.sort((a, b) => (sortPagesAsc ? a.pages - b.pages : b.pages - a.pages));
    displayBooks(sortedBooks);
    sortPagesAsc = !sortPagesAsc;
});
