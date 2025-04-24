function actualizarTablaProductos() {
    fetch('/obtener_productos_json/')  // Asegúrate de que esta URL sea correcta
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json();
        })
        .then(productos => {
            const tabla = document.getElementById('inventoryTable').getElementsByTagName('tbody')[0];
            tabla.innerHTML = '';  // Limpia la tabla

            productos.forEach(producto => {
                let fila = tabla.insertRow();
                let celdaNombre = fila.insertCell();
                let celdaDescripcion = fila.insertCell();
                let celdaUnidad = fila.insertCell();
                let celdaZtock= fila.insertCell();
                let celdaMMedida = fila.insertCell();
                // Asegúrate de que los nombres de las propiedades coincidan con los campos de tu vista
                celdaNombre.textContent = producto.nombre;
                celdaDescripcion.textContent = producto.descripcion;  // Campo "descripcion"
                celdaUnidad.textContent = producto.unidad;  // Campo "nombre" de la base de datos
                celdaZtock.textContent = producto.stock;
                celdaMMedida.textContent = producto.medida;            });
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}

// Llama a la función para cargar los datos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarTablaProductos();

    // Función para filtrar productos
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