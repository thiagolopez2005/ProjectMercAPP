function actualizarTablaProductos() {
    fetch('/obtener_productos_json/')  // Reemplaza con la URL de tu vista
        .then(response => response.json())
        .then(productos => {
            const tabla = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';  // Limpia la tabla

            productos.forEach(producto => {
                let fila = tabla.insertRow();
                let celdaNombre = fila.insertCell();
                let celdaDescripcion = fila.insertCell();
                let celdaUnidad = fila.insertCell();
                let celdaStock= fila.insertCell();
                let celdaMedida = fila.insertCell();

                celdaNombre.textContent = producto.nombre;
                celdaDescripcion.textContent = producto.descripcion;
                celdaUnidad.textContent = producto.unidad;
                celdaStock.textContent = producto.stock;
                celdaMedida.textContent = producto.medida;
                
            });
        });
}
// Llama a la función inicialmente y cada cierto tiempo


// Función para filtrar productos

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const table = document.getElementById('inventoryTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();

        for (let i = 0; i < rows.length; i++) {
            const nombre = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
            const descripcion = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();

            if (nombre.includes(searchTerm) || descripcion.includes(searchTerm)) {
                rows[i].style.display = ''; // Mostrar la fila
            } else {
                rows[i].style.display = 'none'; // Ocultar la fila
            }
        }
    });
});