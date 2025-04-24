function handleActionChange(selectElement) {
    const selectedAction = selectElement.value;
    const row = selectElement.closest('tr');
    const cells = row.querySelectorAll('.editable');
    const saveBtn = row.querySelector('.save-btn');

    if (selectedAction === 'modificar') {
        cells.forEach(cell => {
            const currentValue = cell.textContent;
            cell.innerHTML = `<input type="text" value="${currentValue}">`;
        });
        saveBtn.style.display = 'inline'; // Show the save button
        selectElement.disabled = true; // Disable the select element
    } else if (selectedAction === 'inhabilitar') {
        cells.forEach(cell => {
            cell.querySelector('input')?.remove(); // Remove input if exists
            cell.textContent = 'Inhabilitado';
        });
        saveBtn.style.display = 'none'; // Hide the save button
        selectElement.disabled = false; // Enable the select element
    }
}

function saveChanges(buttonElement) {
    const row = buttonElement.closest('tr');
    const cells = row.querySelectorAll('.editable');

    cells.forEach(cell => {
        const input = cell.querySelector('input');
        if (input) {
            cell.textContent = input.value; // Update cell text with input value
        }
    });

    const selectElement = row.querySelector('select');
    selectElement.disabled = false; // Enable the select element
    selectElement.value = ""; // Reset the select element to default
    buttonElement.style.display = 'none'; // Hide the save button
}
document.addEventListener('DOMContentLoaded', () => {const searchInput = document.getElementById('search-input');})

function agregarProducto() {
    let table = document.getElementById("inventoryTable").getElementsByTagName('tbody')[0];
    let newRow = table.insertRow();

    let cell1 = newRow.insertCell(0);
    let cell2 = newRow.insertCell(1);
    let cell3 = newRow.insertCell(2);
    
    cell1.innerHTML = ' <input type="text" Nuevo Producto';
    cell2.innerHTML = '<input type="text" value="0" class="form-control">';
    cell3.innerHTML = '<select class="form-control">  <select onchange="handleActionChange(this)"><option value="">Seleccione</option><option value="inhabilitar">Inhabilitar</option><option value="modificar">Modificar</option>  </select>';
}