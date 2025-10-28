document.addEventListener("DOMContentLoaded", mostrarCarrito);

function mostrarCarrito() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.innerHTML = "";

    cartItems.forEach(item => {
        const card = document.createElement("div");
        card.className = "cart-item-card";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div>
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-description">${item.currency} ${item.cost}</p>
                </div>
                <button class="remove-item-btn">Eliminar</button>
            </div>
            <div class="cart-item-quantity">x${item.count}</div>
        `;


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
        if (cartItems[index].count > 1) {
            // si hay más de 1, solo restamos 1
            cartItems[index].count -= 1;
        } else {
            // si queda 1, lo eliminamos
            cartItems.splice(index, 1);
        }
    }

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    mostrarCarrito();
}


function actualizarTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + item.cost * item.count, 0);
    document.querySelector(".cart-total").textContent = `Total: USD ${total}`;
}
