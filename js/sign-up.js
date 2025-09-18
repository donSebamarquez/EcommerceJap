const signupFora = document.querySelector('#signupFora')
const errorDiv = document.getElementById('signup-error') // selecciona el div que menciona el errror

signupFora.addEventListener('submit', (e) => {
    e.preventDefault()
    // Limpia cualquier mensaje de error previo
    errorDiv.textContent = ""

    const name = document.querySelector('#name').value
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    // Valida que la contraseña tenga al menos 6 caracteres, una mayúscula y una minúscula
    const passwordRes = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRes.test(password)) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula';
        return
    }

    // utiliza datos existente en localStorage o array vacio si no hay nada y verifica si el mail ya existe
    const Users = JSON.parse(localStorage.getItem('users')) || []
    const isUserRegistered = Users.find(user => user.email === email)

    // si el mail/usuario ya existe salta cartel y lo redirige al login.html
    if (isUserRegistered) {
        alert ('El Usuario ya esta registrado')
        window.location.href = 'login.html'
        return
    }

    // Crea un objeto con los datos del nuevo usuario, con el push lo agrega al array y lo guarada en el localStorage
    const newUser = { name: name, email: email, password: password }
    Users.push(newUser)
    localStorage.setItem('users', JSON.stringify(Users))
    // guarda la sesion acttiva
    localStorage.setItem('login_success', JSON.stringify(newUser))
    errorDiv.textContent = "" // Limpia el error si todo sale bien

    // cartel de Bienvenida y  redirige a index.html
    alert('Registro exitoso, BIENVENID@')
    window.location.href = 'index.html'
})