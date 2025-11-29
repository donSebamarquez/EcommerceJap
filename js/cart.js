document.addEventListener("DOMContentLoaded", () => {
  actualizarBadge();
  mostrarCarrito();
});

/* ============================================================
   ACTUALIZAR BADGE DEL NAVBAR
   ============================================================ */
function actualizarBadge() {
  const badge = document.getElementById("cart-count-badge");
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const totalUnidades = cartItems.reduce((sum, item) => sum + item.count, 0);

  if (totalUnidades > 0) {
    badge.style.display = "inline-block";
    badge.textContent = totalUnidades;
  } else {
    badge.style.display = "none";
  }
}

/* ============================================================
   MOSTRAR CARRITO
   ============================================================ */
function mostrarCarrito() {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const cartContainer = document.querySelector(".cart-container");
  const checkoutSection = document.getElementById("checkout-section");

  cartContainer.innerHTML = "";
  checkoutSection.innerHTML = "";

  /* Carrito vacío */
  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart-message text-center my-5">
        <h4 class="mb-3">Tu carrito está vacío</h4>
        <p class="mb-4">Parece que aún no agregaste productos.</p>
        <button id="goToCategoriesBtn" class="btn btn-primary px-4 py-2">
          Explorar productos
        </button>
      </div>
    `;

    document.getElementById("goToCategoriesBtn").onclick = () =>
      (window.location.href = "categories.html");

    document.querySelector(".cart-total").textContent = "";
    actualizarBadge();
    return;
  }

  /* Render items del carrito */
  cartItems.forEach(item => {
    const card = document.createElement("div");
    card.className = "cart-item-card";

    card.innerHTML = `
      <img src="${item.image}" class="cart-item-img">

      <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>Precio unitario: USD ${item.cost}</p>
          <p class="cart-item-subtotal">Subtotal: USD ${item.cost * item.count}</p>

          <div class="cart-item-controls">
              <button class="qty-btn decrease">−</button>
              <span class="cart-item-quantity">${item.count}</span>
              <button class="qty-btn increase">+</button>

              <button class="remove-item-btn">
                <img src="img/trash.png" class="trash-icon">
              </button>
          </div>
      </div>
    `;

    /* Aumentar cantidad */
    card.querySelector(".increase").addEventListener("click", () => {
      item.count++;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      mostrarCarrito();
    });

    /* Disminuir cantidad */
    card.querySelector(".decrease").addEventListener("click", () => {
      if (item.count > 1) {
        item.count--;
      } else {
        cartItems = cartItems.filter(p => p.id !== item.id);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      mostrarCarrito();
    });

    /* Eliminar item */
    card.querySelector(".remove-item-btn").addEventListener("click", () => {
      eliminarItem(item.id);
    });

    cartContainer.appendChild(card);
  });

  actualizarBadge();
  actualizarSubtotal(cartItems);
  generarFormularioCompra();
  calcularCostos();
}

/* ============================================================
   ELIMINAR ITEM DEL CARRITO
   ============================================================ */
function eliminarItem(id) {
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  cartItems = cartItems.filter(x => x.id !== id);
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  mostrarCarrito();
}

/* ============================================================
   ACTUALIZAR SUBTOTAL SUPERIOR
   ============================================================ */
function actualizarSubtotal(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.cost * item.count, 0);
  document.querySelector(".cart-total").textContent = `Subtotal: USD ${subtotal}`;
}

/* ============================================================
   FORMULARIO DE COMPRA
   ============================================================ */
function generarFormularioCompra() {
  const checkout = document.getElementById("checkout-section");

  checkout.innerHTML = `
    <h3 class="mt-4">Dirección de envío</h3>
    <input id="departamento" class="form-input" placeholder="Departamento">
    <input id="localidad" class="form-input" placeholder="Localidad">
    <input id="calle" class="form-input" placeholder="Calle">
    <input id="numero" class="form-input" type="number" placeholder="Número">
    <input id="esquina" class="form-input" placeholder="Esquina">

    <h3 class="mt-4">Tipo de envío</h3>
    <label><input type="radio" name="envio" value="premium"> Premium </label><br>
    <label><input type="radio" name="envio" value="express"> Express </label><br>
    <label><input type="radio" name="envio" value="standard"> Standard </label>

    <h3 class="mt-4">Forma de pago</h3>
    <select id="pago" class="form-select">
      <option value="">Seleccionar...</option>
      <option value="tarjeta">Tarjeta de crédito</option>
      <option value="transferencia">Transferencia bancaria</option>
    </select>

    <div id="pago-tarjeta" class="pago-opcion hidden mt-2">
      <input id="numTarjeta" class="form-input" placeholder="Número de tarjeta">
      <input id="nombreTarjeta" class="form-input" placeholder="Nombre en la tarjeta">
    </div>

    <div id="pago-transferencia" class="pago-opcion hidden mt-2">
      <input id="cuenta" class="form-input" placeholder="Número de cuenta bancaria">
    </div>

    <h3 class="mt-4">Costos</h3>
    <p id="subtotalCosto">Subtotal: USD 0</p>
    <p id="envioCosto">Costo de envío: USD 0</p>
    <p id="totalCosto" class="fw-bold fs-5">Total: USD 0</p>

    <button id="finalizarCompraBtn" class="btn btn-success w-100 mt-3">Finalizar compra</button>
    <div id="mensajeCompra" class="mt-2"></div>
  `;

  /* Mostrar campos de pago */
  document.getElementById("pago").addEventListener("change", (e) => {
    document.querySelectorAll(".pago-opcion").forEach(div =>
      div.classList.add("hidden")
    );
    if (e.target.value)
      document.getElementById(`pago-${e.target.value}`).classList.remove("hidden");
  });

  /* Recalcular costos al cambiar envío */
  document.querySelectorAll('input[name="envio"]').forEach(radio =>
    radio.addEventListener("change", calcularCostos)
  );

  document.getElementById("finalizarCompraBtn").onclick = validarCompra;
}

/* ============================================================
   CALCULAR COSTOS (Subtotal + Envío + Total)
   ============================================================ */
function calcularCostos() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const subtotal = cartItems.reduce((s, item) => s + item.cost * item.count, 0);

  const envio = document.querySelector('input[name="envio"]:checked')?.value;

  let porcentaje = 0;
  if (envio === "premium") porcentaje = 0.15;
  if (envio === "express") porcentaje = 0.07;
  if (envio === "standard") porcentaje = 0.05;

  const costoEnvio = subtotal * porcentaje;
  const total = subtotal + costoEnvio;

  document.getElementById("subtotalCosto").textContent = `Subtotal: USD ${subtotal}`;
  document.getElementById("envioCosto").textContent = `Costo de envío: USD ${costoEnvio.toFixed(2)}`;
  document.getElementById("totalCosto").textContent = `Total: USD ${total.toFixed(2)}`;
}

/* ============================================================
   VALIDAR FINALIZACIÓN DE COMPRA
   ============================================================ */
async function validarCompra() {
  const departamento = document.getElementById("departamento").value.trim();
  const localidad = document.getElementById("localidad").value.trim();
  const calle = document.getElementById("calle").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const esquina = document.getElementById("esquina").value.trim();
  const envio = document.querySelector('input[name="envio"]:checked');
  const pago = document.getElementById("pago").value;
  const mensaje = document.getElementById("mensajeCompra");

  if (!departamento || !localidad || !calle || !numero || !esquina)
    return mostrarError("Completa todos los datos de la dirección.");

  if (!envio)
    return mostrarError("Selecciona un tipo de envío.");

  if (!pago)
    return mostrarError("Selecciona un método de pago.");

  if (pago === "tarjeta") {
    const n1 = document.getElementById("numTarjeta").value.trim();
    const n2 = document.getElementById("nombreTarjeta").value.trim();
    if (!n1 || !n2) return mostrarError("Completa los datos de la tarjeta.");
  }

  if (pago === "transferencia") {
    const cuenta = document.getElementById("cuenta").value.trim();
    if (!cuenta) return mostrarError("Ingresa la cuenta bancaria.");
  }

  // ================================================
  //  Agregar acá el envío a tu backend
  // ================================================
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const token = localStorage.getItem("token");

  try {
   const res = await fetch("http://localhost:3000/cart", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ items: cartItems })
});


    const data = await res.json();

    if (!res.ok) {
      return mostrarError(data.message || "Error al guardar el carrito.");
    }

    mensaje.className = "text-success";
    mensaje.textContent = "Compra realizada con éxito";

    localStorage.removeItem("cartItems");
    actualizarBadge();

    setTimeout(() => location.reload(), 2000);

  } catch (error) {
    console.error(error);
    mostrarError("Error de conexión con el servidor.");
  }
}


function mostrarError(msg) {
  const mensaje = document.getElementById("mensajeCompra");
  mensaje.className = "text-danger";
  mensaje.textContent = msg;
}
