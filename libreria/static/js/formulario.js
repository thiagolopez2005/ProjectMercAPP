document.addEventListener("DOMContentLoaded", function () {
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
  
    // Configurar los botones para mostrar/ocultar contraseña
    setupPasswordToggle('contraseña', 'togglePassword');
    setupPasswordToggle('confirmarcontraseña', 'toggleConfirmPassword');
  });
  
  // Función para configurar los botones de mostrar/ocultar contraseña
  function setupPasswordToggle(passwordInputId, toggleIconId) {
    const passwordInput = document.getElementById(passwordInputId);
    const toggleIcon = document.getElementById(toggleIconId);
    
    if (passwordInput && toggleIcon) {
        toggleIcon.addEventListener('click', function() {
            // Cambiar el tipo de input entre "password" y "text"
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
                toggleIcon.title = 'Ocultar contraseña';
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
                toggleIcon.title = 'Mostrar contraseña';
            }
        });
    }
  }
  
  /*
  window.addEventListener("beforeunload", function () {
  document.body.classList.remove("loaded"); // Muestra el loader al cambiar de página
  });
  */
  
  // Validación general al presionar el botón "Regístrate"
  document.getElementById('registrate').addEventListener('click', function(event) {
    let valid = true;
  
    // Validar "Nombres"
    const nombres = document.getElementById('nombres');
    if (nombres.value.trim() === '') {
      nombres.setCustomValidity('Rellene este campo.');
      nombres.reportValidity();
      nombres.focus();
      valid = false;
    } else {
      nombres.setCustomValidity('');
    }
  
    // Validar "Apellidos"
    const apellidos = document.getElementById('apellidos');
    if (apellidos.value.trim() === '') {
      apellidos.setCustomValidity('Rellene este campo.');
      apellidos.reportValidity();
      if (valid) apellidos.focus();
      valid = false;
    } else {
      apellidos.setCustomValidity('');
    }
  
    // Validar "Cargo"
    const cargo = document.querySelector('[name="cargo"]');
    if (cargo.value === 'Seleccion') {
      alert('Por favor, seleccione un cargo válido.');
      cargo.focus();
      valid = false;
    }
  
    // Validar "Correo Electrónico"
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      email.setCustomValidity('Por favor, ingrese un correo electrónico válido.');
      email.reportValidity();
      if (valid) email.focus();
      valid = false;
    } else {
      email.setCustomValidity('');
    }
  
    // Validar "Contraseña"
    const contraseña = document.getElementById('contraseña');
    const confirmarContraseña = document.getElementById('confirmarcontraseña');
    const contraseñaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!contraseñaRegex.test(contraseña.value)) {
      contraseña.setCustomValidity('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número.');
      contraseña.reportValidity();
      if (valid) contraseña.focus();
      valid = false;
    } else {
      contraseña.setCustomValidity('');
    }
  
  
    // Validar coincidencia de contraseñas (ahora integrado)
    if (contraseña.value === "" || confirmarContraseña.value === "") {
      alert("Los campos de contraseña no pueden estar vacíos. Por favor, completa ambos.");
      if (valid) contraseña.focus();
      valid = false;
    } else if (contraseña.value !== confirmarContraseña.value) {
      confirmarContraseña.setCustomValidity('Las contraseñas no coinciden. Por favor, revisa.');
      confirmarContraseña.reportValidity();
      if (valid) confirmarContraseña.focus();
      valid = false;
    } else {
      confirmarContraseña.setCustomValidity('');
    }
  
  
    // Validar "Términos y Condiciones"
    const checkbox = document.getElementById('terminosCheckbox');
    if (!checkbox.checked) {
      checkbox.setCustomValidity('Debes aceptar los términos y condiciones.');
      checkbox.reportValidity();
      if (valid) checkbox.focus();
      valid = false;
    } else {
      checkbox.setCustomValidity('');
    }
  
    // Prevenir el envío si alguna validación falla
    if (!valid) {
      event.preventDefault();
    } else {
      alert('¡Formulario enviado correctamente!');
    }
  });