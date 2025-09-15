
const keyProduct = localStorage.getItem("ProductId");
const url = `https://japceibal.github.io/emercado-api/products/${keyProduct}.json`

let contenedor = document.querySelector(".product");

document.addEventListener("DOMContentLoaded",cargarProducto)


async function cargarProducto(){
    
    try {
    
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const product = await res.json();
        mostrarProducto(product);
    }
    
    catch (e) {
        console.error("Error al cargar el producto:", e);

        contenedor.innerHTML = `
            <p class="product__error">
                Ocurrió un error al cargar el producto. Intenta nuevamente más tarde.
            </p>
        `;  
}

}


function mostrarProducto(producto){

    crearElemento("h2",producto.name,"product__name")
    
    crearElemento("p",producto.description,"product__description")
    
    crearElemento("p",producto.currency,"product__currency")
    
    crearElemento("p",producto.cost,"product__cost")
    
    crearElemento("p",producto.soldCount,"product__cost")
    
    crearElemento("p",producto.category,"product__category")

    const arrayImages = producto.images;
    arrayImages.forEach(imgSrc =>{
        let image = document.createElement("img");
        image.src = imgSrc
        image.className = "product__img"
        contenedor.appendChild(image)
    }) 
    
}


function crearElemento(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    contenedor.appendChild(element);
    return element;
}