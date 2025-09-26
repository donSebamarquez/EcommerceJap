
const keyProduct = localStorage.getItem("ProductId");
const url = `https://japceibal.github.io/emercado-api/products/${keyProduct}.json`

let contenedor = document.querySelector(".product");

let relatedProducts = document.querySelector(".related")

document.addEventListener("DOMContentLoaded",cargarProducto)


async function cargarProducto(){
    
    try {
    
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }

        const product = await res.json();
        console.log(product)
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
    
    crearElemento("h2", producto.name, "product__name",contenedor);
    crearElemento("p", producto.description, "product__description",contenedor);
    crearElemento("p", `${producto.currency} ${producto.cost}`, "product__price",contenedor);
    crearElemento("p", `Vendidos: ${producto.soldCount}`, "product__sold",contenedor);
    crearElemento("p", `Categoría: ${producto.category}`, "product__category",contenedor);

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

    showRelatedProducts(producto.relatedProducts)

}


function crearElemento(tag, text, className,container) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    container.appendChild(element);
}



function showRelatedProducts(products){
    const ProductId = "ProductId";

    products.forEach( product =>{

        const item = document.createElement("div");
        item.className = "related__item";

        crearElemento("p",product.name,"related__name",item);
        
        const image = document.createElement("img");
        image.className= "related__img";
        image.src = product.image;

        image.addEventListener("click",function(){
            localStorage.setItem(ProductId,product.id);
            window.location.href = "product-info.html";
        })

        item.appendChild(image);

        relatedProducts.appendChild(item);

    })

}