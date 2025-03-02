import { addToCart } from "./cart";

interface Book {
    title: string;
    image: string;
    author: string;
    genre: string;
    year: number;
    pages: number;
    price: number;
}

export async function fetchBooks(callback?: (book: Book) => Book): Promise<Book[]> {
    try {
        const response = await fetch("http://localhost:5000/books");
        const books: Book[] = await response.json();

        return callback ? books.map(callback) : books;
    } catch (error) {
        console.error("❌ Error fetching books:", error);
        return [];
    }
}

export function displayBooks(books: Book[]) {
    const bookList = document.getElementById("book-list");
    if (!bookList) return;

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
            <button class="buy-now-btn">Buy now</button>
            <button class="details-btn">Details</button>
        `;

        // Attach event listeners
        bookItem.querySelector(".buy-now-btn")?.addEventListener("click", () => {
            addToCart(book.title, book.image, book.price);
        });

        bookItem.querySelector(".details-btn")?.addEventListener("click", () => {
            showBookModal(book.title, book.author, book.year);
        });

        bookList.appendChild(bookItem);
    });
}



