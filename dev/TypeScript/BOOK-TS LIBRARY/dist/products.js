var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function fetchBooks(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("http://localhost:5000/books");
            const books = yield response.json();
            if (callback) {
                const modifiedBooks = books.map(callback);
                displayBooks(modifiedBooks);
                return modifiedBooks;
            }
            displayBooks(books);
            return books;
        }
        catch (error) {
            console.error("❌ Error fetching books:", error);
            return [];
        }
    });
}
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
            <button onclick="addToCart('${book.title}', '${book.image}', '${book.price}')">Buy now</button>
            <button onclick="showBookModal('${book.title}', '${book.author}', ${book.year})">Details</button>
        `;
        bookList.appendChild(bookItem);
    });
}
// Example of a callback function to mark dystopian books
export function markDystopian(book) {
    return book.genre.toLowerCase() === "dystopian"
        ? Object.assign(Object.assign({}, book), { genre: "⚠️ Dystopian" }) : book;
}
//# sourceMappingURL=products.js.map