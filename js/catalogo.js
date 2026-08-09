/* =========================================
   BOTONES DE WHATSAPP
========================================= */

const whatsappButtons =
    document.querySelectorAll('.whatsapp-button');


whatsappButtons.forEach(button => {

    button.addEventListener('click', () => {

        const message =
            button.dataset.message;

        openWhatsApp(message);

    });

});