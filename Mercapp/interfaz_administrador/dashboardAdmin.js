// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para el menú responsive
    const menuItems = document.querySelectorAll('.menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Solo prevenir el comportamiento por defecto si no es un enlace real
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Remover clase active de todos los items
            menuItems.forEach(i => i.classList.remove('active'));
            // Agregar clase active al item clickeado
            this.classList.add('active');
        });
    });

    // Funcionalidad para las notificaciones
    const notificationIcon = document.querySelector('.user-menu i:first-child');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            alert('No tienes notificaciones nuevas');
        });
    }

    // Funcionalidad para el botón de cerrar sesión
    const logoutIcon = document.querySelector('.user-menu i:nth-child(2)');
    if (logoutIcon) {
        logoutIcon.addEventListener('click', function() {
            if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
                // Aquí iría la lógica de cierre de sesión
                window.location.href = '/login';
            }
        });
    }

    // Animación para los tiles
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        tile.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Función para actualizar los contadores en tiempo real (simulado)
    function updateCounters() {
        const counters = {
            'Productos': Math.floor(Math.random() * 200) + 100,
            'Items en Inventario': Math.floor(Math.random() * 100) + 50,
            'Usuarios': Math.floor(Math.random() * 20) + 10,
            'Recibos': Math.floor(Math.random() * 50) + 30,
            'Compras Pendientes': Math.floor(Math.random() * 30) + 20
        };

        tiles.forEach(tile => {
            const label = tile.querySelector('p').textContent;
            const counter = tile.querySelector('h3');
            if (counters[label]) {
                counter.textContent = counters[label];
            }
        });
    }

    // Actualizar contadores cada 5 minutos (simulado)
    setInterval(updateCounters, 300000);

    // Función para manejar el responsive sidebar
    function handleResponsiveSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (window.innerWidth <= 768) {
            sidebar.style.width = '70px';
            mainContent.style.marginLeft = '70px';
        } else {
            sidebar.style.width = '250px';
            mainContent.style.marginLeft = '250px';
        }
    }

    // Escuchar cambios en el tamaño de la ventana
    window.addEventListener('resize', handleResponsiveSidebar);

    // Inicializar el estado responsive
    handleResponsiveSidebar();

    // Función para mostrar/ocultar elementos del menú en modo responsive
    function toggleMenuItems() {
        const menuTexts = document.querySelectorAll('.menu a span');
        const profileInfo = document.querySelector('.profile-info');
        
        if (window.innerWidth <= 768) {
            menuTexts.forEach(text => text.style.display = 'none');
            if (profileInfo) profileInfo.style.display = 'none';
        } else {
            menuTexts.forEach(text => text.style.display = 'inline');
            if (profileInfo) profileInfo.style.display = 'block';
        }
    }

    // Escuchar cambios en el tamaño de la ventana para el menú
    window.addEventListener('resize', toggleMenuItems);

    // Inicializar el estado del menú
    toggleMenuItems();

    // Marcar el ítem activo del menú según la URL actual
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPath) {
                item.classList.add('active');
            }
        });
    }

    // Inicializar el ítem activo
    setActiveMenuItem();

    // Funciones para el manejo de productos
    // Botones de la barra de herramientas
    const addButton = document.querySelector('.add-button');
    const editCatalogButton = document.querySelector('.edit-catalog-button');
    const addCatalogButton = document.querySelector('.add-catalog-button');
    
    // Modo de edición
    let isEditMode = false;

    // Función para manejar la carga de imágenes
    function handleImageUpload(card) {
        const imageInput = card.querySelector('.image-upload');
        const productImage = card.querySelector('.product-image');
        const uploadBtn = card.querySelector('.upload-btn');

        uploadBtn.addEventListener('click', () => {
            imageInput.click();
        });

        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    productImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Función para activar/desactivar modo de edición (actualizada)
    function toggleEditMode() {
        isEditMode = !isEditMode;
        const productCards = document.querySelectorAll('.product-card');
        const editCatalogButton = document.querySelector('.edit-catalog-button');

        productCards.forEach(card => {
            if (isEditMode) {
                // Hacer elementos editables
                const title = card.querySelector('.product-title');
                const description = card.querySelector('.product-description');
                const unit = card.querySelector('.product-unit');
                const price = card.querySelector('.product-price');

                title.contentEditable = true;
                description.contentEditable = true;
                unit.contentEditable = true;
                price.contentEditable = true;

                // Agregar botones de edición
                if (!card.querySelector('.edit-buttons')) {
                    const editButtons = document.createElement('div');
                    editButtons.className = 'edit-buttons';
                    editButtons.innerHTML = `
                        <button class="save-btn">Guardar</button>
                        <button class="delete-btn">Eliminar</button>
                    `;
                    card.appendChild(editButtons);

                    // Eventos para los botones
                    const saveBtn = editButtons.querySelector('.save-btn');
                    const deleteBtn = editButtons.querySelector('.delete-btn');

                    saveBtn.addEventListener('click', () => saveProductChanges(card));
                    deleteBtn.addEventListener('click', () => deleteProduct(card));
                }

                // Activar carga de imágenes
                handleImageUpload(card);

                card.classList.add('edit-mode');
                editCatalogButton.textContent = 'Guardar Cambios';
            } else {
                // Desactivar edición
                const editableElements = card.querySelectorAll('[contenteditable]');
                editableElements.forEach(el => el.contentEditable = false);

                // Remover botones de edición
                const editButtons = card.querySelector('.edit-buttons');
                if (editButtons) {
                    editButtons.remove();
                }

                card.classList.remove('edit-mode');
                editCatalogButton.textContent = 'Editar Catálogo';
            }
        });
    }

    // Función para guardar cambios de un producto (actualizada)
    function saveProductChanges(card) {
        const title = card.querySelector('.product-title').textContent;
        const description = card.querySelector('.product-description').textContent;
        const unit = card.querySelector('.product-unit').textContent;
        const price = card.querySelector('.product-price').textContent;
        const image = card.querySelector('.product-image').src;

        // Aquí podrías agregar la lógica para guardar en una base de datos
        console.log('Producto actualizado:', { title, description, unit, price, image });
        alert('Cambios guardados con éxito');
    }

    // Función para eliminar un producto
    function deleteProduct(card) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            card.remove();
            alert('Producto eliminado con éxito');
        }
    }

    // Función para agregar un nuevo producto (actualizada)
    function addNewProduct() {
        const template = document.getElementById('product-template');
        const productsGrid = document.querySelector('.products-grid');
        
        // Clonar el template
        const newProductCard = template.content.cloneNode(true).querySelector('.product-card');
        
        // Insertar al principio del grid
        productsGrid.insertBefore(newProductCard, productsGrid.firstChild);
        
        // Activar modo de edición
        toggleEditMode();
        
        // Activar carga de imágenes para el nuevo producto
        handleImageUpload(newProductCard);
        
        // Scroll al nuevo producto
        newProductCard.scrollIntoView({ behavior: 'smooth' });
    }

    // Event Listeners
    if (addButton) {
        addButton.addEventListener('click', addNewProduct);
    }

    if (editCatalogButton) {
        editCatalogButton.addEventListener('click', toggleEditMode);
    }

    // Funcionalidad de los botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value) || 0;
            
            if (this.textContent === '+') {
                input.value = currentValue + 1;
            } else if (currentValue > 0) {
                input.value = currentValue - 1;
            }
        });
    });

    // Funcionalidad de búsqueda
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const title = product.querySelector('.product-title').textContent.toLowerCase();
                const description = product.querySelector('.product-description').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // Funciones para el manejo de usuarios
    // Obtener todos los menús desplegables de opciones
    const optionsDropdowns = document.querySelectorAll('.options-dropdown');

    optionsDropdowns.forEach(dropdown => {
        const editOption = dropdown.querySelector('.edit-option');
        const toggleOption = dropdown.querySelector('.toggle-option');
        const deleteOption = dropdown.querySelector('.delete-option');

        // Función para editar usuario
        if (editOption) {
            editOption.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                const userData = {
                    nombres: row.cells[0].textContent,
                    apellidos: row.cells[1].textContent,
                    correo: row.cells[2].textContent,
                    telefono: row.cells[3].textContent,
                    preguntaSeguridad: row.cells[4].textContent,
                    respuestaSeguridad: row.cells[5].textContent,
                    correoRecuperacion: row.cells[6].textContent,
                    estado: row.cells[7].textContent
                };
                mostrarModalEdicion(userData, row);
            });
        }

        // Función para activar/desactivar usuario
        if (toggleOption) {
            toggleOption.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                const estadoCell = row.cells[7];
                const nuevoEstado = estadoCell.textContent.trim() === 'Activo' ? 'No Activo' : 'Activo';
                
                if (confirm(`¿Estás seguro de cambiar el estado del usuario a ${nuevoEstado}?`)) {
                    estadoCell.textContent = nuevoEstado;
                    // Aquí se podría agregar una llamada a la API para actualizar el estado
                }
            });
        }

        // Función para eliminar usuario
        if (deleteOption) {
            deleteOption.addEventListener('click', function(e) {
                e.preventDefault();
                const row = this.closest('tr');
                if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
                    row.remove();
                    // Aquí se podría agregar una llamada a la API para eliminar el usuario
                }
            });
        }
    });

    // Manejo del menú desplegable
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.dropdown-content');
            
            // Cerrar todos los otros dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                if (content !== dropdown) {
                    content.style.display = 'none';
                }
            });
            
            // Toggle del dropdown actual
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Eventos para las opciones del menú
        const editOption = button.querySelector('.edit-option');
        const toggleOption = button.querySelector('.toggle-option');
        const deleteOption = button.querySelector('.delete-option');

        if (editOption) {
            editOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const row = this.closest('tr');
                const userData = {
                    nombres: row.cells[0].textContent,
                    apellidos: row.cells[1].textContent,
                    correo: row.cells[2].textContent,
                    telefono: row.cells[3].textContent,
                    preguntaSeguridad: row.cells[4].textContent,
                    respuestaSeguridad: row.cells[5].textContent,
                    correoRecuperacion: row.cells[6].textContent,
                    estado: row.cells[7].textContent
                };
                mostrarModalEdicion(userData, row);
            });
        }

        if (toggleOption) {
            toggleOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const row = this.closest('tr');
                const estadoCell = row.cells[7];
                const nuevoEstado = estadoCell.textContent.trim() === 'Activo' ? 'No Activo' : 'Activo';
                
                if (confirm(`¿Estás seguro de cambiar el estado del usuario a ${nuevoEstado}?`)) {
                    estadoCell.textContent = nuevoEstado;
                }
            });
        }

        if (deleteOption) {
            deleteOption.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const row = this.closest('tr');
                if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
                    row.remove();
                }
            });
        }
    });
    
    // Cerrar dropdowns al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.edit-btn')) {
            document.querySelectorAll('.dropdown-content').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });
});

// Función para mostrar el modal de edición
function mostrarModalEdicion(userData, row) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Editar Usuario</h2>
                <button class="close-btn">&times;</button>
            </div>
            <form id="editUserForm">
                <div class="form-group">
                    <label for="nombres">Nombres:</label>
                    <input type="text" id="nombres" value="${userData.nombres}" required>
                </div>
                <div class="form-group">
                    <label for="apellidos">Apellidos:</label>
                    <input type="text" id="apellidos" value="${userData.apellidos}" required>
                </div>
                <div class="form-group">
                    <label for="correo">Correo:</label>
                    <input type="email" id="correo" value="${userData.correo}" required>
                </div>
                <div class="form-group">
                    <label for="telefono">Teléfono:</label>
                    <input type="tel" id="telefono" value="${userData.telefono}" required>
                </div>
                <div class="form-group">
                    <label for="preguntaSeguridad">Pregunta de Seguridad:</label>
                    <input type="text" id="preguntaSeguridad" value="${userData.preguntaSeguridad}" required>
                </div>
                <div class="form-group">
                    <label for="respuestaSeguridad">Respuesta de Seguridad:</label>
                    <input type="text" id="respuestaSeguridad" value="${userData.respuestaSeguridad}" required>
                </div>
                <div class="form-group">
                    <label for="correoRecuperacion">Correo de Recuperación:</label>
                    <input type="email" id="correoRecuperacion" value="${userData.correoRecuperacion}" required>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="save-btn">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';

    // Cerrar modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Manejar el envío del formulario
    const form = modal.querySelector('#editUserForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Actualizar los datos en la fila
        row.cells[0].textContent = form.querySelector('#nombres').value;
        row.cells[1].textContent = form.querySelector('#apellidos').value;
        row.cells[2].textContent = form.querySelector('#correo').value;
        row.cells[3].textContent = form.querySelector('#telefono').value;
        row.cells[4].textContent = form.querySelector('#preguntaSeguridad').value;
        row.cells[5].textContent = form.querySelector('#respuestaSeguridad').value;
        row.cells[6].textContent = form.querySelector('#correoRecuperacion').value;

        // Aquí se podría agregar una llamada a la API para actualizar los datos

        // Cerrar el modal
        modal.remove();
    });
}

// Función para mostrar/ocultar el menú desplegable
function toggleDropdown(button) {
    // Cerrar todos los otros menús desplegables
    document.querySelectorAll('.dropdown-content').forEach(dropdown => {
        if (dropdown !== button.querySelector('.dropdown-content')) {
            dropdown.style.display = 'none';
        }
    });

    // Toggle del menú actual
    const dropdown = button.querySelector('.dropdown-content');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Cerrar los menús desplegables al hacer clic fuera
document.addEventListener('click', function(e) {
    if (!e.target.closest('.edit-btn')) {
        document.querySelectorAll('.dropdown-content').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// Función para editar usuario
function editUser(link, event) {
    event.preventDefault();
    event.stopPropagation();
    const row = link.closest('tr');
    const userData = {
        nombres: row.cells[0].textContent,
        apellidos: row.cells[1].textContent,
        correo: row.cells[2].textContent,
        telefono: row.cells[3].textContent,
        preguntaSeguridad: row.cells[4].textContent,
        respuestaSeguridad: row.cells[5].textContent,
        correoRecuperacion: row.cells[6].textContent,
        estado: row.cells[7].textContent
    };
    mostrarModalEdicion(userData, row);
}

// Función para cambiar el estado del usuario
function toggleUserStatus(link, event) {
    event.preventDefault();
    event.stopPropagation();
    const row = link.closest('tr');
    const estadoCell = row.cells[7];
    const nuevoEstado = estadoCell.textContent.trim() === 'Activo' ? 'No Activo' : 'Activo';
    
    if (confirm(`¿Estás seguro de cambiar el estado del usuario a ${nuevoEstado}?`)) {
        estadoCell.textContent = nuevoEstado;
    }
}

// Función para eliminar usuario
function deleteUser(link, event) {
    event.preventDefault();
    event.stopPropagation();
    const row = link.closest('tr');
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        row.remove();
    }
} 