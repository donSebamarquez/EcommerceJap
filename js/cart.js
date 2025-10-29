document.addEventListener("DOMContentLoaded", mostrarCarrito);

function mostrarCarrito() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.innerHTML = "";

    if (cartItems.length === 0) {
    const cartContainer = document.querySelector(".cart-container");
    const cartTotal = document.querySelector(".cart-total");

    cartContainer.innerHTML = "";
    cartTotal.textContent = "";

    const emptyMsg = document.createElement("div");
    emptyMsg.className = "empty-cart-message text-center my-5";

    emptyMsg.innerHTML = `
        <h4 class="mb-3">Tu carrito está vacío</h4>
        <p class="mb-4">Parece que aún no agregaste productos.</p>
        <button id="goToCategoriesBtn" class="btn btn-primary px-4 py-2">
            Explorar productos
        </button>
    `;

    cartContainer.appendChild(emptyMsg);

    document.getElementById("goToCategoriesBtn").addEventListener("click", () => {
        window.location.href = "categories.html";
    });

    return; // Salimos sin renderizar nada más
}

    cartItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "cart-item-card";

        card.innerHTML = `
    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
            <div>
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-description">Precio unitario: ${item.currency} ${item.cost}</p>
                <p class="cart-item-subtotal">Subtotal: ${item.currency} ${item.cost * item.count}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn decrease">−</button>
                <span class="cart-item-quantity">${item.count}</span>
                <button class="qty-btn increase">+</button>
                <button class="remove-item-btn" title="Eliminar">
                <img src="img/trash.png" alt="Eliminar class="trash-icon">
                </button>
            </div>
        </div>
    `;

    // botón "+"
        card.querySelector(".increase").addEventListener("click", () => {
            item.count++;
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        mostrarCarrito();
    });

    // botón "−"
        card.querySelector(".decrease").addEventListener("click", () => {
            if (item.count > 1) {
                item.count--;
            } else {
                cartItems = cartItems.filter(p => p.id !== item.id);
            }
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        mostrarCarrito();
    });

        card.querySelector(".remove-item-btn").addEventListener("click", () => {
            eliminarItem(item.id);
        });

        cartContainer.appendChild(card);
    });

    actualizarTotal(cartItems);
}

function eliminarItem(id) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    
    // buscamos el índice del producto
    const index = cartItems.findIndex(item => item.id === id);

    if (index > -1) {
            cartItems.splice(index, 1);
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    mostrarCarrito();
}


function actualizarTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.cost * item.count, 0);
    document.querySelector(".cart-total").textContent = `Total: USD ${total}`;
}
