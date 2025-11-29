const login = document.querySelector('#login');
const loginError = document.querySelector('#loginError');

login.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    try {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            loginError.textContent = data.message || "Error al iniciar sesión";
            return;
        }

        // GUARDAR TOKEN
        localStorage.setItem("token", data.token);

        // GUARDAR USUARIO (FORMATO eMercado)
        localStorage.setItem("login_success", JSON.stringify({
            email: data.user.email,
            name: data.user.name,
            id: data.user.id
        }));

        alert(`Bienvenid@ ${data.user.name}`);

        window.location.href = "index.html";

    } catch (error) {
        loginError.textContent = "No se pudo conectar al servidor";
        console.error(error);
    }
});
