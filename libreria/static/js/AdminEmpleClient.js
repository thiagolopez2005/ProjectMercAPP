/*document.addEventListener("DOMContentLoaded", function () {
    console.log("Mostrando pantalla de loader...");

    // Asegúrate de que el loader se muestre inicialmente
    const loaderScreen = document.getElementById("loader-screen");
    const mainContent = document.getElementById("main-content");

    // Simula el tiempo de carga
    window.addEventListener("load", function () {
        setTimeout(() => {
            // Oculta el loader y muestra el contenido principal
            loaderScreen.style.display = "none";
            mainContent.style.display = "block";
            console.log("Transición completada: contenido principal visible.");
        }, 2000); // Ajusta el tiempo según lo que necesites
    });
});

  window.addEventListener("beforeunload", function () {
  document.body.classList.remove("loaded"); // Muestra el loader al cambiar de página
});
*/

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const switchToClientBtn = document.getElementById('switchToClient');
    const switchToAdminBtn = document.getElementById('switchToAdmin');
    const adminForm = document.getElementById('adminForm');
    const ClientForm = document.getElementById('ClientForm');
    const forgotForm = document.getElementById('forgotForm');
    const forgotLinkAdmin = document.getElementById('forgotLinkAdmin');
    const forgotLinkUser = document.getElementById('forgotLinkClient');
    const regresarForgot = document.getElementById('regresarForgot');
    const imagenDiv = document.getElementById('imagen');

    let currentForm = 'Client'; // Cambiado a Client como formulario inicial

    // Función para limpiar clases de animación
    function resetAnimationClasses(element) {
        element.classList.remove('slide-out-left', 'slide-in-right', 'slide-out-right', 'slide-in-left', 'hidden');
    }

    // Función general para cambiar formularios
    function switchForm(fromForm, toForm, animationOut, animationIn, toImage) {
        imagenDiv.style.backgroundImage = `url('${toImage}')`;

        resetAnimationClasses(fromForm);
        resetAnimationClasses(toForm);

        fromForm.classList.add(animationOut, 'hidden');

        setTimeout(() => {
            fromForm.style.transform = animationOut.includes('left') ? 'translateX(-100%)' : 'translateX(100%)';
            toForm.style.transform = 'translateX(0)';
            toForm.classList.add(animationIn);
            toForm.classList.remove('hidden');
        }, 500);
    }

    // Cambiar de Cliente a Administrador
    switchToAdminBtn.addEventListener('click', function () {
        if (currentForm !== 'admin') {
            switchForm(ClientForm, adminForm, 'slide-out-right', 'slide-in-left', 'static/images/Recolectores.jpeg'); // Ajusta la imagen
            switchToAdminBtn.style.display = 'none';
            switchToClientBtn.style.display = 'block';
            currentForm = 'admin';
            forgotForm.classList.add('hidden'); // Asegura que el formulario de recuperación se oculte
        }
    });

    // Cambiar de Administrador a Cliente
    switchToClientBtn.addEventListener('click', function () {
        if (currentForm !== 'Client') {
            switchForm(adminForm, ClientForm, 'slide-out-left', 'slide-in-right', 'static/images/Clientes.jpeg'); // Ajusta la imagen
            switchToClientBtn.style.display = 'none';
            switchToAdminBtn.style.display = 'block';
            currentForm = 'Client';
            forgotForm.classList.add('hidden'); // Asegura que el formulario de recuperación se oculte
        }
    });

    // Ir a formulario de recuperación desde admin
    forgotLinkAdmin.addEventListener('click', function () {
        switchForm(adminForm, forgotForm, 'slide-out-left', 'slide-in-right', currentForm === 'admin' ? 'static/images/Recolectores.jpeg' : 'static/images/Clientes.jpeg'); // Ajusta la imagen
        currentForm = 'forgot';
    });

    // Ir a formulario de recuperación desde Cliente
    forgotLinkUser.addEventListener('click', function () {
        switchForm(ClientForm, forgotForm, 'slide-out-left', 'slide-in-right', currentForm === 'admin' ? 'static/images/Recolectores.jpeg' : 'static/images/Clientes.jpeg'); // Ajusta la imagen
        currentForm = 'forgot';
    });

    // Volver desde formulario de recuperación
    regresarForgot.addEventListener('click', function () {
        const targetForm = switchToClientBtn.style.display === 'block' ? adminForm : ClientForm;
        const animationOut = 'slide-out-right';
        const animationIn = 'slide-in-left';
        const toImage = switchToClientBtn.style.display === 'block' ? 'static/images/Recolectores.jpeg' : 'static/images/Clientes.jpeg'; // Ajusta la imagen

        switchForm(forgotForm, targetForm, animationOut, animationIn, toImage);
        currentForm = switchToClientBtn.style.display === 'block' ? 'admin' : 'Client';
    });

    // Mostrar el formulario de cliente inicialmente y ocultar el de admin.
    switchToAdminBtn.style.display = "block";
    switchToClientBtn.style.display = "none";
    switchForm(adminForm, ClientForm, 'slide-out-left', 'slide-in-right', 'static/images/Clientes.jpeg'); // Ajusta la imagen
});