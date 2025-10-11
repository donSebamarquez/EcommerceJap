const keyProduct = localStorage.getItem("ProductId");
const url = `https://japceibal.github.io/emercado-api/products/${keyProduct}.json`
const commentariesUrl = `https://japceibal.github.io/emercado-api/products_comments/${keyProduct}.json`

let main = document.querySelector(".main")
let container = main.querySelector(".product");
let relatedProducts = main.querySelector(".related")
let form = main.querySelector(".form")

// variables para comentarios y estrellas del producto
let productStarsContainer;
let commentsContainer;
let localCommentsKey = `comments_${keyProduct}`;

document.addEventListener("DOMContentLoaded", cargarProducto)

async function cargarProducto() {
    try {
        const productRes = await fetch(url);
        if (!productRes.ok) throw new Error("Error al cargar los datos del producto");
        const commentariesRes = await fetch(commentariesUrl);
        if (!commentariesRes.ok) throw new Error("Error al cargar los comentarios del producto");
        const product = await productRes.json();
        const commentaries = await commentariesRes.json();

        let savedComments = JSON.parse(localStorage.getItem(localCommentsKey)) || [];
        showProduct(product, commentaries.concat(savedComments));
    } catch (e) {
        console.error(e.message);
        container.innerHTML = `<p class="product__error">${e.message}. Intenta nuevamente más tarde.</p>`;
    }
}

function showProduct(product, commentaries) {
    createProduct(product)
    showRelatedProducts(product.relatedProducts)
    showCommentaries(commentaries);

    commentsContainer = main.querySelector(".comments-container");

    //promedio de estrellas en el producto
    let averageScore = 0;
    if (commentaries.length > 0) {
        averageScore = commentaries.reduce((sum, c) => sum + c.score, 0) / commentaries.length;
        averageScore = Math.round(averageScore);
    }

    productStarsContainer = stars(averageScore, true);
    productStarsContainer.classList.add("product-stars");
    container.appendChild(productStarsContainer);
}

function showRelatedProducts(products) {
    const productId = "ProductId";
    products.forEach(product => {
        const item = document.createElement("div");
        item.className = "related__item";
        crearElemento("p", product.name, "related__name", item);
        const image = document.createElement("img");
        image.className = "related__img";
        image.src = product.image;
        image.addEventListener("click", function () {
            localStorage.setItem(productId, product.id);
            window.location.href = "product-info.html";
        })
        item.appendChild(image);
        relatedProducts.appendChild(item);
    })
}

// Comentarios en el DOM
function showCommentaries(commentaries) {
    commentsContainer = document.createElement("div");
    commentsContainer.className = "comments-container";
    main.appendChild(commentsContainer);
    commentaries.forEach(commentary => {
        addCommentToDOM(commentary);
    })
}

// cada comentario se le agrega avatar y estrellas
function addCommentToDOM(commentary) {
    const commentBlock = document.createElement("div");
    commentBlock.className = "comment-block";

    const avatar = document.createElement("div");
    avatar.className = "comment-avatar";
    avatar.textContent = "👤";

    commentBlock.appendChild(avatar);

    const content = document.createElement("div");
    content.className = "comment-content";

    crearElemento("p", commentary.user, "comment-meta", content);
    crearElemento("p", commentary.description, "comment-text", content);
    crearElemento("p", commentary.dateTime, "comment-meta", content);

    const starsContainer = stars(commentary.score, false);
    content.appendChild(starsContainer);

    commentBlock.appendChild(content);
    commentsContainer.appendChild(commentBlock);
}

// funcion de estrellas
function stars(score = 0, interactive = true) {
    const starsContainer = document.createElement("div");
    starsContainer.className = "stars-container";

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("i");
        star.className = i <= score ? "bi bi-star-fill" : "bi bi-star";
        star.dataset.value = i;

        if (interactive) {
            star.addEventListener("mouseenter", () => {
                const allStars = starsContainer.querySelectorAll("i");
                allStars.forEach((s, index) => {
                    s.className = index < i ? "bi bi-star-fill" : "bi bi-star";
                });
            });

            star.addEventListener("mouseleave", () => {
                const allStars = starsContainer.querySelectorAll("i");
                allStars.forEach((s, index) => {
                    s.className = index < score ? "bi bi-star-fill" : "bi bi-star";
                });
            });

            star.addEventListener("click", () => {
                const allStars = starsContainer.querySelectorAll("i");
                allStars.forEach((s, index) => {
                    s.className = index < i ? "bi bi-star-fill" : "bi bi-star";
                });
                score = i;

                showCommentModal(i);
            });
        }

        starsContainer.appendChild(star);
    }

    return starsContainer;
}

//modal flotante para comentar en un input 
function showCommentModal(starScore) {
    const modal = document.createElement("div");
    modal.className = "comment-modal";
    modal.innerHTML = `
        <div class="comment-modal-content">
            <h3>Deja un comentario</h3>
            <textarea placeholder="Escribe tu comentario aquí"></textarea>
            <button>Enviar</button>
        </div>
    `;
    document.body.appendChild(modal);

    const btn = modal.querySelector("button");
    const textarea = modal.querySelector("textarea");

    btn.addEventListener("click", () => {
        const text = textarea.value.trim();
        if (text !== "") {
            const newComment = {
                description: text,
                user: "Tú",
                dateTime: new Date().toLocaleString(),
                score: starScore
            };

            //guarda los comentarios en el DOM y LocalStorage
            addCommentToDOM(newComment);

            const savedComments = JSON.parse(localStorage.getItem(localCommentsKey)) || [];
            savedComments.push(newComment);
            localStorage.setItem(localCommentsKey, JSON.stringify(savedComments));

            const allScores = Array.from(commentsContainer.querySelectorAll(".comment-block .stars-container")).map(s => {
                return s.querySelectorAll("i.bi-star-fill").length;
            });
            const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
            const productStars = container.querySelector(".product-stars");
            const starsElems = productStars.querySelectorAll("i");
            starsElems.forEach((s, index) => {
                s.className = index < avg ? "bi bi-star-fill" : "bi bi-star";
            });

            document.body.removeChild(modal);
        }
    });
}

function addCommentary() { }

function createProduct(product) {
    crearElemento("h2", product.name, "product__name", container);
    crearElemento("p", product.description, "product__description", container);
    crearElemento("p", `${product.currency} ${product.cost}`, "product__price", container);
    crearElemento("p", `Vendidos: ${product.soldCount}`, "product__sold", container);
    crearElemento("p", `Categoría: ${product.category}`, "product__category", container);
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

function crearElemento(tag, text, className, container) {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    container.appendChild(element);
}
