document.addEventListener("DOMContentLoaded", mostrarCarrito);

function mostrarCarrito() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartContainer = document.querySelector(".cart-container");
  const formExistente = document.querySelector(".checkout-form");
  
  cartContainer.innerHTML = "";

  if (cartItems.length === 0) {
    if (formExistente) formExistente.remove(); // eliminar form si ya no hay productos

    const cartTotal = document.querySelector(".cart-total");
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

    return;
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
                  <img src="img/trash.png" alt="Eliminar" class="trash-icon">
              </button>
          </div>
      </div>
    `;

    card.querySelector(".increase").addEventListener("click", () => {
      item.count++;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      mostrarCarrito();
    });

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
  generarFormularioCompra();
}

function eliminarItem(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
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

function generarFormularioCompra() {
  if (document.querySelector(".checkout-form")) return; // evita duplicados

  const container = document.querySelector(".cart-container");

  const formSection = document.createElement("div");
  formSection.className = "checkout-form";

  formSection.innerHTML = `
    <h3>Datos de envío</h3>
    <input type="text" id="direccion" placeholder="Dirección" class="form-input">
    <input type="text" id="ciudad" placeholder="Ciudad" class="form-input">
    <input type="text" id="codigoPostal" placeholder="Código postal" class="form-input">

    <h3>Forma de envío</h3>
    <div class="envio">
      <label><input type="radio" name="envio" value="standard"> Envío estándar</label>
      <label><input type="radio" name="envio" value="express"> Envío express</label>
    </div>

    <h3>Forma de pago</h3>
    <select id="pago" class="form-select">
      <option value="tarjeta">Tarjeta</option>
      <option value="transferencia">Transferencia</option>
    </select>

    <div id="pago-tarjeta" class="pago-opcion hidden">
      <input type="text" id="numTarjeta" placeholder="Número de tarjeta" class="form-input">
      <input type="text" id="nombreTarjeta" placeholder="Nombre en la tarjeta" class="form-input">
    </div>

    <div id="pago-transferencia" class="pago-opcion hidden">
      <input type="text" id="cuenta" placeholder="Número de cuenta bancaria" class="form-input">
    </div>

    <button id="finalizarCompraBtn" class="btn btn-success mt-3">Finalizar compra</button>

    <div id="mensajeCompra" class="mensaje-compra"></div>
  `;

  container.appendChild(formSection);

  document.getElementById("pago").addEventListener("change", e => {
    document.querySelectorAll(".pago-opcion").forEach(div => div.classList.add("hidden"));
    const seleccion = e.target.value;
    if (seleccion) document.getElementById(`pago-${seleccion}`).classList.remove("hidden");
  });

  document.getElementById("finalizarCompraBtn").addEventListener("click", validarCompra);
}

function validarCompra() {
  const direccion = document.getElementById("direccion").value.trim();
  const ciudad = document.getElementById("ciudad").value.trim();
  const codigoPostal = document.getElementById("codigoPostal").value.trim();
  const envio = document.querySelector('input[name="envio"]:checked')?.value;
  const pago = document.getElementById("pago").value;
  const mensaje = document.getElementById("mensajeCompra");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  if (!direccion || !ciudad || !codigoPostal) {
    return mostrarError("Por favor, completa todos los campos de dirección.");
  }

  if (!envio) {
    return mostrarError("Selecciona una forma de envío.");
  }

  if (cartItems.length === 0 || cartItems.some(p => !p.count || p.count <= 0)) {
    return mostrarError("Revisa las cantidades de los productos en el carrito.");
  }

  if (!pago) {
    return mostrarError("Selecciona una forma de pago.");
  }

  if (pago === "tarjeta") {
    const numTarjeta = document.getElementById("numTarjeta").value.trim();
    const nombreTarjeta = document.getElementById("nombreTarjeta").value.trim();
    if (!numTarjeta || !nombreTarjeta) {
      return mostrarError("Completa los campos de la tarjeta.");
    }
  }

  if (pago === "transferencia") {
    const cuenta = document.getElementById("cuenta").value.trim();
    if (!cuenta) {
      return mostrarError("Completa el número de cuenta para la transferencia.");
    }
  }

  mensaje.textContent = "✅ ¡Compra realizada con éxito! Gracias por tu compra.";
  mensaje.className = "mensaje-compra exito";

  localStorage.removeItem("cartItems");

  setTimeout(() => {
    location.reload();
  }, 2000);
}

function mostrarError(texto) {
  const mensaje = document.getElementById("mensajeCompra");
  mensaje.textContent = texto;
  mensaje.className = "mensaje-compra error";
}
