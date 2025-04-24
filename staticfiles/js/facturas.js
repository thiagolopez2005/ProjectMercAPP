document.addEventListener('DOMContentLoaded', (event) => {
    const invoiceNumberElement = document.getElementById('invoiceNumber');
    const generateInvoiceButton = document.getElementById('generateInvoice');

    // Cargar el número de factura desde el almacenamiento local
    let invoiceNumber = parseInt(localStorage.getItem('invoiceNumber')) || 0;
    invoiceNumberElement.textContent = invoiceNumber;

    generateInvoiceButton.addEventListener('click', () => {
        // Incrementar el número de factura
        invoiceNumber++;
        // Guardar el nuevo número de factura en el almacenamiento local
        localStorage.setItem('invoiceNumber', invoiceNumber);
        // Actualizar el elemento en la página
        invoiceNumberElement.textContent = invoiceNumber;
    });
});
//actulizador de fecha 
document.addEventListener('DOMContentLoaded', () => {
    const currentDateElement = document.getElementById('currentDate');

    function updateDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        currentDateElement.textContent = formattedDate;
    }

    // Inicializar la fecha al cargar la página
    updateDate();

    // Actualizar la fecha a medianoche
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
    const timeUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        updateDate();
        setInterval(updateDate, 24 * 60 * 60 * 1000); // Actualizar la fecha cada 24 horas
    }, timeUntilMidnight);
});

//calculadora de producto 
let products = [];
        let subtotal = 0;

        function addProduct() {
            const description = document.getElementById('product-description').value;
            const price = parseFloat(document.getElementById('product-price').value);

            if (description && price) {
                products.push({ description, price });

                const productList = document.getElementById('product-list');
                const newRow = document.createElement('tr');

                const descCell = document.createElement('td');
                descCell.textContent = description;
                newRow.appendChild(descCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = price.toFixed(1) + ' $';
                newRow.appendChild(priceCell);

                productList.appendChild(newRow);

                subtotal += price;
                updateTotals();
            }

            document.getElementById('product-description').value = '';
            document.getElementById('product-price').value = '';
        }

        function updateTotals() {
            const tax = subtotal * 0.19;
            const total = subtotal + tax;

            document.getElementById('subtotal').textContent = subtotal.toFixed(1) + ' $';
            document.getElementById('tax').textContent = tax.toFixed(1) + ' $';
            document.getElementById('total').textContent = total.toFixed(1) + ' $';
        }
