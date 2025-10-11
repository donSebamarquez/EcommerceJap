// Obtiene el nombre del usuario guardado en login_success y lo muestra en la barra
const slot = document.getElementById("userEmail");
const session = JSON.parse(localStorage.getItem("login_success"));
if (slot && session) {
  slot.textContent = session.name;
}