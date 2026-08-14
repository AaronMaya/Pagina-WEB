/* =========================================
   CONFIGURACIÓN DE WHATSAPP
========================================= */

const WHATSAPP_NUMBER = '5215579788638';

/* =========================================
   WHATSAPP
========================================= */

function openWhatsApp(message) {

    const encodedMessage = encodeURIComponent(message);

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');

}

const whatsappButtons =
    document.querySelectorAll('.whatsapp-button');

whatsappButtons.forEach(button => {

    button.addEventListener('click', () => {

        const message =
            button.dataset.message;

        openWhatsApp(message);

    });

});

/* =========================================
   MENÚ MÓVIL
========================================= */

const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle.addEventListener('click', () => {

    navMenu.classList.toggle('active');

});