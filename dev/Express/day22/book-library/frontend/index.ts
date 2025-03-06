import { fetchBooks } from "./api";

async function init() {
    const books = await fetchBooks();
    console.log("Books loaded:", books);
}

init();
