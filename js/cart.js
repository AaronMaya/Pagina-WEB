/* =========================================
   CARRITO - AITHANA'S INSTANTS
========================================= */

/* =========================================
   CONFIGURACIÓN DE ENTREGA
========================================= */

const DELIVERY_RATE_PER_KM = 15;

const DELIVERY_BASE_COST = 50;

/* =========================================
   OBTENER CARRITO
========================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("aithanaCart")
    ) || [];

}
/* =========================================
   CALCULAR COSTO DE ENTREGA
========================================= */

function calculateDeliveryCost(distance) {

    if (!distance || distance <= 0) {

        return 0;

    }


    return (
        DELIVERY_RATE_PER_KM * distance
    ) + DELIVERY_BASE_COST;

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


    const deliveryMethod =
        document.querySelector(
            'input[name="delivery-method"]:checked'
        )?.value || "delivery";


    let deliveryCost = 0;


    if (
        deliveryMethod === "delivery"
    ) {

        const storedDistance =
            parseFloat(
                localStorage.getItem(
                    "aithanaDeliveryDistance"
                )
            );


        if (
            !isNaN(storedDistance)
        ) {

            deliveryCost =
                calculateDeliveryCost(
                    storedDistance
                );

        }

    }


    const total =
        subtotal +
        deliveryCost;


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
            formatPrice(total);

    }

}
/* =========================================
   MÉTODO DE ENTREGA
========================================= */

function setupDeliveryMethod() {

    const options =
        document.querySelectorAll(
            'input[name="delivery-method"]'
        );


    const deliveryFields =
        document.getElementById(
            "delivery-fields"
        );


    const pickupMessage =
        document.getElementById(
            "pickup-message"
        );


    options.forEach(option => {

        option.addEventListener(
            "change",
            () => {

                if (
                    option.value === "delivery" &&
                    option.checked
                ) {

                    deliveryFields.style.display =
                        "block";

                    pickupMessage.style.display =
                        "none";

                }


                if (
                    option.value === "pickup" &&
                    option.checked
                ) {

                    deliveryFields.style.display =
                        "none";

                    pickupMessage.style.display =
                        "flex";


                    localStorage.removeItem(
                        "aithanaDeliveryDistance"
                    );

                }


                updateSummary();

            }
        );

    });

}

/* =========================================
   MOSTRAR ESTIMACIÓN
========================================= */

function updateDeliveryEstimate(distance) {

    const distanceElement =
        document.getElementById(
            "delivery-distance"
        );


    const costElement =
        document.getElementById(
            "delivery-cost"
        );


    if (
        !distance ||
        distance <= 0
    ) {

        if (distanceElement) {

            distanceElement.textContent =
                "—";

        }


        if (costElement) {

            costElement.textContent =
                "—";

        }

        return;

    }


    const cost =
        calculateDeliveryCost(
            distance
        );


    if (distanceElement) {

        distanceElement.textContent =
            `${distance.toFixed(1)} km`;

    }


    if (costElement) {

        costElement.textContent =
            formatPrice(cost);

    }


    localStorage.setItem(
        "aithanaDeliveryDistance",
        distance
    );


    updateSummary();

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

/**
 * Configura el botón de checkout para generar y abrir un mensaje de WhatsApp
 * con todos los detalles del pedido.
 */
function setupCheckoutButton() {
    const checkoutButton = document.getElementById('checkout-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            // Tu número de teléfono de WhatsApp (con código de país, sin + ni espacios)
            const phoneNumber = '5215579788638'; // ¡IMPORTANTE! CAMBIA ESTE NÚMERO POR EL TUYO

            // Construir el mensaje del pedido
            const message = buildWhatsAppMessage();

            // Crear el enlace de WhatsApp
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

            // Abrir el enlace en una nueva pestaña
            window.open(whatsappUrl, '_blank');
        });
    }
}

/**
 * Construye el string del mensaje de WhatsApp con todos los detalles del pedido.
 * @returns {string} El mensaje formateado.
 */
function buildWhatsAppMessage() {
    // Obtener datos del carrito
    const cart = getCart();
const cartSubtotal = parseFloat(
    document.getElementById('cart-subtotal').textContent
        .replace(/[^0-9.-]+/g, '')
);

const cartTotal = parseFloat(
    document.getElementById('cart-total').textContent
        .replace(/[^0-9.-]+/g, '')
);

    // Obtener método de entrega
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked')?.value || 'delivery';

    // Obtener fecha y hora
    const deliveryDate = document.getElementById('delivery-date')?.value || 'No especificada';
    const deliveryTime = document.getElementById('delivery-time')?.value || 'No especificado';
    const orderNotes = document.getElementById('order-notes')?.value || 'Ninguna';

    let message = `¡Hola! Me gustaría realizar el siguiente pedido:\n\n`;
    message += `*--- MI PEDIDO ---*\n`;

    // Añadir productos
    cart.forEach(item => {
        message += `🔹 ${item.quantity}x ${item.name} - $${item.price.toFixed(2)} MXN c/u\n`;
    });

    message += `\n*--- RESUMEN DE COSTOS ---*\n`;
    message += `💰 Costo de los productos: $${cartSubtotal.toFixed(2)} MXN\n`;

    if (deliveryMethod === 'delivery') {
        // Lógica para ENTREGA A DOMICILIO
        const deliveryCost = cartTotal - cartSubtotal;
        message += `🛵 Costo de entrega: $${deliveryCost.toFixed(2)} MXN\n`;
        message += `📍 *TOTAL A PAGAR: $${cartTotal.toFixed(2)} MXN*\n\n`;

        message += `*--- DETALLES DE ENTREGA ---*\n`;
        const deliveryAddress = document.getElementById('delivery-address')?.value || 'No especificada';
        message += `📫 Dirección: ${deliveryAddress}\n`;
        
        const distanceElement = document.getElementById('delivery-distance');
        if (distanceElement && distanceElement.textContent !== '—' && distanceElement.textContent !== 'Error') {
            message += `📏 Distancia estimada: ${distanceElement.textContent}\n`;
        }

    } else {
        // Lógica para RECOGER EN NEGOCIO
        message += `🏠 Recoger en tienda (Sin costo de entrega)\n`;
        message += `📍 *TOTAL A PAGAR: $${cartTotal.toFixed(2)} MXN*\n\n`;

        message += `*--- DETALLES DE RECOGIDA ---*\n`;
        message += `📍 Se recogerá en el negocio.\n`;
    }

    message += `\n*--- FECHA Y HORA ---*\n`;
    message += `🗓️ Fecha: ${deliveryDate}\n`;
    message += `⏰ Horario: ${deliveryTime}\n\n`;

    message += `*--- NOTAS ADICIONALES ---*\n`;
    message += `📝 ${orderNotes}\n\n`;

    message += `¡Gracias!`;

    return message;
}


/* =========================================
   CÁLCULO DE ENTREGA CON OPENSTREETMAP (NUEVO)
========================================= */

// Coordenadas fijas de tu negocio/origen. ¡Cámbialas por las tuyas!
const BUSINESS_COORDS = {
    lat: 19.38961440581654, // Reemplaza esto con tu latitud
    lon:  -99.12270388650907  // Reemplaza esto con tu longitud
};

/**
 * Obtiene las coordenadas (lat, lng) de una dirección usando la API de Nominatim (OSM).
 * @param {string} address - La dirección a geocodificar.
 * @returns {Promise<{lat: number, lon: number}>}
 */
async function geocodeAddress(address) {
    const query = encodeURIComponent(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener la ubicación');
        }
        const data = await response.json();
        if (data && data.length > 0) {
            // Devolvemos la primera coincidencia
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
        return null; // No se encontró la dirección
    } catch (error) {
        console.error("Error en geocodeAddress:", error);
        return null;
    }
}

/**
 * Calcula la distancia en carretera entre dos puntos usando la API de OSRM (OSM).
 * @param {{lat: number, lon: number}} origin - Coordenadas de origen.
 * @param {{lat: number, lon: number}} destination - Coordenadas de destino.
 * @returns {Promise<number|null>} - Distancia en kilómetros o null si hay error.
 */
async function getDrivingDistance(origin, destination) {
    // Formato de coordenadas para OSRM: lon,lat
    const coordinates = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al calcular la ruta');
        }
        const data = await response.json();
        if (data && data.routes && data.routes.length > 0) {
            // La distancia viene en metros, la convertimos a kilómetros
            const distanceInMeters = data.routes[0].distance;
            return distanceInMeters / 1000;
        }
        return null;
    } catch (error) {
        console.error("Error en getDrivingDistance:", error);
        return null;
    }
}

/**
 * Función principal que orquesta todo el proceso.
 * 1. Geocodifica la dirección del cliente.
 * 2. Calcula la distancia en carretera usando las coordenadas fijas del negocio.
 * 3. Actualiza la UI con el resultado.
 * @param {string} clientAddress - La dirección que el usuario escribió.
 */
async function calculateAndDisplayDeliveryCost(clientAddress) {
    if (!clientAddress) {
        updateDeliveryEstimate(0); // Limpia la estimación si no hay dirección
        return;
    }

    // Mostrar un indicador de "cargando..." en la UI
    const distanceElement = document.getElementById("delivery-distance");
    const costElement = document.getElementById("delivery-cost");
    if (distanceElement) distanceElement.textContent = "Calculando...";
    if (costElement) costElement.textContent = "...";

    try {
        // 1. Obtener coordenadas del cliente
        const clientCoords = await geocodeAddress(clientAddress);
        if (!clientCoords) {
            throw new Error("No se pudo encontrar la dirección del cliente.");
        }

        // 2. Calcular la distancia de manejo (usando las coordenadas fijas del negocio)
        const distance = await getDrivingDistance(BUSINESS_COORDS, clientCoords);

        if (distance === null) {
            throw new Error("No se pudo calcular la ruta.");
        }

        // 3. Actualizar la UI con la distancia y el costo
        updateDeliveryEstimate(distance);

    } catch (error) {
        console.error("Error en el cálculo de entrega:", error);
        // Mostrar un mensaje de error al usuario
        if (distanceElement) distanceElement.textContent = "Error";
        if (costElement) costElement.textContent = "No disponible";
    }
}

// Reemplazamos la función vacía que tenías con la nueva lógica
function calculateDistanceWithGoogleMaps(address) {
    // Aunque el nombre dice "GoogleMaps", ahora usará OSM.
    // Puedes renombrar la función si quieres, pero no es necesario.
    console.log("Calculando distancia con OpenStreetMap para:", address);
    calculateAndDisplayDeliveryCost(address);
}

/* =========================================
   CONFIGURACIÓN DEL AUTOCOMPLETADO (NUEVO)
========================================= */

/**
 * Configura el campo de dirección para que use la API de Nominatim
 * y mostrar sugerencias al usuario.
 */
function setupAddressAutocomplete() {
    const addressInput = document.getElementById('delivery-address'); // Asegúrate de que tu input tenga este ID
    if (!addressInput) return;

    let debounceTimer;

    addressInput.addEventListener('input', (e) => {
        const query = e.target.value;
        if (query.length < 3) {
            // No buscar si la consulta es muy corta
            hideSuggestions();
            return;
        }

        // Debounce: esperar a que el usuario deje de escribir
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchSuggestions(query);
        }, 300);
    });

    // Ocultar sugerencias si el usuario hace clic fuera
    document.addEventListener('click', (e) => {
        if (!addressInput.contains(e.target)) {
            hideSuggestions();
        }
    });
}

/**
 * Busca sugerencias de direcciones usando la API de Nominatim.
 * @param {string} query - El texto de búsqueda.
 */
async function fetchSuggestions(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Error en la búsqueda');
        const suggestions = await response.json();
        displaySuggestions(suggestions);
    } catch (error) {
        console.error("Error al obtener sugerencias:", error);
    }
}

/**
 * Muestra las sugerencias en una lista desplegable.
 * @param {Array} suggestions - Array de resultados de la API.
 */
function displaySuggestions(suggestions) {
    // Crear el contenedor de sugerencias si no existe
    let suggestionsContainer = document.getElementById('suggestions-container');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'suggestions-container';
        // Posicionar el contenedor debajo del input
        const addressInput = document.getElementById('delivery-address');
        addressInput.parentNode.style.position = 'relative';
        addressInput.parentNode.appendChild(suggestionsContainer);
    }

    suggestionsContainer.innerHTML = '';
    if (suggestions.length === 0) {
        hideSuggestions();
        return;
    }

    suggestions.forEach(suggestion => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        // Formatear la dirección para que sea más legible
        item.textContent = `${suggestion.display_name}`;

        item.addEventListener('click', () => {
            // Cuando el usuario selecciona una opción:
            document.getElementById('delivery-address').value = item.textContent;
            hideSuggestions();
            // Disparamos el cálculo de la distancia
            calculateAndDisplayDeliveryCost(item.textContent);
        });

        suggestionsContainer.appendChild(item);
    });
}

/**
 * Oculta la lista de sugerencias.
 */
function hideSuggestions() {
    const suggestionsContainer = document.getElementById('suggestions-container');
    if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
    }
}

/* =========================================
   LIMPIAR DATOS DE ENTREGA ANTERIORES
========================================= */

function resetDeliveryData() {

    localStorage.removeItem("aithanaDeliveryDistance");

    const distanceElement =
        document.getElementById("delivery-distance");

    const costElement =
        document.getElementById("delivery-cost");

    if (distanceElement) {
        distanceElement.textContent = "—";
    }

    if (costElement) {
        costElement.textContent = "—";
    }

}
/* =========================================
   INICIALIZAR
========================================= */

resetDeliveryData();

renderCart();
setMinimumDate();
setupCheckoutButton();
setupAddressAutocomplete();
setupDeliveryMethod();