/* =========================================
   CARRITO - AITHANA'S INSTANTS
========================================= */


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
   FORMATO DE PRECIO
========================================= */

function formatPrice(price) {

    return new Intl.NumberFormat(
        "es-MX",
        {
            style: "currency",
            currency: "MXN"
        }
    ).format(price);

}


/* =========================================
   MOSTRAR CARRITO
========================================= */

function renderCart() {

    const container =
        document.getElementById(
            "cart-items"
        );


    if (!container) return;


    const cart = getCart();


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-bag-shopping"></i>

                <h2>
                    Tu carrito está vacío
                </h2>

                <p>
                    Descubre nuestras experiencias
                    y encuentra algo especial.
                </p>

                <a href="tablas.html">
                    Explorar tablas
                </a>

            </div>

        `;

        updateSummary();

        return;

    }


    container.innerHTML = "";


    cart.forEach(item => {

        const article =
            document.createElement("article");


        article.className =
            "cart-item";


        article.innerHTML = `

            <div class="cart-item-image">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

            </div>


            <div class="cart-item-info">

                <h3>
                    ${item.name}
                </h3>


                <span class="cart-item-price">

                    ${
                        item.price > 0
                        ? formatPrice(item.price)
                        : "Precio por definir"
                    }

                </span>


                <div class="cart-item-quantity">

                    <button
                        type="button"
                        class="cart-minus"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantity}
                    </span>


                    <button
                        type="button"
                        class="cart-plus"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="remove-item"
                >

                    Eliminar

                </button>

            </div>


            <div class="cart-item-total">

                ${
                    item.price > 0
                    ? formatPrice(
                        item.price *
                        item.quantity
                    )
                    : "Por definir"
                }

            </div>

        `;


        /* =================================
           MENOS
        ================================== */

        article
            .querySelector(".cart-minus")
            .addEventListener(
                "click",
                () => {

                    if (
                        item.quantity > 1
                    ) {

                        item.quantity--;

                    } else {

                        item.quantity = 1;

                    }


                    saveCart(cart);

                    renderCart();

                }
            );


        /* =================================
           MÁS
        ================================== */

        article
            .querySelector(".cart-plus")
            .addEventListener(
                "click",
                () => {

                    item.quantity++;

                    saveCart(cart);

                    renderCart();

                }
            );


        /* =================================
           ELIMINAR
        ================================== */

        article
            .querySelector(".remove-item")
            .addEventListener(
                "click",
                () => {

                    const newCart =
                        cart.filter(
                            product =>
                                product.id !==
                                item.id
                        );


                    saveCart(newCart);

                    renderCart();

                }
            );


        container.appendChild(article);

    });


    updateSummary();

}


/* =========================================
   RESUMEN
========================================= */

function updateSummary() {

    const cart = getCart();


    const subtotal =
        cart.reduce(
            (total, item) => {

                return total +
                    (
                        item.price *
                        item.quantity
                    );

            },
            0
        );


    const subtotalElement =
        document.getElementById(
            "cart-subtotal"
        );


    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            formatPrice(subtotal);

    }


    if (totalElement) {

        totalElement.textContent =
            formatPrice(subtotal);

    }

}


/* =========================================
   FECHA MÍNIMA
========================================= */

function setMinimumDate() {

    const dateInput =
        document.getElementById(
            "delivery-date"
        );


    if (!dateInput) return;


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    dateInput.min =
        `${year}-${month}-${day}`;

}


/* =========================================
   CONTINUAR AL CHECKOUT
========================================= */

function setupCheckoutButton() {

    const button =
        document.getElementById(
            "checkout-button"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            const cart = getCart();


            if (cart.length === 0) {

                alert(
                    "Tu carrito está vacío."
                );

                return;

            }


            const date =
                document.getElementById(
                    "delivery-date"
                ).value;


            const time =
                document.getElementById(
                    "delivery-time"
                ).value;


            const notes =
                document.getElementById(
                    "order-notes"
                ).value;


            if (!date) {

                alert(
                    "Selecciona una fecha de entrega."
                );

                return;

            }


            if (!time) {

                alert(
                    "Selecciona un horario de entrega."
                );

                return;

            }


            const orderData = {

                date: date,

                time: time,

                notes: notes

            };


            localStorage.setItem(
                "aithanaOrderData",
                JSON.stringify(
                    orderData
                )
            );


            /*
             * Por ahora no tenemos checkout.
             * Lo conectaremos en la siguiente etapa.
             */

            window.location.href =
                "checkout.html";

        }
    );

}


/* =========================================
   INICIALIZAR
========================================= */

renderCart();

setMinimumDate();

setupCheckoutButton();