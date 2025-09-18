const login = document.querySelector('#login')
const loginError = document.querySelector('#loginError') // Muestra mensaje de contraseña o usuario incorrecto abajo de los input

login.addEventListener('submit', (e) => {
    e.preventDefault()

    // Obtiene el valor actual de los campos seleccionados
    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    // Lee lo guardado en LocalStorage y lo convierte en JSON, si no hay usa array vacio 
    const Users = JSON.parse(localStorage.getItem('users')) || []

      // Verifica si el email existe
    const userExists = Users.find(user => user.email === email)
    if (!userExists) {
        loginError.textContent = 'Este usuario no está registrado'
        return
    }
    
    // si el email y/o contraseña no son correctos no deja entrar, muestra mensaje del error
    const validUser = Users.find(user => user.password === password)
    if (!validUser) {
        loginError.textContent = 'Contraseña Incorrecta'
        return
    }

    // Si son correctos aparece cartel y entra a index.html
        loginError.textContent = `Bienvenid@ ${validUser.name}`
    alert(`Bienvenid@ ${validUser.name}`)
    localStorage.setItem('login_success', JSON.stringify(validUser))
    window.location.href = 'index.html'
})