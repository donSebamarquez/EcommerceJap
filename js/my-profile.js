const user = JSON.parse(localStorage.getItem('login_success')) || false     // Obtiene datos de localStorage, si no existe devuelve false

// si no hay usuario logueado redirige al login
if (!user) {
    window.location.href = 'login.html'
}

const logout = document.querySelector('#logout')

// al hacer click cierra la sesion pero antes muestra cartel y te redirige al login 
logout.addEventListener('click', () => {
    alert(`Te extrañaremos ${user.name}`)
    localStorage.removeItem('login_success')
    window.location.href = 'login.html'
})
