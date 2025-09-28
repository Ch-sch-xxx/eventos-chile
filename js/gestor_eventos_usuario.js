// js/gestor_eventos.js - ARCHIVO NUEVO COMPLETO

let editandoIndice = null;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    verificarAcceso();
    cargarInfoUsuario();
    configurarListeners();
    cargarEventosUsuario();
    actualizarEstadisticas();
});

// VERIFICAR ACCESO (todos los usuarios logueados pueden acceder)
function verificarAcceso() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    if (!userLogged || !userEmail) {
        alert('Debes iniciar sesión para gestionar eventos');
        window.location.href = 'auth.html';
        return;
    }
}

// CARGAR INFORMACIÓN DEL USUARIO
function cargarInfoUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    let nombreUsuario = 'Usuario';

    if (userLogged === 'admin') {
        nombreUsuario = 'Administrador';
        document.getElementById('titulo-gestor').textContent = 'Gestión de Eventos · Admin';
        document.getElementById('titulo-lista').textContent = 'Todos los Eventos del Sistema';
    } else {
        // Obtener nombre del usuario
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const usuario = usuarios.find(u => u.email === userEmail);
        nombreUsuario = usuario ? usuario.name : 'Usuario';

        document.getElementById('titulo-gestor').textContent = 'Mis Eventos · Eventos Chile';
        document.getElementById('titulo-lista').textContent = 'Mis Eventos Creados';
    }

    document.getElementById('nombre-usuario-header').textContent = nombreUsuario;

    // Cargar foto de perfil si existe
    const fotoGuardada = localStorage.getItem(`foto-perfil-${userEmail}`);
    if (fotoGuardada) {
        document.getElementById('imagen-perfil-header').src = fotoGuardada;
    }
}

// CONFIGURAR LISTENERS
function configurarListeners() {
    // Navegación
    document.getElementById('nav-crear').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccionCrear();
    });

    document.getElementById('nav-listar').addEventListener('click', (e) => {
        e.preventDefault();
        mostrarSeccionListar();
    });

    // Botones crear evento
    document.getElementById('btn-crear-rapido').addEventListener('click', mostrarSeccionCrear);
    document.getElementById('btn-crear-primero').addEventListener('click', mostrarSeccionCrear);

    // Formulario
    document.getElementById('form-crear').addEventListener('submit', procesarFormulario);
    document.getElementById('btn-cancelar-form').addEventListener('click', mostrarSeccionListar);

    // Cerrar sesión
    document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            localStorage.clear();
            window.location.href = 'auth.html';
        }
    });

    // Modal
    document.getElementById('cerrar-modal').addEventListener('click', cerrarModal);

    // Event delegation para eventos dinámicos
    document.getElementById('eventos-grid').addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.idx);

        if (e.target.classList.contains('btn-ver')) {
            verEvento(idx);
        } else if (e.target.classList.contains('btn-editar')) {
            editarEvento(idx);
        } else if (e.target.classList.contains('btn-eliminar')) {
            eliminarEventoConfirm(idx);
        }
    });
}

// MOSTRAR SECCIÓN CREAR
function mostrarSeccionCrear() {
    document.getElementById('crear-evento').classList.remove('oculto');
    document.getElementById('listar-eventos').classList.add('oculto');

    // Actualizar navegación
    document.getElementById('nav-crear').setAttribute('aria-current', 'page');
    document.getElementById('nav-listar').removeAttribute('aria-current');
}

// MOSTRAR SECCIÓN LISTAR
function mostrarSeccionListar() {
    document.getElementById('crear-evento').classList.add('oculto');
    document.getElementById('listar-eventos').classList.remove('oculto');

    // Actualizar navegación
    document.getElementById('nav-listar').setAttribute('aria-current', 'page');
    document.getElementById('nav-crear').removeAttribute('aria-current');

    cargarEventosUsuario();
}

// PROCESAR FORMULARIO
function procesarFormulario(e) {
    e.preventDefault();

    // Obtener datos del formulario
    const titulo = document.getElementById('titulo').value.trim();
    const fecha = document.getElementById('fecha').value;
    const lugar = document.getElementById('lugar').value.trim();
    const tipo = document.getElementById('tipo').value;
    const imagen = document.getElementById('imagen').value.trim() || 'imagenes/eventosIMG.png';
    const descripcion = document.getElementById('descripcion').value.trim();
    const capacidad = document.getElementById('capacidad').value;
    const precio = document.getElementById('precio').value.trim();

    // Validaciones
    if (!titulo || !fecha || !lugar || !tipo) {
        alert('Por favor completa todos los campos obligatorios');
        return;
    }

    // Validar fecha futura
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaEvento < hoy) {
        alert('La fecha del evento debe ser hoy o posterior');
        return;
    }

    const eventoData = {
        titulo,
        fecha,
        lugar,
        tipo,
        imagen,
        descripcion: descripcion || 'Evento organizado por usuario de la plataforma',
        capacidad: capacidad || '50',
        precio: precio || 'Gratis'
    };

    try {
        if (editandoIndice !== null) {
            // Editar evento existente
            if (editarEventoFuncion(editandoIndice, eventoData)) {
                alert('Evento actualizado exitosamente');
                editandoIndice = null;
                limpiarFormulario();
                mostrarSeccionListar();
            } else {
                alert('No tienes permisos para editar este evento');
            }
        } else {
            // Crear nuevo evento
            crearEvento(eventoData);
            alert('Evento creado exitosamente');
            limpiarFormulario();
            mostrarSeccionListar();
        }
    } catch (error) {
        console.error('Error al procesar evento:', error);
        alert('Error al guardar el evento');
    }
}

// LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById('form-crear').reset();
    document.getElementById('btn-submit').textContent = 'Crear Evento';
    editandoIndice = null;
}

// CARGAR EVENTOS DEL USUARIO
function cargarEventosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    const eventos = listarEventos();
    const container = document.getElementById('eventos-grid');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    container.innerHTML = '';

    let eventosUsuario = [];

    if (userLogged === 'admin') {
        eventosUsuario = eventos;
    } else {
        eventosUsuario = eventos.filter(evento => evento.creadoPor === userEmail);
    }

    if (eventosUsuario.length === 0) {
        mensajeVacio.classList.remove('oculto');
        return;
    }

    mensajeVacio.classList.add('oculto');

    eventosUsuario.forEach((evento, index) => {
        // Encontrar el índice real en la lista completa para edición/eliminación
        const indiceReal = eventos.findIndex(e => e.id === evento.id ||
            (e.titulo === evento.titulo && e.fecha === evento.fecha && e.creadoPor === evento.creadoPor));

        const eventoCard = document.createElement('div');
        eventoCard.className = 'evento-card';
        eventoCard.innerHTML = `
            <img src="${evento.imagen}" alt="${evento.titulo}" class="evento-imagen">
            <div class="evento-info">
                <h3 class="evento-titulo">${evento.titulo}</h3>
                <div class="evento-meta">
                    <span>📅 ${evento.fecha}</span>
                    <span class="evento-tipo">${evento.tipo}</span>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-bottom: 0.5rem;">📍 ${evento.lugar}</p>
                <div class="evento-acciones">
                    <button class="btn-accion btn-ver" data-idx="${indiceReal}">Ver</button>
                    <button class="btn-accion btn-editar" data-idx="${indiceReal}">Editar</button>
                    <button class="btn-accion btn-eliminar" data-idx="${indiceReal}">Eliminar</button>
                </div>
            </div>
        `;
        container.appendChild(eventoCard);
    });
}

// VER EVENTO EN MODAL
function verEvento(idx) {
    const eventos = listarEventos();
    const evento = eventos[idx];

    if (!evento) return;

    document.getElementById('detalle-img').src = evento.imagen;
    document.getElementById('detalle-titulo').textContent = evento.titulo;
    document.getElementById('detalle-fecha').textContent = evento.fecha;
    document.getElementById('detalle-tipo').textContent = evento.tipo;
    document.getElementById('detalle-lugar').textContent = evento.lugar;
    document.getElementById('detalle-descripcion').textContent = evento.descripcion || 'Sin descripción';
    document.getElementById('detalle-capacidad').textContent = evento.capacidad || 'No especificada';
    document.getElementById('detalle-precio').textContent = evento.precio || 'Gratis';

    document.getElementById('modal-detalle').classList.remove('oculto');
}

// CERRAR MODAL
function cerrarModal() {
    document.getElementById('modal-detalle').classList.add('oculto');
}

// EDITAR EVENTO
function editarEvento(idx) {
    const eventos = listarEventos();
    const evento = eventos[idx];
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');

    // Verificar permisos
    if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
        alert('Solo puedes editar eventos que tú has creado');
        return;
    }

    // Prellenar formulario
    document.getElementById('titulo').value = evento.titulo;
    document.getElementById('fecha').value = evento.fecha;
    document.getElementById('lugar').value = evento.lugar;
    document.getElementById('tipo').value = evento.tipo;
    document.getElementById('imagen').value = evento.imagen;
    document.getElementById('descripcion').value = evento.descripcion || '';
    document.getElementById('capacidad').value = evento.capacidad || '';
    document.getElementById('precio').value = evento.precio || '';

    editandoIndice = idx;
    document.getElementById('btn-submit').textContent = 'Guardar Cambios';

    mostrarSeccionCrear();
}

// FUNCIÓN DE EDITAR EVENTO (wrapper para crud_eventos.js)
function editarEventoFuncion(indice, eventoEditado) {
    return editarEvento(indice, eventoEditado);
}

// ELIMINAR EVENTO CON CONFIRMACIÓN
function eliminarEventoConfirm(idx) {
    const eventos = listarEventos();
    const evento = eventos[idx];
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');

    // Verificar permisos
    if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
        alert('Solo puedes eliminar eventos que tú has creado');
        return;
    }

    if (confirm(`¿Estás seguro de eliminar "${evento.titulo}"?\n\nEsta acción no se puede deshacer.`)) {
        if (eliminarEvento(idx)) {
            alert('Evento eliminado exitosamente');
            cargarEventosUsuario();
            actualizarEstadisticas();
        } else {
            alert('Error al eliminar el evento');
        }
    }
}

// ACTUALIZAR ESTADÍSTICAS
function actualizarEstadisticas() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    const eventos = listarEventos();

    let totalEventos = 0;

    if (userLogged === 'admin') {
        totalEventos = eventos.length;
    } else {
        totalEventos = eventos.filter(evento => evento.creadoPor === userEmail).length;
    }

    document.getElementById('total-eventos-usuario').textContent = totalEventos;
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        cerrarModal();
    }
});
