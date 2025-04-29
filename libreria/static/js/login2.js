document.addEventListener('DOMContentLoaded', function() {
    const imagenDiv = document.getElementById('imagen');
    const switchToUserBtn = document.getElementById('switchToUser');
    const switchToAdminBtn = document.getElementById('switchToAdmin');
    const adminForm = document.getElementById('adminForm');
    const userForm = document.getElementById('userForm');
    const forgotForm = document.getElementById('forgotForm');
    const forgotLinkAdmin = document.getElementById('forgotLinkAdmin');
    const forgotLinkUser = document.getElementById('forgotLinkUser');
    const regresarForgot = document.getElementById('regresarForgot');
    let currentForm = 'admin';

    // Variables para las rutas de las imágenes (generadas por Django en la plantilla)
    const agricultorImage = "{% static 'Imagenes/Agricultor.jpeg' %}";
    const usuarioImage = "{% static 'Imagenes/Usuario.jpeg' %}";

    // Ocultar el botón de admin inicialmente
    switchToAdminBtn.style.display = "none";

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
            toForm.classList.add(animationIn, 'block');
        }, 500);
    }

    // Función para mostrar un formulario y ocultar los demás
    function showForm(formToShow, imagePath) {
        adminForm.style.display = 'none';
        userForm.style.display = 'none';
        forgotForm.style.display = 'none';
        formToShow.style.display = 'block';
        imagenDiv.style.backgroundImage = `url('${imagePath}')`;
    }

    // Cambiar de Administrador a Usuario
    switchToUserBtn.addEventListener('click', function() {
        if (currentForm !== 'user') {
            switchForm(adminForm, userForm, 'slide-out-left', 'slide-in-right', usuarioImage);
            switchToUserBtn.style.display = 'none';
            switchToAdminBtn.style.display = 'block';
            currentForm = 'user';
        }
    });

    // Cambiar de Usuario a Administrador
    switchToAdminBtn.addEventListener('click', function() {
        if (currentForm !== 'admin') {
            switchForm(userForm, adminForm, 'slide-out-right', 'slide-in-left', agricultorImage);
            switchToAdminBtn.style.display = 'none';
            switchToUserBtn.style.display = 'block';
            currentForm = 'admin';
        }
    });

    // Ir a formulario de recuperación desde admin
    forgotLinkAdmin.addEventListener('click', function() {
        switchForm(adminForm, forgotForm, 'slide-out-left', 'slide-in-right', currentForm === 'admin' ? agricultorImage : usuarioImage);
        currentForm = 'forgot';
    });

    // Ir a formulario de recuperación desde usuario
    forgotLinkUser.addEventListener('click', function() {
        switchForm(userForm, forgotForm, 'slide-out-left', 'slide-in-right', currentForm === 'admin' ? agricultorImage : usuarioImage);
        currentForm = 'forgot';
    });

    // Volver desde formulario de recuperación
    regresarForgot.addEventListener('click', function() {
        const targetForm = switchToUserBtn.style.display === 'block' ? adminForm : userForm;
        const toImage = switchToUserBtn.style.display === 'block' ? agricultorImage : usuarioImage;
        switchForm(forgotForm, targetForm, 'slide-out-right', 'slide-in-left', toImage);
        currentForm = switchToUserBtn.style.display === 'block' ? 'admin' : 'user';
    });

    // Eventos de envío de formularios
    document.getElementById('loginFormUser').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario de usuario enviado');
        alert('Formulario de usuario enviado con éxito.');
    });

    document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario de recuperación enviado');
        alert('Se ha enviado un correo con las instrucciones para recuperar tu contraseña.');
        regresarForgot.click();
    });

    // Agrega listeners para los formularios de admin y user para enviar el tipo de formulario
    const loginFormAdmin = document.getElementById('loginFormAdmin');
    loginFormAdmin.addEventListener('submit', function(event) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'form_type';
        input.value = 'admin';
        loginFormAdmin.appendChild(input);
    });

    const loginFormUser = document.getElementById('loginFormUser');
    loginFormUser.addEventListener('submit', function(event) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'form_type';
        input.value = 'user';
        loginFormUser.appendChild(input);
    });

    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    forgotPasswordForm.addEventListener('submit', function(event) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'form_type';
        input.value = 'forgot';
        forgotPasswordForm.appendChild(input);
    });
});