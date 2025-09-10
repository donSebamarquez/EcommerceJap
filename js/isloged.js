document.addEventListener("DOMContentLoaded",function(){
        const KEY = "userName";
        const session = localStorage.getItem(KEY);
    if (!session) {
    // --- Redirección si no hay usuario ---
    // Localhost:
     window.location.href = "http://127.0.0.1:5500/login.html";

    // GitHub Pages:
    /*window.location.href = "https://donsebamarquez.github.io/EcommerceJap/login.html";*/
    return;
  }

  // --- Mostrar correo en la barra ---
  const slot = document.getElementById("userEmail");
  if (slot) {
    slot.textContent = session;
        }

})