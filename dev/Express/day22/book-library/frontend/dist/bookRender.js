import { fetchBooks } from "./api";
import { AuthService } from "./authService";
const bookList = document.getElementById("book-list");
const cartItemsContainer = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");
const searchInput = document.getElementById("search-bar");
const genreFilter = document.getElementById("genre-filter");
const yearFilter = document.getElementById("year-filter");
const pageFilter = document.getElementById("page-filter");
const sortPagesBtn = document.getElementById("sort-pages-btn");
const cartIcon = document.getElementById("cart-icon");
const cartModal = document.getElementById("cart-modal");
const checkoutBtn = document.getElementById("checkout-btn");
const postBookBtn = document.getElementById("post-book-btn");
const postBookModal = document.getElementById("post-book-modal");
const closeBtn = document.querySelector(".close-btn");
const postBookForm = document.getElementById("post-book-form");
const authButtonsContainer = document.querySelector(".auth-buttons");
let books = [];
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
function updateAuthUI() {
    const user = AuthService.getCurrentUser();
    // Clear existing auth buttons
    authButtonsContainer.innerHTML = '';
    if (user) {
        // Logged in state
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.addEventListener('click', () => {
            AuthService.logout();
            updateAuthUI();
            window.location.href = 'login.html';
        });
        authButtonsContainer.appendChild(logoutBtn);
        // Conditionally show Post a Book button
        if (AuthService.hasRole('Librarian')) {
            postBookBtn.style.display = 'block';
        }
        else {
            postBookBtn.style.display = 'none';
        }
    }
    else {
        // Logged out state
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.textContent = 'Login';
        const registerBtn = document.createElement('button');
        registerBtn.textContent = 'Register';
        registerBtn.onclick = () => window.location.href = 'register.html';
        authButtonsContainer.appendChild(loginLink);
        authButtonsContainer.appendChild(registerBtn);
        // Hide post book button
        postBookBtn.style.display = 'none';
    }
}
export async function loadBooks() {
    const filters = {};
    if (searchInput.value.trim())
        filters.title = searchInput.value.trim();
    if (genreFilter.value !== "all")
        filters.genre = genreFilter.value;
    if (yearFilter.value)
        filters.year = yearFilter.value;
    if (pageFilter.value)
        filters.pages = pageFilter.value;
    console.log("Fetching books with filters", filters);
    books = await fetchBooks(filters);
    console.log("Fetched boks:", books);
    renderBooks(books);
}
function toggleCart() {
    cartModal.style.display = cartModal.style.display === "block" ? "none" : "block";
    updateCartDisplay();
}
function saveUserRole(role_name) {
    localStorage.setItem("userRole", role_name);
}
function getUserRole() {
    return localStorage.getItem("userRole");
}
function renderBooks(books) {
    const user = AuthService.getCurrentUser();
    bookList.innerHTML = "";
    books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image" style="width: 100%; height: 250px; object-fit: cover; border-radius: 10px;">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Genre:</strong> ${book.genre}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <p><strong>Price: </strong>$${book.price}</p>
            <button class="add-to-cart" data-id="${book.id}"> Add to Cart</button>
            <button class="buy-now" data-id="${book.id}">Buy Now</button>
            ${user && user.role_name === 'Librarian' ? `<button class="edit-book" data-id="${book.id}">✏️ Edit</button>` : ''}
            ${user && user.role_name === 'Admin' ? `<button class="delete-book" data-id="${book.id}">❌ Delete</button>` : ''}
        `;
        bookList.appendChild(bookElement);
    });
    // document.querySelectorAll(".edit-book").forEach(button => {
    //     button.addEventListener("click", (event) => {
    //         const bookId = (event.target as HTMLElement).getAttribute("data-id");
    //         editBook(bookId);
    //     });
    // });
    // document.querySelectorAll(".delete-book").forEach(button => {
    //     button.addEventListener("click", (event) => {
    //         const bookId = (event.target as HTMLElement).getAttribute("data-id");
    //         if (confirm("Are you sure you want to delete this book?")) {
    //             deleteBook(bookId);
    //         }
    //     });
    // });
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const bookId = event.target.getAttribute("data-id");
            addToCart(bookId);
        });
    });
    document.querySelectorAll(".buy-now").forEach(button => {
        button.addEventListener("click", (event) => {
            const bookId = event.target.getAttribute("data-id");
            buyNow(bookId);
        });
    });
}
function addToCart(bookId) {
    if (!bookId)
        return;
    const book = books.find(b => b.id.toString() === bookId);
    if (!book)
        return;
    cart.push(book);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${book.title} added to cart!`);
    updateCartDisplay();
}
function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    cart.forEach(book => {
        total += book.price;
        const item = document.createElement("div");
        item.classList.add("cart-item");
        item.innerHTML = `
            <p>${book.title} - $${book.price}</p>
        `;
        cartItemsContainer.appendChild(item);
    });
    totalAmount.textContent = `Total: $${total.toFixed(2)}`;
}
function buyNow(bookId) {
    if (!bookId)
        return;
    const book = books.find(b => b.id.toString() === bookId);
    if (!book)
        return;
    alert(`Proceeding to checkout for "${book.title}" - $${book.price}`);
    window.location.href = `/checkout.html?bookId=${bookId}`;
}
cartIcon.addEventListener("click", toggleCart);
postBookBtn.addEventListener("click", () => {
    postBookModal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
    postBookModal.style.display = "none";
});
postBookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const newBook = {
        title: document.getElementById("book-title").value,
        author: document.getElementById("book-author").value,
        genre: document.getElementById("book-genre").value,
        year: parseInt(document.getElementById("book-year").value),
        pages: parseInt(document.getElementById("book-pages").value),
        image: document.getElementById("book-image").value
    };
    const response = await fetch("http://localhost:4000/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
    });
    if (response.ok) {
        alert("✅ Book added successfully!");
        postBookModal.style.display = "none";
        loadBooks();
    }
    else {
        alert("❌ Failed to add book!");
    }
});
sortPagesBtn.addEventListener("click", () => {
    books.sort((a, b) => a.pages - b.pages);
    renderBooks(books);
});
searchInput.addEventListener("input", loadBooks);
genreFilter.addEventListener("change", loadBooks);
yearFilter.addEventListener("input", loadBooks);
pageFilter.addEventListener("input", loadBooks);
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    loadBooks();
});
