const temaGuardado = localStorage.getItem("theme");

if (temaGuardado) {
  document.documentElement.setAttribute("data-theme", temaGuardado);
}

const boton = document.querySelector("#themeToggle");

if(boton){
    
    boton.addEventListener("click", () => {
    
        const temaActual = document.documentElement.getAttribute("data-theme");
        const nuevoTema = temaActual === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", nuevoTema);
        localStorage.setItem("theme", nuevoTema);
        console.log(nuevoTema)
    });
}