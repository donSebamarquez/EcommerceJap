// Obtiene el nombre del usuario guardado en login_success y lo muestra en la barra
const slot = document.getElementById("userEmail");
const session = JSON.parse(localStorage.getItem("login_success"));

if (slot && session) {
  // Creamos un link
  const profileLink = document.createElement("a");
  profileLink.href = "my-profile.html"; // página del perfil
  profileLink.textContent = session.name; // nombre del usuario
  profileLink.classList.add("nav-link", "text-white"); // clases opcionales para estilo
  slot.appendChild(profileLink);
}