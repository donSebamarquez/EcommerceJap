const signupFora = document.querySelector('#signupFora');
const errorDiv = document.getElementById('signup-error');

signupFora.addEventListener('submit', (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const passwordRes = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRes.test(password)) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula';
        return;
    }

    const Users = JSON.parse(localStorage.getItem('users')) || [];
    if (Users.find(user => user.email === email)) {
        alert('El usuario ya está registrado');
        window.location.href = 'login.html';
        return;
    }

    const newUser = { name, email, password };
    Users.push(newUser);
    localStorage.setItem('users', JSON.stringify(Users));

    // Guardar sesión activa
    localStorage.setItem('login_success', JSON.stringify(newUser));

    alert('Registro exitoso, BIENVENID@');
    window.location.href = 'index.html';
});
