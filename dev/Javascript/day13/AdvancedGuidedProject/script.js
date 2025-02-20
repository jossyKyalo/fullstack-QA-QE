// Fetch Books from API and Apply Optional Callback
async function fetchBooks(callback) {
    try {
        const response = await fetch("http://localhost:5000/books");
        const books = await response.json();


        if (callback) {
            const modifiedBooks = books.map(callback);
            displayBooks(modifiedBooks);
            return modifiedBooks;
        }

        displayBooks(books);
        return books;
    } catch (error) {
        console.error("❌ Error fetching books:", error);
    }
}


function displayBooks(books) {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p>No books found.</p>";
        return;
    }

    books.forEach(book => {
        const bookItem = document.createElement("div");
        bookItem.classList.add("book");
        bookItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <button onclick="showBookModal('${book.title}', '${book.author}', ${book.year}')">More Info</button>
        `;
        bookList.appendChild(bookItem);
    });
}


function showBookModal(title, author, year) {
    const modal = document.getElementById("modal");
    document.getElementById("modal-title").innerText = `📖 ${title}`;
    document.getElementById("modal-author").innerText = `👨‍💼 Author: ${author}`;

    let warningMessage = "";
    if (year < 1900) {
        warningMessage = "📜 This book is a classic!";
    }

    document.getElementById("modal-warning").innerText = warningMessage;
    modal.style.display = "flex";
}


document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

// Step 2: Modify Book Data (Using Callbacks)
function markDystopian(book) {
    if (book.genre.toLowerCase() === "dystopian") {
        return { ...book, warning: "⚠️ Caution: Dystopian Future!" };
    }
    return book;
}
fetchBooks(markDystopian).then(books => console.log("📚 Dystopian Books Processed:", books));

// Step 3: Apply `.map()`, `.filter()`, `.sort()`
function formatBookSummaries(books) {
    return books.map(book => `${book.title} by ${book.author} - ${book.genre} (${book.pages} pages)`);
}
fetchBooks().then(books => console.log("📘 Formatted Summaries:", formatBookSummaries(books)));


function filterBooksByGenre(books, genre) {
    return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
}
fetchBooks().then(books => console.log("🧙‍♂️ Fantasy Books:", filterBooksByGenre(books, "Fantasy")));


function sortBooksByYear(books, order = "asc") {
    return books.sort((a, b) => (order === "asc" ? a.year - b.year : b.year - a.year));
}
fetchBooks().then(books => console.log("📅 Books Sorted by Year (Descending):", sortBooksByYear(books, "desc")));

// Step 4: Advanced Filtering & UI Simulation

document.getElementById("genre-filter").addEventListener("change", async () => {
    const genre = document.getElementById("genre-filter").value;
    const books = await fetchBooks();
    const filteredBooks = genre === "all" ? books : books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    displayBooks(filteredBooks);
});


document.getElementById("search-bar").addEventListener("input", async () => {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const books = await fetchBooks();
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
    displayBooks(filteredBooks);
});


document.getElementById("year-filter").addEventListener("input", async () => {
    const minYear = document.getElementById("year-filter").value;
    const books = await fetchBooks();
    const filteredBooks = minYear === "" ? books : books.filter(book => book.year >= parseInt(minYear));
    displayBooks(filteredBooks);
});


document.getElementById("page-filter").addEventListener("input", async () => {
    const minPages = document.getElementById("page-filter").value;
    const books = await fetchBooks();
    const filteredBooks = minPages === "" ? books : books.filter(book => book.pages >= parseInt(minPages));
    displayBooks(filteredBooks);
});


let sortYearAsc = true;
document.getElementById("sort-year-btn").addEventListener("click", async () => {
    const books = await fetchBooks();
    const sortedBooks = books.sort((a, b) => sortYearAsc ? a.year - b.year : b.year - a.year);
    displayBooks(sortedBooks);
    sortYearAsc = !sortYearAsc;
});


let sortPagesAsc = true;
document.getElementById("sort-pages-btn").addEventListener("click", async () => {
    const books = await fetchBooks();
    const sortedBooks = books.sort((a, b) => sortPagesAsc ? a.pages - b.pages : b.pages - a.pages);
    displayBooks(sortedBooks);
    sortPagesAsc = !sortPagesAsc;
});


async function main() {
    const books = await fetchBooks();

    console.log("📘 Formatted Summaries:", formatBookSummaries(books));
    console.log("🧙‍♂️ Fantasy Books:", filterBooksByGenre(books, "Fantasy"));
    console.log("📅 Books Sorted by Year (Descending):", sortBooksByYear(books, "desc"));

    showModalForClassics(books);
}
main();

function filterBook(books, genre, year) {
    return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase() && book.year > year);
}


function toggleSortOrder(books, order) {
    return sortBooksByYear(books, order);
}


function handleEmptyResults(books) {
    if (books.length === 0) {
        console.log("No books found.");
    }
}


document.addEventListener("DOMContentLoaded", () => fetchBooks());
