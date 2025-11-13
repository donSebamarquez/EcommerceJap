const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// === Actualizador del badge del carrito ===
document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("cart-count-badge");
  if (!badge) return; // si no existe (otras páginas), no hace nada

  // función para refrescar el número
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalItems = cart.reduce((acc, item) => acc + (item.count || 1), 0);

    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "inline-flex";
    } else {
      badge.style.display = "none";
    }
  }

  // Actualizar al cargar
  updateCartBadge();

  // Actualizar cuando cambie localStorage (por otras pestañas o scripts)
  window.addEventListener("storage", (e) => {
    if (e.key === "cartItems") updateCartBadge();
  });

  // Exponer para que otros scripts puedan llamarlo
  window.updateCartBadge = updateCartBadge;
});