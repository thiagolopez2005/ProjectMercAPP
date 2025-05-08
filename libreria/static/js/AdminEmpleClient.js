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
    const regresarAdmin = document.getElementById('regresarAdmin');
    const regresarClient = document.getElementById('regresarClient');
    const regresarForgot = document.getElementById('regresarForgot');
    const imagenDiv = document.getElementById('imagen');

    // Establecer la imagen de fondo inicial
    imagenDiv.style.backgroundImage = "url('/static/images/Clientes.jpeg')";
    
    let currentForm = 'Client'; // Cambiado a Client como formulario inicial

    // Función para limpiar clases de animación
    function resetAnimationClasses(element) {
        element.classList.remove('slide-out-left', 'slide-in-right', 'slide-out-right', 'slide-in-left', 'hidden');
    }

    // Función general para cambiar formularios
    function switchForm(fromForm, toForm, animationOut, animationIn, toImage) {
        // Verificar que la imagen existe (puedes usar una imagen por defecto si falla)
        const img = new Image();
        img.onload = function() {
            imagenDiv.style.backgroundImage = `url('${toImage}')`;
        };
        img.onerror = function() {
            console.error(`Error al cargar la imagen: ${toImage}`);
            // Usar una imagen de respaldo o dejarlo en blanco
            imagenDiv.style.backgroundColor = "#f5f5f5";
        };
        img.src = toImage;

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
            switchForm(ClientForm, adminForm, 'slide-out-right', 'slide-in-left', '/static/images/Recolectores.jpeg');
            switchToAdminBtn.style.display = 'none';
            switchToClientBtn.style.display = 'block';
            currentForm = 'admin';
            if (forgotForm) forgotForm.classList.add('hidden'); // Verificar que el elemento existe
        }
    });

    // Cambiar de Administrador a Cliente
    switchToClientBtn.addEventListener('click', function () {
        if (currentForm !== 'Client') {
            switchForm(adminForm, ClientForm, 'slide-out-left', 'slide-in-right', '/static/images/Clientes.jpeg');
            switchToClientBtn.style.display = 'none';
            switchToAdminBtn.style.display = 'block';
            currentForm = 'Client';
            if (forgotForm) forgotForm.classList.add('hidden'); // Verificar que el elemento existe
        }
    });

    // Enlaces a recuperación de contraseña - Usar event delegation ya que los elementos podrían no existir
    document.addEventListener('click', function(e) {
        // Si el clic fue en un enlace de recuperación
        if (e.target.href && e.target.href.includes('recu_contra')) {
            e.preventDefault();
            if (forgotForm) {
                const fromForm = currentForm === 'admin' ? adminForm : ClientForm;
                switchForm(fromForm, forgotForm, 'slide-out-left', 'slide-in-right', 
                    currentForm === 'admin' ? '/static/images/Recolectores.jpeg' : '/static/images/Clientes.jpeg');
                currentForm = 'forgot';
            }
        }
    });

    // Volver desde formulario de recuperación
    if (regresarForgot) {
        regresarForgot.addEventListener('click', function () {
            if (forgotForm) {
                const targetForm = currentForm === 'admin' ? adminForm : ClientForm;
                const animationOut = 'slide-out-right';
                const animationIn = 'slide-in-left';
                const toImage = currentForm === 'admin' ? '/static/images/Recolectores.jpeg' : '/static/images/Clientes.jpeg';
                
                switchForm(forgotForm, targetForm, animationOut, animationIn, toImage);
                currentForm = currentForm === 'admin' ? 'admin' : 'Client';
            }
        });
    }

    // Mostrar el formulario de cliente inicialmente y ocultar el de admin
    if (switchToAdminBtn && switchToClientBtn && adminForm && ClientForm) {
        switchToAdminBtn.style.display = "block";
        switchToClientBtn.style.display = "none";
        
        // Inicialización correcta de la posición de los formularios
        adminForm.style.transform = 'translateX(100%)';
        ClientForm.style.transform = 'translateX(0)';
        
        // Verificar imágenes
        const checkImage = (url) => {
            const img = new Image();
            img.src = url;
            img.onerror = () => console.error(`No se pudo cargar la imagen: ${url}`);
        };
        
        checkImage('/static/images/Clientes.jpeg');
        checkImage('/static/images/Recolectores.jpeg');
    }
});