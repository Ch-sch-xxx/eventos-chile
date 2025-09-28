// CONTROL DE ACCESO Y INICIO CARGA - MODIFICADO PARA ADMITIR ADMIN Y USUARIO
document.addEventListener('DOMContentLoaded', () => {
    // Control de acceso - CAMBIO CLAVE: ahora permite admin Y usuario
    const userLogged = localStorage.getItem('user-logged');
    if (userLogged !== 'admin' && userLogged !== 'usuario') {
        alert('Debes iniciar sesión para acceder');
        return window.location.href = 'auth.html';
    }

    // Personalizar interfaz según el rol
    personalizarInterfazSegunRol();
    renderTablaEventos();
    configurarListeners();
});

let editandoIndice = null;

// NUEVA FUNCIÓN: Personalizar la interfaz según el rol del usuario
function personalizarInterfazSegunRol() {
    const userLogged = localStorage.getItem('user-logged');
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}');
    const userEmail = localStorage.getItem('user-email');

    // Cambiar título según el rol
    const titulo = document.querySelector('header h1');
    const tituloSeccion = document.querySelector('#listar-eventos h2');

    if (userLogged === 'admin') {
        titulo.textContent = 'Panel Admin · Eventos Chile';
        tituloSeccion.textContent = 'Gestión de Eventos (Administrador)';
    } else {
        titulo.textContent = 'Mi Gestor · Eventos Chile';
        tituloSeccion.textContent = 'Mis Eventos Creados';
    }
}

// CONFIG LISTENERS Y MODAL
function configurarListeners() {
    // Navegación crear evento
    document.getElementById('nav-crear').addEventListener('click', e => {
        e.preventDefault();
        editandoIndice = null;
        limpiarFormulario();
        togglearSecciones('crear-evento');
    });

    // Navegación listar eventos
    document.getElementById('nav-listar').addEventListener('click', e => {
        e.preventDefault();
        togglearSecciones('listar-eventos');
        renderTablaEventos();
    });

    // Envío del formulario (crear o editar)
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

    // Botón perfil - redirige a perfil_admin.html
    const btnPerfil = document.getElementById('enlace-perfil');
    if (btnPerfil) {
        btnPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'perfil_admin.html';
        });
    }

    // Cerrar sesión
    const btnCerrarSesion = document.getElementById('cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('user-logged');
                localStorage.removeItem('user-email');
                localStorage.removeItem('user-data');
                alert('Sesión cerrada correctamente');
                window.location.replace('auth.html');
            }
        });
    }

    // Modal detalles: cerrar
    const cerrarModal = document.getElementById('cerrar-modal');
    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            document.getElementById('modal-detalle').classList.add('oculto');
        });
    }

    // Cerrar modal haciendo clic fuera
    document.getElementById('modal-detalle').addEventListener('click', e => {
        if (e.target.id === 'modal-detalle') {
            e.target.classList.add('oculto');
        }
    });
}

// Resto de funciones igual (sin console.log)...
// Mostrar u ocultar secciones
function togglearSecciones(seccionVisible) {
    document.getElementById('crear-evento').classList.toggle('oculto', seccionVisible !== 'crear-evento');
    document.getElementById('listar-eventos').classList.toggle('oculto', seccionVisible !== 'listar-eventos');
}

// Limpia el formulario y botón
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
    const descripcion = document.getElementById('descripcion').value.trim() || 'Sin descripción';
    const capacidad = document.getElementById('capacidad').value || '100';
    const precio = document.getElementById('precio').value.trim() || 'Gratis';

    // Validaciones
    if (!titulo || titulo.length < 3) {
        return alert('El título debe tener al menos 3 caracteres');
    }
    if (!fecha) {
        return alert('Selecciona una fecha válida');
    }
    if (!lugar || lugar.length < 3) {
        return alert('El lugar debe tener al menos 3 caracteres');
    }
    if (!tipo) {
        return alert('Selecciona el tipo de evento');
    }

    // Validar fecha no sea en el pasado
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaEvento < hoy) {
        return alert('La fecha del evento no puede ser anterior a hoy');
    }

    const eventoData = {
        titulo,
        fecha,
        lugar,
        tipo,
        imagen,
        descripcion,
        capacidad: parseInt(capacidad),
        precio
    };

    try {
        if (editandoIndice !== null) {
            const resultado = editarEvento(editandoIndice, eventoData);
            if (resultado) {
                alert('Evento editado exitosamente!');
                editandoIndice = null;
                limpiarFormulario();
                document.getElementById('nav-listar').click();
            } else {
                alert('No tienes permisos para editar este evento');
            }
        } else {
            const resultado = crearEvento(eventoData);
            if (resultado) {
                alert('Evento creado exitosamente!');
                limpiarFormulario();
                document.getElementById('nav-listar').click();
            } else {
                alert('Error al crear el evento');
            }
        }
    } catch (error) {
        alert('Error al guardar el evento');
    }
}

// Precarga campos para edición
function iniciarEdicion(idx) {
    const eventos = obtenerMisEventos();
    const evento = eventos[idx];

    if (!evento) {
        alert('Evento no encontrado');
        return;
    }

    // Verificar permisos antes de editar
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');

    if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
        alert('Solo puedes editar tus propios eventos');
        return;
    }

    // Cargar datos en el formulario
    document.getElementById('titulo').value = evento.titulo;
    document.getElementById('fecha').value = evento.fecha;
    document.getElementById('lugar').value = evento.lugar;
    document.getElementById('tipo').value = evento.tipo;
    document.getElementById('imagen').value = evento.imagen;
    document.getElementById('descripcion').value = evento.descripcion || '';
    document.getElementById('capacidad').value = evento.capacidad || '';
    document.getElementById('precio').value = evento.precio || '';

    // Encontrar índice real del evento en la lista completa
    const todosLosEventos = listarEventos();
    editandoIndice = todosLosEventos.findIndex(e => e.id === evento.id);

    document.querySelector('#form-crear button').textContent = 'Guardar Cambios';
    togglearSecciones('crear-evento');
}

// Elimina evento
function borrarEvento(idx) {
    const eventos = obtenerMisEventos();
    const evento = eventos[idx];

    if (!evento) {
        alert('Evento no encontrado');
        return;
    }

    // Verificar permisos antes de eliminar
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');

    if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
        alert('Solo puedes eliminar tus propios eventos');
        return;
    }

    if (confirm(`¿Eliminar "${evento.titulo}"?`)) {
        try {
            // Encontrar índice real del evento en la lista completa
            const todosLosEventos = listarEventos();
            const indiceReal = todosLosEventos.findIndex(e => e.id === evento.id);

            const resultado = eliminarEvento(indiceReal);
            if (resultado) {
                renderTablaEventos();
                alert('Evento eliminado correctamente');
            } else {
                alert('Error: No se pudo eliminar el evento');
            }
        } catch (error) {
            alert('Error al eliminar el evento');
        }
    }
}

// Mostrar modal de detalles del evento
function verEvento(idx) {
    const eventos = obtenerMisEventos();
    const evento = eventos[idx];

    if (!evento) {
        alert('Evento no encontrado');
        return;
    }

    // Cargar datos en el modal
    document.getElementById('detalle-img').src = evento.imagen;
    document.getElementById('detalle-titulo').textContent = evento.titulo;
    document.getElementById('detalle-fecha').textContent = evento.fecha;
    document.getElementById('detalle-lugar').textContent = evento.lugar;
    document.getElementById('detalle-tipo').textContent = evento.tipo;
    document.getElementById('detalle-descripcion').textContent = evento.descripcion || 'Sin descripción';
    document.getElementById('detalle-capacidad').textContent = evento.capacidad || 'No informada';
    document.getElementById('detalle-precio').textContent = evento.precio || 'Gratis';

    document.getElementById('modal-detalle').classList.remove('oculto');
}

// Renderiza la tabla
function renderTablaEventos() {
    const eventos = obtenerMisEventos();
    const tbody = document.querySelector('#listar-eventos tbody');
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    tbody.innerHTML = '';

    if (eventos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem; color: #666;">No tienes eventos creados aún. ¡Crea tu primer evento!</td></tr>';
        return;
    }

    eventos.forEach((evento, i) => {
        const fechaCreacion = evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleDateString() : 'N/A';
        const autor = evento.creadoPor || 'Sistema';
        const esMiEvento = evento.creadoPor === userEmail;
        const puedeEditar = userLogged === 'admin' || esMiEvento;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i+1}</td>
          <td><img src="${evento.imagen}" style="width:48px;height:48px;object-fit:cover;border-radius:4px;" alt="Evento" onerror="this.src='imagenes/eventosIMG.png'"></td>
          <td>
            <strong>${evento.titulo}</strong><br>
            <small style="color: #666;">Por: ${autor}</small>
            ${esMiEvento ? '<br><span style="color: var(--primario); font-size: 0.75rem;">● Tu evento</span>' : ''}
          </td>
          <td>${evento.fecha}</td>
          <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${evento.lugar}</td>
          <td><span style="background: var(--acento); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${evento.tipo}</span></td>
          <td>
            <button class="btn-ver" data-idx="${i}" title="Ver detalles">Ver</button>
            ${puedeEditar ? `<button class="btn-editar" data-idx="${i}" title="Editar evento">Editar</button>` : ''}
            ${puedeEditar ? `<button class="btn-eliminar" data-idx="${i}" title="Eliminar evento">Eliminar</button>` : ''}
          </td>`;
        tbody.appendChild(tr);
    });
}
