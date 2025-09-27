// CONTROL DE ACCESO Y INICIO CARGA
document.addEventListener('DOMContentLoaded', () => {
    //Control de acceso
    if (localStorage.getItem('user-logged') !== 'admin') {
        alert('Debes iniciar sesión como administrador');
        return window.location.href = 'auth.html';
    }
    //configuración de listeners
    renderTablaEventos();
    configurarListeners();
});

let editandoIndice = null;

// CONFIG LISTENERS
function configurarListeners() {
    // Navegación Crear/Listar
    document.getElementById('nav-crear').addEventListener('click', e => {
        e.preventDefault();
        editandoIndice = null;
        limpiarFormulario();
        togglearSecciones('crear-evento');
    });
    document.getElementById('nav-listar').addEventListener('click', e => {
        e.preventDefault();
        togglearSecciones('listar-eventos');
        renderTablaEventos();
    });

    // Envió del formulario (crear o editar)
    document.getElementById('form-crear').addEventListener('submit', e => {
        e.preventDefault();
        procesarFormulario();
    });

    // Acciones de la tabla (Ver, Editar, Eliminar)
    document.querySelector('#listar-eventos tbody').addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.idx);
        if (e.target.classList.contains('btn-ver')) return verEvento(idx);
        if (e.target.classList.contains('btn-editar')) return iniciarEdicion(idx);
        if (e.target.classList.contains('btn-eliminar')) return borrarEvento(idx);
    });

    // Cerrar sesión
    document.querySelector('.btn-cerrar').addEventListener('click', () => {
        localStorage.removeItem('user-logged');
        window.location.href = 'auth.html';
    });
}

// Mostrar u ocultar secciones
function togglearSecciones(seccionVisible) {
    document.getElementById('crear-evento').classList.toggle('oculto', seccionVisible !== 'crear-evento');
    document.getElementById('listar-eventos').classList.toggle('oculto', seccionVisible !== 'listar-eventos');
}

// Limpia tod el formulario
function limpiarFormulario() {
    document.getElementById('form-crear').reset();
    document.querySelector('#form-crear button').textContent = 'Crear';
}

// creación o edición según estado
function procesarFormulario() {
    const titulo = document.getElementById('titulo').value.trim();
    const fecha  = document.getElementById('fecha').value;
    const lugar  = document.getElementById('lugar').value.trim();
    const tipo   = document.getElementById('tipo').value;

    if (!titulo || !fecha || !lugar || !tipo) {
        return alert('Por favor completa todos los campos');
    }

    const eventoData = { titulo, fecha, lugar, tipo, imagen: 'imagenes/eventosIMG.png' };

    try {
        if (editandoIndice !== null) {
            editarEvento(editandoIndice, eventoData);
            alert('Evento editado exitosamente!');
        } else {
            crearEvento(eventoData);
            alert('Evento creado exitosamente!');
        }
    } catch {
        return alert('Error al guardar el evento');
    }

    limpiarFormulario();
    document.getElementById('nav-listar').click();
}

// Carga datos de un evento al formulario para edición
function iniciarEdicion(idx) {
    const evento = listarEventos()[idx];
    document.getElementById('titulo').value = evento.titulo;
    document.getElementById('fecha').value  = evento.fecha;
    document.getElementById('lugar').value  = evento.lugar;
    document.getElementById('tipo').value   = evento.tipo;

    editandoIndice = idx;
    document.querySelector('#form-crear button').textContent = 'Guardar Cambios';
    togglearSecciones('crear-evento');
}

// Elimina un evento con confirmación
function borrarEvento(idx) {
    const eventos = listarEventos();
    if (confirm(`¿Eliminar "${eventos[idx].titulo}"?`)) {
        try {
            eliminarEvento(idx);
            renderTablaEventos();
            alert('Evento eliminado');
        } catch {
            alert('Error al eliminar');
        }
    }
}

// Muestra detalles de un evento en alert
function verEvento(idx) {
    const e = listarEventos()[idx];
    alert(
        `Detalles del evento:\n\n` +
        `Título: ${e.titulo}\n` +
        `Fecha: ${e.fecha}\n` +
        `Lugar: ${e.lugar}\n` +
        `Tipo: ${e.tipo}`
    );
}

// Renderiza la tabla de eventos en el DOM (actualiza)
function renderTablaEventos() {
    const eventos = listarEventos();
    const tbody = document.querySelector('#listar-eventos tbody');
    tbody.innerHTML = '';
    eventos.forEach((ev, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${i+1}</td> <!-- ÍNDICE -->
      <td>${ev.titulo}</td>
      <td>${ev.fecha}</td>
      <td>${ev.lugar}</td>
      <td>${ev.tipo}</td>
      <td>
        <button class="btn-ver"   data-idx="${i}">Ver</button>
        <button class="btn-editar"data-idx="${i}">Editar</button>
        <button class="btn-eliminar" data-idx="${i}">Eliminar</button>
      </td>`;
        tbody.appendChild(tr);
    });
}
