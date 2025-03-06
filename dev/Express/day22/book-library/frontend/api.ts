export async function fetchBooks(filters = {}) {
    const params = new URLSearchParams(filters as any).toString();
    const response = await fetch(`http://localhost:3000/api/books?${params}`);
    return response.json();
}
