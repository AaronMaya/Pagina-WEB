/* =========================================
   CATÁLOGO DE TABLAS
========================================= */


const productsGrid =
    document.getElementById("products-grid");


/* =========================================
   FORMATO DE PRECIO
========================================= */

function formatPrice(price) {

    if (price === 0) {

        return "Precio por definir";

    }

    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN"
        }
    ).format(price);

}


/* =========================================
   OBTENER CARRITO
========================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("aithanaCart")
    ) || [];

}


/* =========================================
   GUARDAR CARRITO
========================================= */

function saveCart(cart) {

    localStorage.setItem(
        "aithanaCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   AGREGAR PRODUCTO
========================================= */

function addToCart(productId, quantity) {

    const product =
        PRODUCTS.find(
            item => item.id === productId
        );

    if (!product) return;


    const cart = getCart();


    const existingProduct =
        cart.find(
            item => item.id === productId
        );


    if (existingProduct) {

        existingProduct.quantity += quantity;

    } else {

        cart.push({

            id: product.id,

            name: product.name,

            price: product.price,

            image: product.image,

            quantity: quantity

        });

    }


    saveCart(cart);


    updateCartCount();


    showAddedMessage();

}


/* =========================================
   CONTADOR DEL CARRITO
========================================= */

function updateCartCount() {

    const cart = getCart();


    const totalItems =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const cartCount =
        document.getElementById("cart-count");


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }

}


/* =========================================
   MENSAJE DE PRODUCTO AGREGADO
========================================= */

function showAddedMessage() {

    const message =
        document.createElement("div");

    message.className =
        "cart-toast";

    message.innerHTML = `
        <i class="fa-solid fa-check"></i>
        Producto agregado al carrito
    `;


    document.body.appendChild(message);


    setTimeout(() => {

        message.classList.add("show");

    }, 10);


    setTimeout(() => {

        message.classList.remove("show");

        setTimeout(() => {

            message.remove();

        }, 300);

    }, 2200);

}


/* =========================================
   CREAR TARJETA
========================================= */

function createProductCard(product, index) {

    const article =
        document.createElement("article");


    article.className =
        "product-card";


    article.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

        </div>


        <div class="product-content">

            <span class="product-number">
                ${String(index + 1).padStart(2, "0")}
            </span>


            <h2>
                ${product.name}
            </h2>


            <p>
                ${product.description}
            </p>


            <div class="product-price">

                ${
                    product.price > 0
                    ? formatPrice(product.price)
                    : "Precio por definir"
                }

            </div>


            <div class="quantity-selector">

                <button
                    type="button"
                    class="quantity-minus"
                >
                    −
                </button>


                <span class="quantity-value">
                    1
                </span>


                <button
                    type="button"
                    class="quantity-plus"
                >
                    +
                </button>

            </div>


            <button
                type="button"
                class="add-cart-button"
            >

                <i class="fa-solid fa-bag-shopping"></i>

                Agregar al carrito

            </button>

        </div>

    `;


    /* =====================================
       CANTIDAD
    ====================================== */

    let quantity = 1;


    const quantityValue =
        article.querySelector(
            ".quantity-value"
        );


    const minusButton =
        article.querySelector(
            ".quantity-minus"
        );


    const plusButton =
        article.querySelector(
            ".quantity-plus"
        );


    minusButton.addEventListener(
        "click",
        () => {

            if (quantity > 1) {

                quantity--;

                quantityValue.textContent =
                    quantity;

            }

        }
    );


    plusButton.addEventListener(
        "click",
        () => {

            quantity++;

            quantityValue.textContent =
                quantity;

        }
    );


    /* =====================================
       AGREGAR AL CARRITO
    ====================================== */

    const addButton =
        article.querySelector(
            ".add-cart-button"
        );


    addButton.addEventListener(
        "click",
        () => {

            addToCart(
                product.id,
                quantity
            );

        }
    );


    return article;

}


/* =========================================
   MOSTRAR PRODUCTOS
========================================= */

function renderProducts() {

    if (!productsGrid) return;


    PRODUCTS.forEach(
        (product, index) => {

            const card =
                createProductCard(
                    product,
                    index
                );


            productsGrid.appendChild(card);

        }
    );

}


/* =========================================
   INICIALIZAR
========================================= */

renderProducts();

updateCartCount();