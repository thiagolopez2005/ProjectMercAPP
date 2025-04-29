// carrito.js

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            this.items.push(product);
        }
        this.saveCart();
        this.updateCartDisplay();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');

        if (!cartItemsContainer || !cartTotalElement) return;

        cartItemsContainer.innerHTML = '';
        let total = 0;

        this.items.forEach(item => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('cart-item');
            cartItemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemDiv);
            total += item.price * item.quantity;
        });

        cartTotalElement.textContent = total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

        // Event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.cart-item .minus-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.id;
                const input = button.parentElement.querySelector('.quantity-input');
                let quantity = parseInt(input.value);
                if (quantity > 1) {
                    this.updateQuantity(productId, quantity - 1);
                }
            });
        });

        document.querySelectorAll('.cart-item .plus-btn').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.id;
                const input = button.parentElement.querySelector('.quantity-input');
                let quantity = parseInt(input.value);
                this.updateQuantity(productId, quantity + 1);
            });
        });

        document.querySelectorAll('.cart-item .quantity-input').forEach(input => {
            input.addEventListener('change', () => {
                const productId = input.dataset.id;
                let quantity = parseInt(input.value);
                if (isNaN(quantity) || quantity < 1) {
                    quantity = 1;
                    input.value = 1;
                }
                this.updateQuantity(productId, quantity);
            });
        });

        document.querySelectorAll('.cart-item .remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const productId = button.dataset.id;
                this.removeItem(productId);
            });
        });
    }
}

// Initialize the cart
window.cart = new ShoppingCart();