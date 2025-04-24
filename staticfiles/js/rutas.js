document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('form-container');
    const addFormButton = document.getElementById('add-form');
    const submitFormsButton = document.getElementById('submit-forms');
    const searchInput = document.getElementById('search-input');

    // Function to add a new form
    const addForm = () => {
        const newForm = document.createElement('form');
        newForm.classList.add('route-form');
        newForm.innerHTML = `

            <label for="driver-ID">ID del Conductor:</label>
            <input type="text" id="driver-ID" name="driver-ID" required>

            <label for="license-plate">Placas:</label>
            <input type="text" id="license-plate" name="license-plate" required>

            <label for="vehicle-type">Tipo de Vehículo:</label>
            <input type="text" id="vehicle-type" name="vehicle-type" required>

            <label for="lugar-type">Lugar de destino:</label>
            <input type="text" id="lugar-type" name="lugar-type" required>

            <label for="issue-date">Fecha de Emisión de Entrega:</label>
            <input type="date" id="issue-date" name="issue-date" required>
            
            <input class="verificacion-container" type="checkbox" id="verificacion-type" name="verificacion-type" required>
            <label for="verificacion-type">Verificación de Entrega:</label>

            <button type="button" class="remove-form">Eliminar Formulario</button>
        `;

        newForm.querySelector('.remove-form').addEventListener('click', () => {
            formContainer.removeChild(newForm);
        });

        formContainer.appendChild(newForm);
    };

    // Add initial remove button event listener
    document.querySelectorAll('.remove-form').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('form').remove();
        });
    });

    // Add new form on button click
    addFormButton.addEventListener('click', addForm);

    // Submit forms
    submitFormsButton.addEventListener('click', () => {
        const forms = document.querySelectorAll('.route-form');
        const data = Array.from(forms).map(form => {
            return {
 
                licensePlate: form.querySelector('input[name="license-plate"]').value,
                vehicleType: form.querySelector('input[name="vehicle-type"]').value,
                LugarType: form.querySelector('input[name="lugar-type"]').value,
                issueDate: form.querySelector('input[name="issue-date"]').value,
                VerificacionType: form.querySelector('input[name="verificacion-type"]').value
    
            };
        });
        console.log('Datos de los formularios:', data);
        alert('Se ha enviado el formulario.');
    });

    // Search forms
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        const forms = document.querySelectorAll('.route-form');
        forms.forEach(form => {
            const driverName = form.querySelector('input[name="driver-ID"]').value.toLowerCase();
            if (driverName.includes(searchText)) {
                form.style.display = '';
            } else {
                form.style.display = 'none';
            }
        });
    });
});


    // Add initial remove button event listener
    document.querySelectorAll('.remove-form').forEach(button => {
        button.addEventListener('click', (e) => {
            e.target.closest('form').remove();
        });
    });

    // Add new form on button click
    addFormButton.addEventListener('click', addForm);

    // Submit forms
    submitFormsButton.addEventListener('click', () => {
        const forms = document.querySelectorAll('.route-form');
        const data = Array.from(forms).map(form => {
            return {
                driverName: form.querySelector('input[name="driver-name"]').value,
                driverID: form.querySelector('input[name="driver-ID"]').value,
                licensePlate: form.querySelector('input[name="license-plate"]').value,
                vehicleType: form.querySelector('input[name="vehicle-type"]').value,
                LugarType: form.querySelector('input[name="lugar-type"]').value,
                issueDate: form.querySelector('input[name="issue-date"]').value,
                VerificacionType: form.querySelector('input[name="verificacion-type"]').value
            };
        });
        console.log('Datos de los formularios:', data);
        alert('Formularios enviados. Ver consola para más detalles.');
    });

