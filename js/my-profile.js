// Obtiene usuario logueado
const user = JSON.parse(localStorage.getItem('login_success')) || false;
if (!user) window.location.href = 'login.html';

// Cargar datos guardados si hay, sino usar lo de login_success
const savedData = JSON.parse(localStorage.getItem('user_data')) || {};
const savedPic = localStorage.getItem('profile_pic') || 'img/placeholder.png';

document.getElementById("userName").textContent = savedData.username || user.name;

// foto de perfil
const profilePic = document.getElementById("profilePic");
profilePic.src = savedPic;

// inputs 
const contenedor = document.getElementById("inputsContainer");

const campos = [
    { id: "username", label: "Nombre de usuario", value: savedData.username || user.name },
    { id: "nombre", label: "Nombre", value: savedData.nombre || "" },
    { id: "apellido", label: "Apellido", value: savedData.apellido || "" },
    { id: "email", label: "Correo electrónico", value: savedData.email || user.email },
    { id: "telefono", label: "Teléfono", value: savedData.telefono || "" },
];

campos.forEach(campo => {
    const div = document.createElement("div");
    div.className = "mb-3";

    const label = document.createElement("label");
    label.textContent = campo.label;
    label.className = "form-label";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "form-control";
    input.id = campo.id;
    input.value = campo.value;

    div.appendChild(label);
    div.appendChild(input);
    contenedor.appendChild(div);
});

// Guardar datos en localStorage
document.getElementById("saveData").addEventListener("click", () => {
    const updatedData = {};

    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (input) {
            updatedData[campo.id === "username" ? "username" : campo.id] = input.value;
        }
    });

    localStorage.setItem('user_data', JSON.stringify(updatedData));

    // Actualizar la card y nav
    document.getElementById("userName").textContent = updatedData.username;
    const navSlot = document.getElementById("userEmail");
    if (navSlot) navSlot.textContent = updatedData.username;

    alert("Datos guardados correctamente.");
});

// Cambiar foto de perfil
document.getElementById("changePicBtn").addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            profilePic.src = base64;
            localStorage.setItem('profile_pic', base64); // Guarda foto en localstorage
        };
        reader.readAsDataURL(file);
    };
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    alert(`Te extrañaremos ${user.name}`);
    localStorage.removeItem('login_success'); 
    window.location.href = 'login.html';
});