const login = document.querySelector('#login');
const loginError = document.querySelector('#loginError');

login.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const Users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = Users.find(user => user.email === email);
    if (!userExists) {
        loginError.textContent = 'Este usuario no está registrado';
        return;
    }

    if (userExists.password !== password) {
        loginError.textContent = 'Contraseña incorrecta';
        return;
    }

    // Guardar sesión activa
    localStorage.setItem('login_success', JSON.stringify(userExists));

    alert(`Bienvenid@ ${userExists.name}`);
    window.location.href = 'index.html';
});
