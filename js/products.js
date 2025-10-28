// === Config paginación ===
const PAGE_SIZE = 10;         // cantidad por página (ajustá a gusto)
let allProducts = [];        // todo lo que viene de la API
let originalProducts = [];  //Copia inmutable del resultado de la ap
let currentPage = 1;         // página actual

// refs DOM
const grid = document.getElementById("productsGrid");
const alertBox = document.getElementById("alert");
const paginationUl = document.getElementById("pagination");
const searchInputProduct = document.getElementById("searchInput");

// refs controles
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");
const filterBtn = document.getElementById("filterBtn");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const sortSelect = document.getElementById("sortOptions");

// === URL DINÁMICA según la categoría seleccionada ===
function buildApiUrlOrRedirect() {
  const catId = localStorage.getItem("catID");      // misma key que setCatID
  if (!catId) {
    alert("No seleccionaste categoría. Volviendo al inicio…");
    location = "index.html";
    throw new Error("catID no encontrado");         // corta la ejecución
  }
  return `https://japceibal.github.io/emercado-api/cats_products/${catId}.json`;
}

// init
document.addEventListener("DOMContentLoaded", loadProducts);

/*Buscador Dinamico*/
searchInputProduct.addEventListener("input",searchProduct)


async function loadProducts() {
  grid.innerHTML = "<p>Cargando productos...</p>";

  try {
    const API_URL = buildApiUrlOrRedirect(); 
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("No se pudo obtener la lista de productos");
    const data = await res.json();
    allProducts = Array.isArray(data.products) ? data.products : [];
    originalProducts = allProducts.slice(); // Guardado original para restaurar
  
    if (!allProducts.length) {
      grid.innerHTML = "<p>No hay productos para mostrar.</p>";
      renderPagination(0);
      return;
    }

    currentPage = 1;
    renderPage(currentPage);
    renderPagination(allProducts.length);

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

// ========== Render lista (solo la página pedida) ==========
function renderPage(page) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = allProducts.slice(start, end);

  grid.innerHTML = slice.map(cardHTML).join("");

  guardarProductId(grid)
}

// ========== Render paginación < 1 2 3 > ==========
function renderPagination(totalItems) { 
  if (!paginationUl) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  paginationUl.innerHTML = "";

  const makeItem = (label, page, disabled = false, active = false) => {
    const li = document.createElement("li");
    li.className = `page-item ${disabled ? " disabled" : ""}${active ? " active" : ""}`;

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (disabled || page === currentPage) return;
      currentPage = page;
      renderPage(currentPage);
      renderPagination(allProducts.length);
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
  const id    = p.id ?? "";
  const name  = escapeHTML(p.name || "");
  const desc  = escapeHTML(p.description || "");
  const img   = p.image || "";
  const price = `${p.currency || "USD"} ${p.cost ?? ""}`;
  const sold  = `${p.soldCount ?? 0} vendidos`;

  return `
    <article class="product" data-prod-id="${id}" role="button" tabindex="0">
      <div class="product__header">
        <span class="product__badge">${name}</span>
      </div>

      <img class="product__img"
           src="${img}"
           alt="${name}"
           onerror="this.src='img/placeholder.png'">

      <p class="product__description">${desc}</p>

      <div class="product__price">${price}</div>
      <span class="product__sold">${sold}</span>
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

function searchProduct(){
    
    let searchProductInput = this.value.toLowerCase();

    let filteredArray = originalProducts.filter(product =>
        (product.name || "").toLowerCase().includes(searchProductInput) || 
        (product.description || "").toLowerCase().includes(searchProductInput));
    
    allProducts = searchProductInput ? filteredArray : originalProducts.slice();

    currentPage = 1;
    renderPage(currentPage);
    renderPagination(allProducts.length);

}

function guardarProductId(gridElement){
    
    const cards = gridElement.querySelectorAll(".product");
    const ProductId = "ProductId";
    
    cards.forEach(product =>{
        
        const ID = product.getAttribute("data-prod-id");
        product.addEventListener("click",function(){

            localStorage.setItem(ProductId,ID);
            window.location.href = "product-info.html";

        })
    })
    
}

// funciones filtro y orden
function applyPriceAndSortFilters() {

    const min = parseFloat(minPriceInput.value) || 0;
    const max = parseFloat(maxPriceInput.value) || Infinity;

    // Aplicar orden
    const sortValue = sortSelect ? sortSelect.value : "";
    if (sortValue === "priceAsc") {
        allProducts.sort((a, b) => a.cost - b.cost);
    } else if (sortValue === "priceDesc") {
        allProducts.sort((a, b) => b.cost - a.cost);
    } else if (sortValue === "relevance") {
        allProducts.sort((a, b) => b.soldCount - a.soldCount);
    }

    // Renderizar
    currentPage = 1;
    renderPage(currentPage);
    renderPagination(allProducts.length);

}

// eventos controles
filterBtn.addEventListener("click", applyPriceAndSortFilters);

clearFilterBtn.addEventListener("click", () => {

    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortSelect.value = "priceAsc";
    allProducts = originalProducts.slice();
    currentPage = 1;
    renderPage(currentPage);
    renderPagination(allProducts.length);

});

sortSelect.addEventListener("change", applyPriceAndSortFilters);
