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
    const adminForm = document.getElementById('adminForm');
    const empleForm = document.getElementById('EmpleForm');
    const clienteForm = document.getElementById('ClienteForm');
    const forgotForm = document.getElementById('forgotForm');

    const switchToAdminBtn = document.getElementById('switchToAdmin');
    const switchToEmpleBtn = document.getElementById('switchToEmple');
    const switchToClienteBtn = document.getElementById('switchToCliente');
    const regresarForgotBtn = document.getElementById('regresarForgot');

    const forgotLinkAdmin = document.getElementById('forgotLinkAdmin');
    const forgotLinkEmple = document.getElementById('forgotLinkEmple');
    const forgotLinkCliente = document.getElementById('forgotLinkCliente');

    // Función para ocultar todos los formularios
    function hideAllForms() {
        adminForm.style.display = 'none';
        empleForm.style.display = 'none';
        clienteForm.style.display = 'none';
        forgotForm.style.display = 'none';
    }

    

    // Mostrar el formulario de Administrador
    switchToAdminBtn.addEventListener('click', () => {
        hideAllForms();
        adminForm.style.display = 'block';
    });

    // Mostrar el formulario de Empleado
    switchToEmpleBtn.addEventListener('click', () => {
        hideAllForms();
        empleForm.style.display = 'block';
    });

    // Mostrar el formulario de Cliente
    switchToClienteBtn.addEventListener('click', () => {
        hideAllForms();
        clienteForm.style.display = 'block';
    });

    // Mostrar el formulario de recuperación desde Administrador
    forgotLinkAdmin.addEventListener('click', () => {
        hideAllForms();
        forgotForm.style.display = 'block';
    });

    // Mostrar el formulario de recuperación desde Empleado
    forgotLinkEmple.addEventListener('click', () => {
        hideAllForms();
        forgotForm.style.display = 'block';
    });

    // Mostrar el formulario de recuperación desde Cliente
    forgotLinkCliente.addEventListener('click', () => {
        hideAllForms();
        forgotForm.style.display = 'block';
    });

    // Regresar al formulario principal desde Recuperación
    regresarForgotBtn.addEventListener('click', () => {
        hideAllForms();
        adminForm.style.display = 'block'; // Cambiar según el formulario principal predeterminado
    });

    // Eventos de envío de formularios (puedes personalizarlos según tus necesidades)
    document.getElementById('loginFormAdmin').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Formulario de Administrador enviado.');
    });

    document.getElementById('loginFormEmple').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Formulario de Empleado enviado.');
    });

    document.getElementById('loginFormCliente').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Formulario de Cliente enviado.');
    });

    document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Se ha enviado un enlace para recuperar la contraseña.');
    });
});
