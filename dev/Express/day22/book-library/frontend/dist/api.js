export async function fetchBooks(filters = {}) {
    // ✅ Remove undefined values
    const cleanedFilters = {};
    for (const key in filters) {
        if (filters[key] !== undefined) {
            cleanedFilters[key] = String(filters[key]);
        }
    }
    const params = new URLSearchParams(cleanedFilters).toString();
    const url = `http://localhost:4000/api/books?${params}`;
    console.log("🚀 Fetching from API:", url);
    const response = await fetch(url);
    if (!response.ok) {
        console.error("❌ API Error:", response.status, response.statusText);
        return [];
    }
    return response.json();
}
