const API_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json";

// === Config paginación ===
const PAGE_SIZE = 4;         // cantidad por página (ajustá a gusto)
let allProducts = [];        // todo lo que viene de la API
let filteredProducts = [];   // productos filtrados/ordenados para mostrar
let currentPage = 1;         // página actual

// refs DOM
const grid = document.getElementById("productsGrid");
const alertBox = document.getElementById("alert");
const paginationUl = document.getElementById("pagination");

// refs filtros
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const filterBtn = document.getElementById("filterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const sortSelect = document.getElementById("sortOptions");

// init
document.addEventListener("DOMContentLoaded", loadProducts);

async function loadProducts() {
  grid.innerHTML = "<p>Cargando productos...</p>";

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("No se pudo obtener la lista de productos");
    const data = await res.json();
    allProducts = Array.isArray(data.products) ? data.products : [];
    filteredProducts = [...allProducts];

    if (!allProducts.length) {
      grid.innerHTML = "<p>No hay productos para mostrar.</p>";
      renderPagination(0);
      return;
    }

    currentPage = 1;
    renderPage(currentPage);
    renderPagination(filteredProducts.length);
    attachEvents();

  } catch (err) {
    console.error(err);
    grid.innerHTML = "";
    if (alertBox) {
      alertBox.textContent = "Ocurrió un error al cargar los productos. Intentá nuevamente.";
      alertBox.classList.remove("d-none");
      alertBox.classList.add("alert", "alert-danger");
    }
  }
}

// ========== Eventos filtros/orden ==========
function attachEvents() {
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      applyFilters();
      currentPage = 1;
      renderPage(currentPage);
      renderPagination(filteredProducts.length);
    });
  }

  if (clearFilterBtn) {
    clearFilterBtn.addEventListener("click", () => {
      minPriceInput.value = "";
      maxPriceInput.value = "";
      filteredProducts = [...allProducts];
      applySort();
      currentPage = 1;
      renderPage(currentPage);
      renderPagination(filteredProducts.length);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      applySort();
      currentPage = 1;
      renderPage(currentPage);
      renderPagination(filteredProducts.length);
    });
  }
}

// ========== Filtros ==========
function applyFilters() {
  const min = parseFloat(minPriceInput.value) || 0;
  const max = parseFloat(maxPriceInput.value) || Infinity;

  filteredProducts = allProducts.filter(p => {
    return p.cost >= min && p.cost <= max;
  });

  applySort();
}

// ========== Orden ==========
function applySort() {
  const sortValue = sortSelect ? sortSelect.value : "";

  if (sortValue === "priceAsc") {
    filteredProducts.sort((a, b) => a.cost - b.cost);
  } else if (sortValue === "priceDesc") {
    filteredProducts.sort((a, b) => b.cost - a.cost);
  } else if (sortValue === "relevance") {
    filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
  }
}

// ========== Render lista (solo la página pedida) ==========
function renderPage(page) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = filteredProducts.slice(start, end);

  grid.innerHTML = slice.map(cardHTML).join("");
}

// ========== Render paginación < 1 2 3 > ==========
function renderPagination(totalItems) {
  if (!paginationUl) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  paginationUl.innerHTML = "";

  const makeItem = (label, page, disabled = false, active = false) => {
    const li = document.createElement("li");
    li.className = `page-item${disabled ? " disabled" : ""}${active ? " active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (disabled || page === currentPage) return;
      currentPage = page;
      renderPage(currentPage);
      renderPagination(filteredProducts.length);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    li.appendChild(a);
    return li;
  };

  // Prev
  paginationUl.appendChild(
    makeItem("‹", Math.max(1, currentPage - 1), currentPage === 1)
  );

  // Números
  for (let i = 1; i <= totalPages; i++) {
    paginationUl.appendChild(
      makeItem(String(i), i, false, i === currentPage)
    );
  }

  // Next
  paginationUl.appendChild(
    makeItem("›", Math.min(totalPages, currentPage + 1), currentPage === totalPages)
  );
}

// ========== Card HTML ==========
function cardHTML(p) {
  const name  = escapeHTML(p.name || "");
  const desc  = escapeHTML(p.description || "");
  const img   = p.image || "";
  const price = `${p.currency || "USD"} ${p.cost ?? ""}`;
  const sold  = `${p.soldCount ?? 0} vendidos`;

  return `
    <article class="product-card">
      <div class="product-card_head">
        <span class="product-card_badge">${name}</span>
      </div>

      <img class="product-card_img"
           src="${img}"
           alt="${name}"
           onerror="this.src='img/placeholder.png'">

      <p class="product-card_desc">${desc}</p>

      <div class="product-card_price">${price}</div>
      <span class="product-card_sold">${sold}</span>
    </article>
  `;
}

// Sanitizar textos
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
