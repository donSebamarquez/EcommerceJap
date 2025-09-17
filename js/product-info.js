
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


function mostrarProducto(producto) {
    
    crearElemento("h2", producto.name, "product__name");
    crearElemento("p", producto.description, "product__description");
    crearElemento("p", `${producto.currency} ${producto.cost}`, "product__price");
    crearElemento("p", `Vendidos: ${producto.soldCount}`, "product__sold");
    crearElemento("p", `Categoría: ${producto.category}`, "product__category");

    const gallery = document.createElement("div");
    gallery.className = "product__gallery";

    const mainImg = document.createElement("img");
    mainImg.src = producto.images[0];
    mainImg.className = "product__gallery--main";
    gallery.appendChild(mainImg);

    const extraImages = document.createElement("div");
    extraImages.className = "product__gallery--secondaries";

    producto.images.forEach(imgSrc => {
        const secondaryImage = document.createElement("img");
        secondaryImage.src = imgSrc;
        secondaryImage.className = "product__gallery--secondary";

        secondaryImage.addEventListener("click", () => {
            mainImg.src = imgSrc;
        });

        extraImages.appendChild(secondaryImage);
    });

    gallery.appendChild(extraImages);
    contenedor.appendChild(gallery);
}


function crearElemento(tag, text, className) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    contenedor.appendChild(element);
}