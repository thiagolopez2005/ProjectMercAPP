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

    let isAdmin = false;
    let editing = false;

    //--------------botones de cantidad---------------------
    document.querySelectorAll('.minus-btn').forEach(button => {
        button.addEventListener('click', function () {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 0) {
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
                this.value = 1;
            }
        });
    });

    //--------------------------Iniciar sesion------------------------
    if (loginSubmit) {
        loginSubmit.addEventListener('click', () => {
            const username = usernameInput.value;
            const password = passwordInput.value;

            if (username === 'sena' && password === '12345') {
                loginModal.style.display = 'none';
                isAdmin = true;
                toggleEditing();
            } else {
                loginError.textContent = 'Usuario o contraseña incorrectos.';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    

    
    if (editButton) {
        editButton.addEventListener('click', () => {
            if (!isAdmin) {
                loginModal.style.display = 'block';
            } else {
                toggleEditing();
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            isAdmin = false;
            editing = false;
            logoutButton.style.display = 'none';
            editButton.textContent = 'Editar Catálogo';
            removeEditForms();
        });
    }

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

    const addProductModal = document.getElementById('add-product-modal');
const addCatalogButton = document.getElementById('add-catalog');
const closeAddModal = document.getElementById('close-add-modal');

if (addCatalogButton) {
    addCatalogButton.addEventListener('click', () => {
        addProductModal.classList.add('show'); // Agrega la clase para mostrar el modal
    });
}

if (closeAddModal) {
    closeAddModal.addEventListener('click', () => {
        addProductModal.classList.remove('show'); // Remueve la clase para ocultarlo
    });
}

// Cierra el modal si se hace clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === addProductModal) {
        addProductModal.classList.remove('show');
    }
});

// Mostrar el modal de agregar producto
document.getElementById("add-catalog").addEventListener("click", function () {
    document.getElementById("add-product-modal").style.display = "block";
});

// Cerrar el modal
document.getElementById("close-add-modal").addEventListener("click", function () {
    document.getElementById("add-product-modal").style.display = "none";
});

document.getElementById("save-product-btn").addEventListener("click", function () {

    // Obtener valores del formulario
    const imageUrl = document.getElementById("product-image").value;
    const origin = document.getElementById("product-origin").value;
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("product-description").value;
    const unit = document.getElementById("product-unit").value;
    const price = document.getElementById("product-price").value;

    // Verificar que todos los campos esten llenos
    if (!imageUrl || !origin || !name || !description || !unit || !price) {
        alert("Por favor completar todos los campos");
        return;
    }

    // Crear el nuevo producto
    const newProduct = document.createElement("div");
    newProduct.classList.add("col-lg-4", "col-md-6");

    newProduct.innerHTML = `
        <div class="product-box">
            <img src="${imageUrl}" alt="${name}" class="product-image">
            <div class="product-origin">${origin}</div>
            <h4 class="product-title">${name}</h4>
            <p>${description}</p>
            <div class="product-unit">${unit}</div>
            <div class="product-price">$${parseFloat(price).toLocaleString()} COP</div>
            <div class="quantity-control">
                <div class="quantity-btn minus-btn">-</div>
                <input type="number" min="0" value="0" class="quantity-input">
                <div class="quantity-btn plus-btn">+</div>
            </div>
            <button class="btn btn-agregar btn-block">Agregar al carrito</button>
        </div>
    `;

    // Agrega las funciones a los botones de cantidad
    const minusBtn = newProduct.querySelector(".minus-btn");
    const plusBtn = newProduct.querySelector(".plus-btn");
    const quantityInput = newProduct.querySelector(".quantity-input");

    minusBtn.addEventListener("click", function () {
        let value = parseInt(quantityInput.value);
        if (value > 0) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener("click", function () {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    // Agregar el nuevo producto al catalogo
    document.querySelector(".products-container .row").appendChild(newProduct);

    // Limpia los campos del formulario
    document.getElementById("product-image").value = "";
    document.getElementById("product-origin").value = "";
    document.getElementById("product-name").value = "";
    document.getElementById("product-description").value = "";
    document.getElementById("product-unit").value = "";
    document.getElementById("product-price").value = "";

    // Cerrar el modal después de agregar el producto
    document.getElementById("add-product-modal").style.display = "none";
});

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
            
            product.querySelector('.product-price').innerHTML = `$ ${priceInput.value} COP`;
    
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
});

     // Wait for the DOM to be fully loaded
     document.addEventListener('DOMContentLoaded', function() {
        // Set up event listeners for all minus buttons
        document.querySelectorAll('.minus-btn').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.nextElementSibling;
                if (parseInt(input.value) > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        });
        
        // Set up event listeners for all plus buttons
        document.querySelectorAll('.plus-btn').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.previousElementSibling;
                input.value = parseInt(input.value) + 1;
            });
        });
        
        // Prevent manual input of negative or non-numeric values
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                if (this.value < 1 || isNaN(this.value)) {
                    this.value = 1;
                }
            });
        });
        
        // Modificación: redirigir a login.html al hacer clic en "Agregar al carrito"
        document.querySelectorAll('.btn-agregar').forEach(button => {
            button.addEventListener('click', function() {
                const productBox = this.closest('.product-box');
                const productTitle = productBox.querySelector('.product-title').textContent;
                const quantity = productBox.querySelector('.quantity-input').value;
                
                // Guardar información del producto en localStorage antes de redirigir
                localStorage.setItem('selectedProduct', productTitle);
                localStorage.setItem('selectedQuantity', quantity);
                
                // Redireccionar a la página de login
                window.location.href = 'login.html';
            });
        });
    });




// ... (código JavaScript anterior) ...

const logoutButton = document.getElementById('logout-button'); // Agregamos la constante del botón de cerrar sesión

// ... (resto del código JavaScript) ...

function toggleEditing() {
editing = !editing;

if (editing) {
    addProductForm();
    editButton.textContent = 'Guardar Cambios';
    logoutButton.style.display = 'block'; // Mostramos el botón de cerrar sesión
} else {
    editButton.textContent = 'Editar';
    removeEditForms();
    logoutButton.style.display = 'none'; // Ocultamos el botón de cerrar sesión
}
}

logoutButton.addEventListener('click', () => {
isAdmin = false;
editing = false;
logoutButton.style.display = 'none';
editButton.textContent = 'Editar';
removeEditForms();
});

// ... (resto del código JavaScript) ...
const editButton = document.getElementById('edit-button');
const productGrid = document.getElementById('product-grid');
const loginModal = document.getElementById('login-modal');
const loginSubmit = document.getElementById('login-submit');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');
const closeModal = document.querySelector('.close');

let isAdmin = false;
let editing = false; // Nueva variable para rastrear si estamos en modo de edición

editButton.addEventListener('click', () => {
if (!isAdmin) {
    loginModal.style.display = 'block';
} else {
    toggleEditing();
}
});

loginSubmit.addEventListener('click', () => {
const username = usernameInput.value;
const password = passwordInput.value;

if (username === 'sena' && password === '12345') {
    loginModal.style.display = 'none';
    isAdmin = true;
    toggleEditing();
} else {
    loginError.textContent = 'Usuario o contraseña incorrectos.';
}
});

closeModal.addEventListener('click', () => {
loginModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
if (event.target === loginModal) {
    loginModal.style.display = 'none';
}
});

function toggleEditing() {
editing = !editing; // Cambia el estado de edición

if (editing) {
    addProductForm();
    editButton.textContent = 'Guardar Cambios'; // Cambia el texto del botón
} else {
    // Aquí puedes agregar lógica para guardar todos los cambios en un backend
    editButton.textContent = 'Editar'; // Restaura el texto del botón
    removeEditForms(); // Elimina los formularios de edición
}
}

function addProductForm() {
if (productGrid.querySelector('.edit-mode')) {
    return; // Si ya hay un formulario de edición, no agregues otro
}

const newProduct = document.createElement('div');
newProduct.classList.add('product-item', 'edit-mode');
newProduct.innerHTML = `
    <input type="text" placeholder="URL de la imagen" id="new-image">
    <input type="text" placeholder="Origen" id="new-origin">
    <input type="text" placeholder="Título" id="new-title">
    <textarea placeholder="Descripción" id="new-description"></textarea>
    <input type="text" placeholder="Unidad" id="new-unit">
    <input type="text" placeholder="Precio" id="new-price">
    <button id="save-product">Guardar Producto</button>
`;
productGrid.appendChild(newProduct);

const saveButton = newProduct.querySelector('#save-product');
saveButton.addEventListener('click', () => {
    saveProduct(newProduct);
});
}

function saveProduct(productElement) {
const image = productElement.querySelector('#new-image').value;
const origin = productElement.querySelector('#new-origin').value;
const title = productElement.querySelector('#new-title').value;
const description = productElement.querySelector('#new-description').value;
const unit = productElement.querySelector('#new-unit').value;
const price = productElement.querySelector('#new-price').value;

const newProductHTML = `
    <div class="product-item">
        <img src="${image}" alt="${title}">
        <div class="product-origin">${origin}</div>
        <h4 class="product-title">${title}</h4>
        <p>${description}</p>
        <div class="product-unit">${unit}</div>
        <div class="product-price">${price}</div>
    </div>
`;

productGrid.innerHTML += newProductHTML;
productElement.remove();
}
function removeEditForms() {
const editForms = productGrid.querySelectorAll('.edit-mode');
editForms.forEach(form => form.remove());
}
