export async function fetchBooks(filters: Record<string, string | number> = {}) {
    // ✅ Remove undefined values
    const cleanedFilters: Record<string, string> = {};

    for (const key in filters) {
        if (filters[key] !== undefined) {
            cleanedFilters[key] = String(filters[key]);  // 🔥 Ensure string values
        }
    }

    const params = new URLSearchParams(cleanedFilters).toString();
    const url = `http://localhost:4000/api/books?${params}`;

    console.log("🚀 Fetching from API:", url); // ✅ Debugging log

    const response = await fetch(url);
    if (!response.ok) {
        console.error("❌ API Error:", response.status, response.statusText);
        return [];
    }

    return response.json();
}
