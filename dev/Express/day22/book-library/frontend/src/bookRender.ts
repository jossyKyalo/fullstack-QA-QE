import { fetchBooks } from "./api";
import { Book } from "./types";   

const bookList = document.getElementById("book-list")!;
const searchInput = document.getElementById("search-bar") as HTMLInputElement;
const genreFilter = document.getElementById("genre-filter") as HTMLSelectElement;
const yearFilter = document.getElementById("year-filter") as HTMLInputElement;
const pageFilter = document.getElementById("page-filter") as HTMLInputElement;
const sortPagesBtn = document.getElementById("sort-pages-btn")!;

let books: Book[] = [];

export async function loadBooks() {
    const filters: Record<string, string> = {};

    if (searchInput.value.trim()) filters.title = searchInput.value.trim();
    if (genreFilter.value !== "all") filters.genre = genreFilter.value;
    if (yearFilter.value) filters.year = yearFilter.value;
    if (pageFilter.value) filters.pages = pageFilter.value;
    console.log("Fetching books with filters", filters)
    books = await fetchBooks(filters);
    console.log("Fetched boks:", books)
    renderBooks(books);
}

 
function renderBooks(books: Book[]) {
    console.log("Rendering books:", books);

    if (!bookList) {
        console.error("Error: #book-list not found in HTML!");
        return;
    }
    bookList.innerHTML = "";
    books.forEach((book: Book) => {
        console.log("Rendering books:", book);
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <img src="${book.image}" alt="${book.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 10px;">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
        `;
        bookList.appendChild(bookElement);
    });
}

 
sortPagesBtn.addEventListener("click", () => {
    books.sort((a: Book, b: Book) => a.pages - b.pages);
    renderBooks(books);
});

 
searchInput.addEventListener("input", loadBooks);
genreFilter.addEventListener("change", loadBooks);
yearFilter.addEventListener("input", loadBooks);
pageFilter.addEventListener("input", loadBooks);

loadBooks();

