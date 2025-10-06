// CONTROL DE ACCESO Y CARGA INICIAL - permite admin y usuario
document.addEventListener('DOMContentLoaded', () => {
    // Control de acceso - verifica sesión activa
    const userLogged = localStorage.getItem('user-logged');
    if (userLogged !== 'admin' && userLogged !== 'usuario') {
        alert('Debes iniciar sesión para acceder');
        return window.location.href = 'auth.html';
    }

    // Personalizar interfaz según el rol
    personalizarInterfazSegunRol();

    // Renderizar tabla de eventos
    renderTablaEventos();

    // Configurar event listeners
    configurarListeners();
});

let editandoIndice = null; // Variable para controlar si estamos editando

// Personalizar la interfaz según el rol del usuario (admin o usuario regular)
function personalizarInterfazSegunRol() {
    const userLogged = localStorage.getItem('user-logged');
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}');

    // Cambiar título del header según el rol
    const titulo = document.querySelector('#h1_titulo');
    const tituloSeccion = document.querySelector('#listar-eventos .card-title');

    if (userLogged === 'admin') {
        if (titulo) titulo.textContent = 'Panel Admin · Eventos Chile';
        if (tituloSeccion) tituloSeccion.textContent = 'Gestión de Eventos (Administrador)';
    } else {
        if (titulo) titulo.textContent = 'Mi Gestor · Eventos Chile';
        if (tituloSeccion) tituloSeccion.textContent = 'Mis Eventos Creados';
    }
}

// Configurar todos los event listeners
function configurarListeners() {
    // Navegación: botón crear evento
    const navCrear = document.getElementById('nav-crear');
    if (navCrear) {
        navCrear.addEventListener('click', e => {
            e.preventDefault();
            editandoIndice = null;
            limpiarFormulario();
            togglearSecciones('crear-evento');
            // Marcar como activo en sidebar
            actualizarNavActivo('nav-crear');
        });
    }

    // Navegación: botón listar eventos
    const navListar = document.getElementById('nav-listar');
    if (navListar) {
        navListar.addEventListener('click', e => {
            e.preventDefault();
            togglearSecciones('listar-eventos');
            renderTablaEventos();
            // Marcar como activo en sidebar
            actualizarNavActivo('nav-listar');
        });
    }

    // Envío del formulario (crear o editar)
    const formCrear = document.getElementById('form-crear');
    if (formCrear) {
        formCrear.addEventListener('submit', e => {
            e.preventDefault();
            procesarFormulario();
        });
    }

    // Event delegation para acciones de tabla (ver, editar, eliminar)
    const tbody = document.querySelector('#listar-eventos tbody');
    if (tbody) {
        tbody.addEventListener('click', e => {
            const idx = parseInt(e.target.dataset.idx);

            if (e.target.classList.contains('btn-ver')) return verEvento(idx);
            if (e.target.classList.contains('btn-editar')) return iniciarEdicion(idx);
            if (e.target.classList.contains('btn-eliminar')) return borrarEvento(idx);
        });
    }

    // Botón perfil - redirige a perfil_admin.html
    const btnPerfil = document.getElementById('enlace-perfil');
    if (btnPerfil) {
        btnPerfil.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = 'perfil_admin.html';
        });
    }

    // Botón cerrar sesión
    const btnCerrarSesion = document.getElementById('cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', e => {
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

    // Modal: botón cerrar con Bootstrap
    const cerrarModal = document.getElementById('cerrar-modal');
    if (cerrarModal) {
        cerrarModal.addEventListener('click', () => {
            // Usar API Bootstrap para cerrar modal correctamente
            const modalElement = document.getElementById('modal-detalle');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }
}

// Actualizar botón activo en sidebar
function actualizarNavActivo(idActivo) {
    // Remover clase activé de todos
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Agregar clase active al actual
    const linkActivo = document.getElementById(idActivo);
    if (linkActivo) {
        linkActivo.classList.add('active');
    }
}

// Mostrar u ocultar secciones (crear evento o listar eventos)
function togglearSecciones(seccionVisible) {
    const crearEvento = document.getElementById('crear-evento');
    const listarEventos = document.getElementById('listar-eventos');

    if (crearEvento) {
        crearEvento.classList.toggle('oculto', seccionVisible !== 'crear-evento');
    }
    if (listarEventos) {
        listarEventos.classList.toggle('oculto', seccionVisible !== 'listar-eventos');
    }
}

// Limpiar el formulario y resetear botón
function limpiarFormulario() {
    const form = document.getElementById('form-crear');
    const boton = document.querySelector('#form-crear button[type="submit"]');

    if (form) form.reset();
    if (boton) boton.textContent = 'Crear Evento';
}

// Procesar formulario: crear o editar evento
function procesarFormulario() {
    // Obtener valores del formulario
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

    // Validar que la fecha no sea en el pasado
    const fechaEvento = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaEvento < hoy) {
        return alert('La fecha del evento no puede ser anterior a hoy');
    }

    // Construir objeto evento
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
            // Modo edición
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
            // Modo creación
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
        console.error('Error al guardar evento:', error);
        alert('Error al guardar el evento');
    }
}

// Precargar datos en formulario para edición
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

    // Cambiar texto del botón y mostrar formulario
    const boton = document.querySelector('#form-crear button[type="submit"]');
    if (boton) boton.textContent = 'Guardar Cambios';

    togglearSecciones('crear-evento');
    actualizarNavActivo('nav-crear');
}

// Eliminar evento con confirmación
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
            console.error('Error al eliminar evento:', error);
            alert('Error al eliminar el evento');
        }
    }
}

// Mostrar modal con detalles del evento (usando Bootstrap Modal)
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

    // Mostrar modal usando Bootstrap API
    const modalElement = document.getElementById('modal-detalle');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Renderizar tabla con eventos del usuario (o todos si es admin)
function renderTablaEventos() {
    const eventos = obtenerMisEventos();
    const tbody = document.querySelector('#listar-eventos tbody');
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    if (!tbody) return;

    tbody.innerHTML = '';

    // Mensaje si no hay eventos
    if (eventos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    No tienes eventos creados aún. ¡Crea tu primer evento!
                </td>
            </tr>
        `;
        return;
    }

    // Generar fila por cada evento
    eventos.forEach((evento, i) => {
        const autor = evento.creadoPor || 'Sistema';
        const esMiEvento = evento.creadoPor === userEmail;
        const puedeEditar = userLogged === 'admin' || esMiEvento;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i+1}</td>
            <td>
                <img src="${evento.imagen}" 
                     alt="Evento" 
                     class="img-fluid rounded" 
                     style="width:60px; height:50px; object-fit:cover;"
                     onerror="this.src='imagenes/eventosIMG.png'">
            </td>
            <td>
                <strong>${evento.titulo}</strong><br>
                <small style="color: #666;">Por: ${autor}</small>
                ${esMiEvento ? '<br><span style="color: var(--primario); font-size: 0.75rem; font-weight: 600;">● Tu evento</span>' : ''}
            </td>
            <td>${evento.fecha}</td>
            <td style="max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${evento.lugar}
            </td>
            <td>
                <span class="badge" style="background: var(--acento); color: white; font-size: 0.8rem;">
                    ${evento.tipo}
                </span>
            </td>
            <td>
                <button class="btn-ver" data-idx="${i}" title="Ver detalles">Ver</button>
                ${puedeEditar ? `<button class="btn-editar" data-idx="${i}" title="Editar evento">Editar</button>` : ''}
                ${puedeEditar ? `<button class="btn-eliminar" data-idx="${i}" title="Eliminar evento">Eliminar</button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });
}
