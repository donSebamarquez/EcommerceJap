// Mostrar el nombre de usuario en el nav
const slot = document.getElementById("userEmail");
const session = JSON.parse(localStorage.getItem("login_success"));
const userData = JSON.parse(localStorage.getItem("user_data")); // datos guardados

if (slot) {
  // Prioriza username guardado, si no existe usa name de login_success
  slot.textContent = userData?.username || session?.name || "Usuario";
}
