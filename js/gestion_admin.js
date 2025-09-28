// CONTROL DE ACCESO Y INICIO CARGA
document.addEventListener('DOMContentLoaded', () => {
    //Control de acceso
    if (localStorage.getItem('user-logged') !== 'admin') {
        alert('Debes iniciar sesión como administrador');
        return window.location.href = 'auth.html';
    }
    renderTablaEventos();
    configurarListeners();
});

let editandoIndice = null;

// CONFIG LISTENERS Y MODAL
function configurarListeners() {
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

    // Acciones tabla
    document.querySelector('#listar-eventos tbody').addEventListener('click', e => {
        const idx = parseInt(e.target.dataset.idx);
        if (e.target.classList.contains('btn-ver')) return verEvento(idx);
        if (e.target.classList.contains('btn-editar')) return iniciarEdicion(idx);
        if (e.target.classList.contains('btn-eliminar')) return borrarEvento(idx);
    });

    // Cerrar sesión
    document.querySelector('.btn-cerrar').addEventListener('click', () => {
        localStorage.removeItem('user-logged');
        window.location.replace('auth.html');
    });

    // Modal detalles: cerrar
    const cerrarModal = document.getElementById('cerrar-modal');
    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            document.getElementById('modal-detalle').classList.add('oculto');
        });
    }
}

// Mostrar u ocultar secciones
function togglearSecciones(seccionVisible) {
    document.getElementById('crear-evento').classList.toggle('oculto', seccionVisible !== 'crear-evento');
    document.getElementById('listar-eventos').classList.toggle('oculto', seccionVisible !== 'listar-eventos');
}

// Limpia el formulario y bot
function limpiarFormulario() {
    document.getElementById('form-crear').reset();
    document.querySelector('#form-crear button').textContent = 'Crear';
}

// Proceso de formulario: crear o editar
function procesarFormulario() {
    const titulo = document.getElementById('titulo').value.trim();
    const fecha = document.getElementById('fecha').value;
    const lugar = document.getElementById('lugar').value.trim();
    const tipo = document.getElementById('tipo').value;
    const imagen = document.getElementById('imagen').value.trim() || 'imagenes/eventosIMG.png';
    const descripcion = document.getElementById('descripcion').value.trim();
    const capacidad = document.getElementById('capacidad').value;
    const precio = document.getElementById('precio').value.trim();

    if (!titulo || !fecha || !lugar || !tipo || !imagen) {
        return alert('Por favor completa todos los campos principales');
    }

    const eventoData = { titulo, fecha, lugar, tipo, imagen, descripcion, capacidad, precio };

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

// Precarga campos para edición
function iniciarEdicion(idx) {
    const e = listarEventos()[idx];
    document.getElementById('titulo').value = e.titulo;
    document.getElementById('fecha').value = e.fecha;
    document.getElementById('lugar').value = e.lugar;
    document.getElementById('tipo').value = e.tipo;
    document.getElementById('imagen').value = e.imagen;
    document.getElementById('descripcion').value = e.descripcion || '';
    document.getElementById('capacidad').value = e.capacidad || '';
    document.getElementById('precio').value = e.precio || '';

    editandoIndice = idx;
    document.querySelector('#form-crear button').textContent = 'Guardar Cambios';
    togglearSecciones('crear-evento');
}

// Elimina evento
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

// Mostrar modal de detalles del evento
function verEvento(idx) {
    const e = listarEventos()[idx];
    document.getElementById('detalle-img').src = e.imagen;
    document.getElementById('detalle-titulo').textContent = e.titulo;
    document.getElementById('detalle-fecha').textContent = e.fecha;
    document.getElementById('detalle-lugar').textContent = e.lugar;
    document.getElementById('detalle-tipo').textContent = e.tipo;
    document.getElementById('detalle-descripcion').textContent = e.descripcion || 'Sin descripción';
    document.getElementById('detalle-capacidad').textContent = e.capacidad || 'No informada';
    document.getElementById('detalle-precio').textContent = e.precio || 'Gratis';
    document.getElementById('modal-detalle').classList.remove('oculto');
}

// Renderiza la tabla, ahora con imagen como thumbnail
function renderTablaEventos() {
    const eventos = listarEventos();
    const tbody = document.querySelector('#listar-eventos tbody');
    tbody.innerHTML = '';

    eventos.forEach((ev, i) => {
        const fechaCreacion = ev.fechaCreacion ? new Date(ev.fechaCreacion).toLocaleDateString() : 'N/A';
        const autor = ev.creadoPor || 'Sistema';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i+1}</td>
          <td><img src="${ev.imagen}" style="width:48px;height:48px;object-fit:cover;border-radius:4px;" alt="Evento"></td>
          <td>
            <strong>${ev.titulo}</strong><br>
            <small style="color: #666;">Por: ${autor}</small>
          </td>
          <td>${ev.fecha}</td>
          <td>${ev.lugar}</td>
          <td><span style="background: var(--acento); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${ev.tipo}</span></td>
          <td>
            <button class="btn-ver" data-idx="${i}" style="margin: 2px;">Ver</button>
            <button class="btn-editar" data-idx="${i}" style="margin: 2px; background: #28a745;">Editar</button>
            <button class="btn-eliminar" data-idx="${i}" style="margin: 2px; background: #dc3545;">Eliminar</button>
          </td>`;
        tbody.appendChild(tr);
    });
}