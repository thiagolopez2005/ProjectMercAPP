document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    const editButton = document.getElementById('edit-button');
    const logoutButton = document.getElementById('logout-button');
    const loginModal = document.getElementById('login-modal');
    const loginSubmit = document.getElementById('login-submit');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const closeModal = document.querySelector('.close');
    const addProductModal = document.getElementById('add-product-modal');
    const addCatalogButton = document.getElementById('add-catalog');
    const closeAddModal = document.getElementById('close-add-modal');
    const saveProductBtn = document.getElementById('save-product-btn');
    const productContainer = document.querySelector('.products-container');

    let isAdmin = false;
    let editing = false;

    // Inicializar el carrito
    if (typeof cart === 'undefined') {
        window.cart = new ShoppingCart();
    }

    //--------------botones de cantidad---------------------
    document.querySelectorAll('.minus-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            // Permitir descontar solo si el valor es mayor o igual a 1
            if (parseInt(input.value) >= 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    document.querySelectorAll('.plus-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            // Validar que el valor sea un número positivo o ajustar a 0 en caso de error
            if (this.value < 0 || isNaN(this.value)) {
                this.value = 0;
            }
        });
    });
    //-------------------Activar y desactivar la edicion del catalogo--------------------------

    function toggleEditing() {
        editing = !editing;

        if (editing) {
            enableProductEditing();
            editButton.textContent = 'Guardar Cambios';
            if (logoutButton) logoutButton.style.display = 'block';
        } else {
            saveProductChanges();
            editButton.textContent = 'Editar Catálogo';
            if (logoutButton) logoutButton.style.display = 'none';
        }
    }

    //-------------------------Permitir la edicion de los productos-------------------------
    function enableProductEditing() {
        document.querySelectorAll('.product-box').forEach(product => {
            const image = product.querySelector('.product-image');
            const title = product.querySelector('.product-title');
            const description = product.querySelector('p');
            const unit = product.querySelector('.product-unit');
            const price = product.querySelector('.product-price');
            const addToCartBtn = product.querySelector('.btn-agregar');
            const quantitySection = product.querySelector('.quantity-section');

            title.innerHTML = `<input type="text" value="${title.textContent}" class="edit-input">`;
            description.innerHTML = `<textarea class="edit-input">${description.textContent}</textarea>`;
            unit.innerHTML = `<input type="text" value="${unit.textContent}" class="edit-input">`;

            const priceValue = price.textContent.replace(/[^0-9.]/g, '');
            price.innerHTML = `
                <span>$</span>
                <input type="text" value="${priceValue}" class="edit-input price-input" inputmode="decimal">
                <span>COP</span>
            `;

            const priceInput = price.querySelector('.price-input');
            priceInput.addEventListener('input', function () {

                //----------------------Permite solo numeros y un punto--------------------------

                this.value = this.value.replace(/[^0-9.]/g, '');
                if ((this.value.match(/\./g) || []).length > 1) {
                    this.value = this.value.slice(0, -1);
                }
                if (this.value.startsWith('.')) {
                    this.value = '0' + this.value;
                }
            });

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('edit-image-container');
            imageContainer.innerHTML = `
                <label>URL:</label>
                <input type="text" value="${image.src}" class="edit-image-url">
            `;
            image.parentNode.insertBefore(imageContainer, image.nextSibling);

            addEnableDisableButtons(product, title, description, unit, price, addToCartBtn, quantitySection);
        });
    }
    //----------------------------------Agregar productos---------------------------------------

    if (addCatalogButton) {
        addCatalogButton.addEventListener('click', () => {
            if (!isAdmin) {
                loginModal.style.display = 'block';
                return;
            }
            addProductModal.style.display = 'block';
        });
    }

    if (closeAddModal) {
        closeAddModal.addEventListener('click', () => {
            addProductModal.style.display = 'none';
            clearAddProductForm();
        });
    }

    // Cierra el modal si se hace clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === addProductModal) {
            addProductModal.style.display = 'none';
            clearAddProductForm();
        }
    });

    function clearAddProductForm() {
        document.getElementById("product-image").value = "";
        document.getElementById("product-origin").value = "";
        document.getElementById("product-name").value = "";
        document.getElementById("product-description").value = "";
        document.getElementById("product-unit").value = "";
        document.getElementById("product-price").value = "";
    }

    if (saveProductBtn) {
        saveProductBtn.addEventListener("click", function () {
            if (!isAdmin) {
                alert("No tienes permisos para agregar productos");
                return;
            }

            // Obtener valores del formulario
            const imageUrl = document.getElementById("product-image").value.trim();
            const origin = document.getElementById("product-origin").value.trim();
            const name = document.getElementById("product-name").value.trim();
            const description = document.getElementById("product-description").value.trim();
            const unit = document.getElementById("product-unit").value.trim();
            let price = document.getElementById("product-price").value.trim();

            // Validar que todos los campos estén llenos
            if (!imageUrl || !origin || !name || !description || !unit || !price) {
                alert("Por favor, completa todos los campos.");
                return;
            }

            // Validar URL de imagen
            if (!isValidImageUrl(imageUrl)) {
                alert("Por favor, ingresa una URL de imagen válida.");
                return;
            }

            // Validar precio
            price = parseFloat(price);
            if (isNaN(price) || price <= 0) {
                alert("Por favor, ingresa un precio válido mayor a 0.");
                return;
            }

            // Crear la estructura del producto
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-lg-4", "col-md-6");

            productDiv.innerHTML = `
                <div class="product-box">
                    <img src="${imageUrl}" alt="${name}" class="product-image">
                    <div class="product-origin">${origin}</div>
                    <h4 class="product-title">${name}</h4>
                    <p>${description}</p>
                    <div class="product-unit">${unit}</div>
                    <div class="product-price">$${price.toLocaleString('es-CO', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP</div>
                    <div class="quantity-control">
                        <div class="quantity-btn minus-btn">-</div>
                        <input type="number" min="0" value="0" class="quantity-input">
                        <div class="quantity-btn plus-btn">+</div>
                    </div>
                    <button class="btn btn-agregar btn-block">Agregar al carrito</button>
                </div>
            `;

            // Agregar el producto al contenedor
            productContainer.appendChild(productDiv);

            // Agregar eventos a los botones de cantidad
            const minusBtn = productDiv.querySelector(".minus-btn");
            const plusBtn = productDiv.querySelector(".plus-btn");
            const quantityInput = productDiv.querySelector(".quantity-input");

            minusBtn.addEventListener("click", function () {
                if (parseInt(quantityInput.value) >= 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                }
            });

            plusBtn.addEventListener("click", function () {
                quantityInput.value = parseInt(quantityInput.value) + 1;
            });

            quantityInput.addEventListener("change", function () {
                if (this.value < 0 || isNaN(this.value)) {
                    this.value = 0;
                }
            });

            // Agregar evento al botón de agregar al carrito
            const addToCartBtn = productDiv.querySelector(".btn-agregar");
            addToCartBtn.addEventListener("click", function () {
                const productBox = this.closest('.product-box');
                const product = {
                    id: generateProductId(productBox.querySelector('.product-title').textContent),
                    name: productBox.querySelector('.product-title').textContent,
                    price: parseFloat(productBox.querySelector('.product-price').textContent.replace('$', '').replace('.', '').replace('COP', '').trim()),
                    image: productBox.querySelector('.product-image').src,
                    quantity: parseInt(productBox.querySelector('.quantity-input').value)
                };

                cart.addItem(product);
                alert('Producto Agregado al carrito,¡Revisalo!');
            });

            // Cerrar el modal
            addProductModal.style.display = "none";
            clearAddProductForm();

            // Mostrar mensaje de éxito
            alert("Producto Agregado exitosamente al catálogo");
        });
    }

    function isValidImageUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    //-----------------------------------Guardar cambios----------------------------------------

    function saveProductChanges() {
        document.querySelectorAll('.product-box').forEach(product => {
            const imageInput = product.querySelector('.edit-image-url');
            const titleInput = product.querySelector('.product-title input');
            const descriptionInput = product.querySelector('p textarea');
            const unitInput = product.querySelector('.product-unit input');
            const priceInput = product.querySelector('.product-price .price-input');

            product.dataset.imagen = imageInput.value;
            product.dataset.nombre = titleInput.value;
            product.dataset.descripcion = descriptionInput.value;
            product.dataset.cantidad = unitInput.value;
            product.dataset.precio = priceInput.value;

            product.querySelector('.product-title').textContent = titleInput.value;
            product.querySelector('p').textContent = descriptionInput.value;
            product.querySelector('.product-unit').textContent = unitInput.value;

            product.querySelector('.product-price').innerHTML = `$ ${parseFloat(priceInput.value).toLocaleString('es-CO', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })} COP`;

            const imageElement = product.querySelector('.product-image');
            if (imageElement) {
                imageElement.src = imageInput.value;
            }

            const imageContainer = product.querySelector('.edit-image-container');
            if (imageContainer) {
                imageContainer.remove();
            }
        });
    }

    //-------------------------Funciones para los Botones Habilitar e Inhabilitar--------------------------------

    function addEnableDisableButtons(product, title, description, unit, price, addToCartBtn, quantitySection) {
        if (product.querySelector('.btn-habilitar') || product.querySelector('.btn-inhabilitar')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('btn-container');

        const habilitarBtn = document.createElement('button');
        habilitarBtn.classList.add('btn-habilitar');
        habilitarBtn.textContent = 'Habilitar';

        const inhabilitarBtn = document.createElement('button');
        inhabilitarBtn.classList.add('btn-inhabilitar');
        inhabilitarBtn.textContent = 'Inhabilitar';

        if (product.dataset.habilitado === "false") {
            buttonContainer.appendChild(habilitarBtn);
        } else {
            buttonContainer.appendChild(inhabilitarBtn);
        }

        product.appendChild(buttonContainer);

        habilitarBtn.addEventListener('click', () => toggleProductState(product, true, title, description, unit, price, addToCartBtn, quantitySection));
        inhabilitarBtn.addEventListener('click', () => toggleProductState(product, false, title, description, unit, price, addToCartBtn, quantitySection));
    }

    function toggleProductState(product, habilitar, title, description, unit, price, addToCartBtn, quantitySection) {
        const buttonContainer = product.querySelector('.btn-container');
        const minusBtn = product.querySelector('.minus-btn');
        const plusBtn = product.querySelector('.plus-btn');
        const quantityInput = product.querySelector('.quantity-input');

        if (habilitar) {
            product.dataset.habilitado = "true";
            title.textContent = product.dataset.nombre;
            description.textContent = product.dataset.descripcion;
            unit.textContent = product.dataset.cantidad;
            price.textContent = product.dataset.precio;
            addToCartBtn.disabled = false;
            minusBtn.disabled = false;
            plusBtn.disabled = false;
            quantityInput.disabled = false;

            buttonContainer.innerHTML = '';
            const inhabilitarBtn = document.createElement('button');
            inhabilitarBtn.classList.add('btn-inhabilitar');
            inhabilitarBtn.textContent = 'Inhabilitar';
            inhabilitarBtn.addEventListener('click', () => toggleProductState(product, false, title, description, unit, price, addToCartBtn, quantitySection));
            buttonContainer.appendChild(inhabilitarBtn);
        } else {
            product.dataset.habilitado = "false";
            title.textContent = "Inhabilitado";
            description.textContent = "Inhabilitado";
            unit.textContent = "Inhabilitado";
            price.textContent = "Inhabilitado";
            addToCartBtn.disabled = true;
            minusBtn.disabled = true;
            plusBtn.disabled = true;
            quantityInput.disabled = true;

            buttonContainer.innerHTML = '';
            const habilitarBtn = document.createElement('button');
            habilitarBtn.classList.add('btn-habilitar');
            habilitarBtn.textContent = 'Habilitar';
            habilitarBtn.addEventListener('click', () => toggleProductState(product, true, title, description, unit, price, addToCartBtn, quantitySection));
            buttonContainer.appendChild(habilitarBtn);
        }
    }

    function removeEditForms() {
        document.querySelectorAll('.product-box').forEach(product => {
            const title = product.querySelector('.product-title');
            const description = product.querySelector('p');
            const unit = product.querySelector('.product-unit');
            const price = product.querySelector('.product-price');
            const imageContainer = product.querySelector('.edit-image-container');

            if (title.querySelector('input')) {
                title.textContent = title.querySelector('input').value;
            }
            if (description.querySelector('textarea')) {
                description.textContent = description.querySelector('textarea').value;
            }
            if (unit.querySelector('input')) {
                unit.textContent = unit.querySelector('input').value;
            }
            if (price.querySelector('.price-input')) {
                price.innerHTML = `$ ${price.querySelector('.price-input').value} COP`;
            }
            if (imageContainer) {
                imageContainer.remove();
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Obtener todos los botones de "Agregar al carrito"
    const addToCartButtons = document.querySelectorAll('.btn-agregar');

    // Agregar evento click a cada botón
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Obtener el contenedor del producto
            const productBox = this.closest('.product-box');

            // Obtener los datos del producto
            const product = {
                id: generateProductId(productBox.querySelector('.product-title').textContent),
                name: productBox.querySelector('.product-title').textContent,
                price: parseFloat(productBox.querySelector('.product-price').textContent.replace('$', '').replace('.', '').replace('COP', '').trim()),
                image: productBox.querySelector('.product-image').src,
                quantity: parseInt(productBox.querySelector('.quantity-input').value)
            };

            // Agregar al carrito
            cart.addItem(product);

            // Mostrar mensaje de confirmación
            alert('Producto Agregado al carrito ¡Revisalo!');
        });
    });

    // Manejar los botones de cantidad
    const minusButtons = document.querySelectorAll('.minus-btn');
    const plusButtons = document.querySelectorAll('.plus-btn');
    const quantityInputs = document.querySelectorAll('.quantity-input');

    minusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            if (currentValue >= 1) {
                input.value = currentValue - 1;
            }
        });
    });

    plusButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.parentElement.querySelector('.quantity-input');
            input.value = parseInt(input.value) + 1;
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', function () {
            if (this.value < 0 || isNaN(this.value)) {
                this.value = 0;
            }
        });
    });
});

// Función para generar un ID único para cada producto
function generateProductId(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
}

// Función para guardar el catálogo en localStorage
function saveCatalogToLocalStorage() {
    const catalog = [];
    document.querySelectorAll('.product-box').forEach(product => {
        catalog.push({
            imagen: product.querySelector('.product-image').src,
            origen: product.querySelector('.product-origin').textContent,
            nombre: product.querySelector('.product-title').textContent,
            descripcion: product.querySelector('p').textContent,
            unidad: product.querySelector('.product-unit').textContent,
            precio: product.querySelector('.product-price').textContent,
            habilitado: product.closest('.col-lg-4').dataset.habilitado === "true"
        });
    });
    localStorage.setItem('catalog', JSON.stringify(catalog));
}

// Función para cargar el catálogo desde localStorage
function loadCatalogFromLocalStorage() {
    const catalog = JSON.parse(localStorage.getItem('catalog'));
    if (catalog) {
        productContainer.innerHTML = ''; // Limpiar el contenedor actual
        catalog.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("col-lg-4", "col-md-6");
            productDiv.dataset.habilitado = product.habilitado;

            productDiv.innerHTML = `
                <div class="product-box">
                    <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
                    <div class="product-origin">${product.origen}</div>
                    <h4 class="product-title">${product.nombre}</h4>
                    <p>${product.descripcion}</p>
                    <div class="product-unit">${product.unidad}</div>
                    <div class="product-price">${product.precio}</div>
                    <div class="quantity-control">
                        <div class="quantity-btn minus-btn">-</div>
                        <input type="number" min="0" value="0" class="quantity-input">
                        <div class="quantity-btn plus-btn">+</div>
                    </div>
                    <button class="btn btn-agregar btn-block">Agregar al carrito</button>
                </div>
            `;

            productContainer.appendChild(productDiv);
        });

        // Reinicializar los eventos de los botones
        initializeProductEvents();
    }
}

// Función para inicializar los eventos de los productos
function initializeProductEvents() {
    // Eventos de cantidad
    document.querySelectorAll('.minus-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            if (parseInt(input.value) >= 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    document.querySelectorAll('.plus-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function () {
            if (this.value < 0 || isNaN(this.value)) {
                this.value = 0;
            }
        });
    });

    // Eventos de agregar al carrito
    document.querySelectorAll('.btn-agregar').forEach(button => {
        button.addEventListener('click', function () {
            const productBox = this.closest('.product-box');
            const product = {
                id: generateProductId(productBox.querySelector('.product-title').textContent),
                name: productBox.querySelector('.product-title').textContent,
                price: parseFloat(productBox.querySelector('.product-price').textContent.replace('$', '').replace('.', '').replace('COP', '').trim()),
                image: productBox.querySelector('.product-image').src,
                quantity: parseInt(productBox.querySelector('.quantity-input').value)
            };

            cart.addItem(product);
            alert('Producto Agregado al carrito ¡Revisalo!');
        });
    });
}

// Cargar el catálogo al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
    loadCatalogFromLocalStorage();
});