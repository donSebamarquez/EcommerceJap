
const keyProduct = localStorage.getItem("ProductId");
const url = `https://japceibal.github.io/emercado-api/products/${keyProduct}.json`
const commentariesUrl =`https://japceibal.github.io/emercado-api/products_comments/${keyProduct}.json`

let main = document.querySelector(".main")

let container = main.querySelector(".product");

let relatedProducts = main.querySelector(".related")

let form = main.querySelector(".form")

document.addEventListener("DOMContentLoaded",cargarProducto)


async function cargarProducto() {
  
    try {

    const productRes = await fetch(url);
    if (!productRes.ok) {
      throw new Error("Error al cargar los datos del producto");
    }

    const commentariesRes = await fetch(commentariesUrl);
    if (!commentariesRes.ok) {
      throw new Error("Error al cargar los comentarios del producto");
    }

    const product = await productRes.json();
    const commentaries = await commentariesRes.json();

    showProduct(product, commentaries);
  } 

  catch (e) {
    console.error(e.message);
    container.innerHTML = `
      <p class="product__error">${e.message}. Intenta nuevamente más tarde.</p>
    `;
  }
}



function showProduct(product,commentaries) {

    createProduct(product)
    showRelatedProducts(product.relatedProducts)
    showCommentaries(commentaries);

}

function showRelatedProducts(products){
    const productId = "ProductId";

    products.forEach( product =>{

        const item = document.createElement("div");
        item.className = "related__item";

        crearElemento("p",product.name,"related__name",item);
        
        const image = document.createElement("img");
        image.className= "related__img";
        image.src = product.image;

        image.addEventListener("click",function(){
            localStorage.setItem(productId,product.id);
            window.location.href = "product-info.html";
        })

        item.appendChild(image);

        relatedProducts.appendChild(item);

    })

}

function showCommentaries(commentaries){
    
    let commentsContainer = document.createElement("div");
    main.appendChild(commentsContainer);
    console.log(commentaries)
    
    commentaries.forEach(commentary =>{

        crearElemento("p", commentary.description, "commentaries", commentsContainer);
        crearElemento("p", commentary.user, "commentaries", commentsContainer);
        crearElemento("p", commentary.dateTime, "commentaries", commentsContainer);
        /*Funcion para crear y mostrar las estrellas creadas */
        /*let stars = stars(commentary.score);*/
        
        
    })


}

function stars(stars){

    let starsContainer = crearElemento("div",null,"container__stars",);

    let fullStars = stars; 
    let emptyStars = 5 - score;

    for(let x = 0; x < fullStars;x++){

        let fullStar = createComponent("i",null,"bi bi-star-fill");
        starsContainer.appendChild(fullStar);

    }
    
    for(let y = 0; y < emptyStars;y++){

        let emptyStar = createComponent("i",null,"bi bi-star")
        starsContainer.appendChild(emptyStar);

    }
        
    return starsContainer;


}

function addCommentary(){



}

function createProduct(product){
    
    crearElemento("h2", product.name, "product__name",container);
    crearElemento("p", product.description, "product__description",container);
    crearElemento("p", `${product.currency} ${product.cost}`, "product__price",container);
    crearElemento("p", `Vendidos: ${product.soldCount}`, "product__sold",container);
    crearElemento("p", `Categoría: ${product.category}`, "product__category",container);

    const gallery = document.createElement("div");
    gallery.className = "product__gallery";

    const mainImg = document.createElement("img");
    mainImg.src = product.images[0];
    mainImg.className = "product__gallery--main";
    gallery.appendChild(mainImg);

    const extraImages = document.createElement("div");
    extraImages.className = "product__gallery--secondaries";

    product.images.forEach(imgSrc => {
        const secondaryImage = document.createElement("img");
        secondaryImage.src = imgSrc;
        secondaryImage.className = "product__gallery--secondary";

        secondaryImage.addEventListener("click", () => {
            mainImg.src = imgSrc;
        });

        extraImages.appendChild(secondaryImage);
    });
    
    gallery.appendChild(extraImages);
    container.appendChild(gallery);

}

function crearElemento(tag, text, className,container) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    container.appendChild(element);
}