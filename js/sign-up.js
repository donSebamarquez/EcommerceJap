const signupFora = document.querySelector('#signupFora')

signupFora.addEventListener('submit', (e) => {
    e.preventDefault()

    // Valores de input
    const Usuario = document.querySelector('#Usuario').value
    const Email = document.querySelector('#Email').value
    const Contraseña = document.querySelector('#Contraseña').value

    const Users = JSON.parse(localStorage.getItem('users')) || []

    // Verificar existencia de usuario
    const isUserRegistered = Users.find(user => user.email === Email)
    if (isUserRegistered) {
        alert('El usuario ya está registrado')
        return
    }

    // Usuario guardado
    Users.push({ name: Usuario, email: Email, password: Contraseña })
    localStorage.setItem('users', JSON.stringify(Users))

    // Usuario redirige al login
    alert('Registro Exitoso!')
    window.location.href = 'login.html'
})