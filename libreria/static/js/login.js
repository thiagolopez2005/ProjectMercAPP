document.addEventListener('DOMContentLoaded', function() {
    const switchToUserBtn = document.getElementById('switchToUser');
    const switchToAdminBtn = document.getElementById('switchToAdmin');
    const adminForm = document.getElementById('adminForm');
    const userForm = document.getElementById('userForm');
    const forgotForm = document.getElementById('forgotForm');
    const forgotLinkAdmin = document.getElementById('forgotLinkAdmin');
    const forgotLinkUser = document.getElementById('forgotLinkUser');
    const regresarForgot = document.getElementById('regresarForgot');
    const imagenDiv = document.getElementById('imagen');

    // Variables para las rutas de las imágenes (generadas por Django en la plantilla)
    const agricultorImage = "{% static 'images/Agricultor.jpeg' %}";
    const usuarioImage = "{% static 'images/Usuario.jpeg' %}";

    // Función para mostrar un formulario y ocultar los demás
    function showForm(formToShow, imagePath) {
        adminForm.style.display = 'none';
        userForm.style.display = 'none';
        forgotForm.style.display = 'none';
        formToShow.style.display = 'block';
        imagenDiv.style.backgroundImage = `url('${imagePath}')`;
    }

    // Mostrar el formulario de administrador inicialmente
    showForm(adminForm, agricultorImage);

    // Ocultar el botón de admin inicialmente
    switchToAdminBtn.style.display = "none";

    // Cambiar de Administrador a Usuario
    switchToUserBtn.addEventListener('click', function() {
        showForm(userForm, usuarioImage);
        switchToUserBtn.style.display = 'none';
        switchToAdminBtn.style.display = 'block';
    });

    // Cambiar de Usuario a Administrador
    switchToAdminBtn.addEventListener('click', function() {
        showForm(adminForm, agricultorImage);
        switchToAdminBtn.style.display = 'none';
        switchToUserBtn.style.display = 'block';
    });

    // Ir a formulario de recuperación desde admin
    forgotLinkAdmin.addEventListener('click', function() {
        showForm(forgotForm, agricultorImage);
    });

    forgotLinkUser.addEventListener('click', function() {
        showForm(forgotForm, usuarioImage);
    });

    regresarForgot.addEventListener('click', function() {
        if (switchToUserBtn.style.display === 'block') {
            showForm(adminForm, agricultorImage);
        } else {
            showForm(userForm, usuarioImage);
        }
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

// Función para establecer una cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Función para obtener una cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Función para borrar una cookie
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Ejemplo de uso para mantener una sesión de usuario
function checkSession() {
    const username = getCookie('username');
    if (username) {
        // El usuario tiene una sesión activa
        console.log('Sesión activa para:', username);
        // Aquí puedes realizar acciones adicionales, como mostrar contenido personalizado
    } else {
        // El usuario no tiene una sesión activa
        console.log('No hay sesión activa.');
        // Aquí puedes redirigir al usuario a la página de inicio de sesión
    }
}

// Ejemplo de inicio de sesión
function login(username, password) {
    // Aquí debes validar el nombre de usuario y la contraseña con tu servidor
    if (username === 'usuario' && password === 'contraseña') {
        // Inicio de sesión exitoso
        setCookie('username', username, 7); // La sesión dura 7 días
        console.log('Inicio de sesión exitoso.');
        checkSession(); // Verifica la sesión después del inicio de sesión
    } else {
        // Inicio de sesión fallido
        console.log('Nombre de usuario o contraseña incorrectos.');
    }
}

// Ejemplo de cierre de sesión
function logout() {
    eraseCookie('username');
    console.log('Sesión cerrada.');
    checkSession(); // Verifica la sesión después del cierre de sesión
}

// Llama a checkSession() al cargar la página para verificar la sesión
checkSession();