const user = JSON.parse(localStorage.getItem('login_success'));
if (!user) window.location.href = 'login.html';

const userKey = `user_data_${user.email}`;
const picKey = `profile_pic_${user.email}`;

const savedData = JSON.parse(localStorage.getItem(userKey)) || {};
const savedPic = localStorage.getItem(picKey) || 'img/placeholder.png';

const navPic = document.getElementById('navProfilePic');
if (navPic) navPic.src = savedPic;

const profilePic = document.getElementById("profilePic");
if (profilePic) profilePic.src = savedPic;

const userNameSlot = document.getElementById("userName");
if (userNameSlot) userNameSlot.textContent = savedData.username || user.name;

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
  if (contenedor) contenedor.appendChild(div);
});

// Guardar datos 
const saveBtn = document.getElementById("saveData");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    const updatedData = {};
    campos.forEach(campo => {
      const input = document.getElementById(campo.id);
      if (input) updatedData[campo.id] = input.value;
    });

    localStorage.setItem(userKey, JSON.stringify(updatedData));

    const displayName = updatedData.username || user.name;
    if (userNameSlot) userNameSlot.textContent = displayName;
    const navSlot = document.getElementById("userEmail");
    if (navSlot) navSlot.textContent = displayName;

    alert("Datos guardados correctamente.");
  });
}

// Cambiar foto
const changePicBtn = document.getElementById("changePicBtn");
if (changePicBtn) {
  changePicBtn.addEventListener("click", () => {
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
        if (profilePic) profilePic.src = base64;
        if (navPic) navPic.src = base64;
        localStorage.setItem(picKey, base64);
      };
      reader.readAsDataURL(file);
    };
  });
}

// Logout
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    alert(`Te extrañaremos ${user.name}`);
    localStorage.removeItem('login_success');
    window.location.href = 'login.html';
  });
}
