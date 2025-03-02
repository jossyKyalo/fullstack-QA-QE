interface CartItem {
    title: string;
    image: string;
    price: number;
    count: number;
}

let cart: CartItem[] = [];

export function addToCart(title: string, image: string, price: number) {
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
        existingItem.count++;
    } else {
        cart.push({ title, image, price, count: 1 });
    }
    updateCartDisplay();
    updateCartCount();
}

function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        const totalCount = cart.reduce((sum, item) => sum + item.count, 0);
        cartCountElement.textContent = totalCount.toString();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cart-items");
    const totalAmount = document.getElementById("total-amount");

    if (!cartItems || !totalAmount) return;

    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.price * item.count;
        const itemElement = document.createElement("div");
        itemElement.classList.add("cart-item");
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width:50px; height:50px;">
            <div>
                <h4>${item.title}</h4>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.count}</p>
                <div class="button-container">
                    <button onclick="changeItemCount(${index}, -1)">➖</button>
                    <button onclick="changeItemCount(${index}, 1)">➕</button>
                    <button onclick="removeFromCart(${index})">❌</button>
                </div>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });

    totalAmount.innerText = `Total: $${totalPrice.toFixed(2)}`;
}

export function changeItemCount(index: number, change: number) {
    if (cart[index].count + change <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].count += change;
    }
    updateCartDisplay();
    updateCartCount();
}

export function removeFromCart(index: number) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
}
