// CONTROL DE ACCESO - Bloquea si no está logueado y redirecciona a login
if (localStorage.getItem('user-logged') !== 'admin') {
    alert('Debes iniciar sesión como administrador');
    window.location.href = 'auth.html';
}

let editandoIndice = null;

// NAVEGACIÓN ENTRE SECCIONES
document.getElementById('nav-crear').addEventListener('click', e => {
    e.preventDefault();
    editandoIndice = null; // Resetear modo edición
    limpiarFormulario();
    document.getElementById('crear-evento').classList.remove('oculto');
    document.getElementById('listar-eventos').classList.add('oculto');
});

document.getElementById('nav-listar').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('listar-eventos').classList.remove('oculto');
    document.getElementById('crear-evento').classList.add('oculto');
    renderTablaEventos();
});

// Función para limpiar el formulario (al crear)
function limpiarFormulario() {
    document.getElementById('titulo').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('lugar').value = '';
    document.getElementById('tipo').value = '';

    // Cambiar texto del botón
    document.querySelector('#form-crear button').textContent = 'Crear';
}

// Función para cargar datos en el formulario (al editar)
function cargarEventoEnFormulario(evento, indice) {
    document.getElementById('titulo').value = evento.titulo;
    document.getElementById('fecha').value = evento.fecha;
    document.getElementById('lugar').value = evento.lugar;
    document.getElementById('tipo').value = evento.tipo;

    editandoIndice = indice; // Guardamos que estamos editando
    document.querySelector('#form-crear button').textContent = 'Guardar Cambios';

    // Mostrar enseguida el formulario (Oculta y muestra)
    document.getElementById('crear-evento').classList.remove('oculto');
    document.getElementById('listar-eventos').classList.add('oculto');
}

// RENDERIZAR TABLA CON BOTONES DE EDITAR (ACCIONES)
function renderTablaEventos() {
    const eventos = listarEventos();
    const tbody = document.querySelector('#listar-eventos tbody');
    tbody.innerHTML = '';

    // RECORRER LOS EVENTOS Y CREAR LAS FILAS
    eventos.forEach((evento, idx) => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${evento.titulo}</td>
            <td>${evento.fecha}</td>
            <td>${evento.lugar}</td>
            <td>${evento.tipo}</td>
            <td>
                <button class="btn-ver" data-idx="${idx}">Ver</button>
                <button class="btn-editar" data-idx="${idx}">Editar</button>
                <button class="btn-eliminar" data-idx="${idx}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// CREAR O EDITAR EVENTO DESDE FORMULARIO
document.getElementById('form-crear').addEventListener('submit', e => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const fecha = document.getElementById('fecha').value;
    const lugar = document.getElementById('lugar').value.trim();
    const tipo = document.getElementById('tipo').value;

    if (!titulo || !fecha || !lugar || !tipo) {
        alert('Por favor completa todos los campos');
        return;
    }

    const eventoData = {
        titulo: titulo,
        fecha: fecha,
        lugar: lugar,
        tipo: tipo,
        imagen: "imagenes/eventosIMG.png"
    };

    if (editandoIndice !== null) {
        // ESTAMOS EDITANDO
        editarEvento(editandoIndice, eventoData);
        alert('Evento editado exitosamente!');
    } else {
        // ESTAMOS CREANDO
        crearEvento(eventoData);
        alert('Evento creado exitosamente!');
    }

    limpiarFormulario();
    document.getElementById('nav-listar').click(); // Volver a la lista automaticamente
});

// ACCIONES DE LA TABLA (Ver, Editar, Eliminar)
document.querySelector('#listar-eventos').addEventListener('click', function(e) {
    const idx = parseInt(e.target.dataset.idx);
    const eventos = listarEventos();

    if (e.target.classList.contains('btn-ver')) {
        const evento = eventos[idx];
        alert(`Detalles del evento:\n\nTítulo: ${evento.titulo}\nFecha: ${evento.fecha}\nLugar: ${evento.lugar}\nTipo: ${evento.tipo}`);
    }

    if (e.target.classList.contains('btn-editar')) {
        const evento = eventos[idx];
        cargarEventoEnFormulario(evento, idx);
    }

    if (e.target.classList.contains('btn-eliminar')) {
        const evento = eventos[idx];
        if (confirm(`¿Seguro que quieres eliminar "${evento.titulo}"?`)) {
            eliminarEvento(idx);
            renderTablaEventos();
            alert('Evento eliminado');
        }
    }
});

// CERRAR SESIÓN
document.querySelector('.perfil a[href="index.html"]').addEventListener('click', function() {
    localStorage.removeItem('user-logged');
    localStorage.removeItem('user-email');
});

// INICIALIZAR AL CARGAR
document.addEventListener('DOMContentLoaded', function() {
    renderTablaEventos();
});
