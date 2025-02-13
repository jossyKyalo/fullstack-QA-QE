document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    fetch("http://localhost:5000/products")
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");

                productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> $${product.price}</p>
                    <p><strong>Stock:</strong> ${product.stock} units</p>
                    <p>${product.description}</p>
                `;

                productList.appendChild(productDiv);
            });
        })
        .catch(error => console.error("Error fetching products:", error));
});
