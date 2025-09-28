// FUNCIONES IMPORTADAS DE CRUD_EVENTOS.JS Y AUTH.JS
function contarEventosUsuario(email) {
    const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
    return eventos.filter(evento => evento.creadoPor === email).length;
}

function contarTotalUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}

function validarRUTCompleto(rut) {
    if (!rut) return false;
    const rutLimpio = rut.replace(/[^0-9kK-]/g, '');
    return /^[0-9]+-[0-9kK]$/i.test(rutLimpio);
}

// DATOS Y CONFIGURACIÓN
const regionesYcomunas = {
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
    "O'Higgins": ["Rancagua", "San Fernando", "Machalí"]
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    if (!verificarAcceso()) return;

    cargarDatosUsuario();
    cargarRegiones();
    cargarEventosUsuario();
    actualizarEstadisticas();
    configurarListeners();
});

// VERIFICAR ACCESO
function verificarAcceso() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    if (!userLogged || !userEmail) {
        alert('Debes iniciar sesión para acceder al perfil');
        window.location.href = 'auth.html';
        return false;
    }

    if (userLogged !== 'admin' && userLogged !== 'usuario') {
        alert('Sesión inválida');
        window.location.href = 'auth.html';
        return false;
    }

    return true;
}

// CARGAR DATOS DEL USUARIO
function cargarDatosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    let userData = {};

    if (userLogged === 'admin') {
        userData = {
            name: 'Administrador Sistema',
            email: 'ad@ad.com',
            region: 'Región Metropolitana',
            comuna: 'Santiago',
            fotoUrl: 'imagenes/ICONOperfil.png'
        };

        document.getElementById('rol-usuario').textContent = 'Administrador';
        document.getElementById('titulo-eventos').textContent = 'Todos los Eventos del Sistema';

        const enlaceAdmin = document.getElementById('enlace-admin');
        if (enlaceAdmin) {
            enlaceAdmin.textContent = 'Panel Admin';
        }
    } else {
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const usuario = usuarios.find(u => u.email === userEmail);

        userData = usuario || {
            name: 'Usuario Sin Nombre',
            email: userEmail,
            fotoUrl: 'imagenes/ICONOperfil.png'
        };

        document.getElementById('rol-usuario').textContent = 'Usuario';
        document.getElementById('titulo-eventos').textContent = 'Mis Eventos Creados';

        const enlaceAdmin = document.getElementById('enlace-admin');
        if (enlaceAdmin) {
            enlaceAdmin.textContent = 'Mi Gestor';
        }
    }

    // CARGAR EN INTERFAZ - Vista
    document.getElementById('nombre-usuario').textContent = userData.name || 'Usuario';
    document.getElementById('correo-usuario').textContent = userData.email || userEmail;
    document.getElementById('vista-nombre').textContent = userData.name || 'No registrado';
    document.getElementById('vista-correo').textContent = userData.email || userEmail;
    document.getElementById('vista-rut').textContent = userData.rut || 'No registrado';
    document.getElementById('vista-region').textContent = userData.region || 'No registrada';
    document.getElementById('vista-comuna').textContent = userData.comuna || 'No registrada';

    // CARGAR EN FORMULARIO - Edición
    document.getElementById('nombre').value = userData.name || '';
    document.getElementById('correo').value = userData.email || userEmail;
    document.getElementById('foto-url').value = userData.fotoUrl || '';

    // CARGAR FOTO ACTUAL
    const imagenPerfil = document.querySelector('.imagen-perfil');
    if (imagenPerfil && userData.fotoUrl) {
        imagenPerfil.src = userData.fotoUrl;
    }

    // CARGAR REGIONES DESPUÉS DE CARGAR DATOS
    setTimeout(() => {
        if (userData.region) {
            const selectRegion = document.getElementById('region');
            if (selectRegion) {
                selectRegion.value = userData.region;
                cargarComunasPorRegion(userData.region);

                setTimeout(() => {
                    if (userData.comuna) {
                        const selectComuna = document.getElementById('comuna');
                        if (selectComuna) {
                            selectComuna.value = userData.comuna;
                        }
                    }
                }, 300);
            }
        }
    }, 200);
}

// CARGAR REGIONES
function cargarRegiones() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;

    regionSelect.innerHTML = '<option value="">Selecciona región</option>';
    Object.keys(regionesYcomunas).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

// CARGAR COMUNAS
function cargarComunasPorRegion(region) {
    const comunaSelect = document.getElementById('comuna');
    if (!comunaSelect) return;

    comunaSelect.innerHTML = '<option value="">Selecciona comuna</option>';

    if (region && regionesYcomunas[region]) {
        regionesYcomunas[region].forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

// CARGAR EVENTOS DEL USUARIO
function cargarEventosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
    const container = document.getElementById('lista-eventos-perfil');

    if (!container) return;

    container.innerHTML = '';
    let eventosUsuario = [];

    if (userLogged === 'admin') {
        eventosUsuario = eventos;
    } else {
        eventosUsuario = eventos.filter(evento => evento.creadoPor === userEmail);
    }

    if (eventosUsuario.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #666; font-style: italic; padding: 2rem; background: #f9f9f9; border-radius: 8px; grid-column: 1 / -1;">
                ${userLogged === 'admin' ? 'No hay eventos en el sistema' : 'No has creado eventos aún. ¡Crea tu primer evento!'}
            </p>`;
        return;
    }

    eventosUsuario.forEach(evento => {
        const eventoDiv = document.createElement('div');
        eventoDiv.className = 'evento-perfil-item';
        const fechaCreacion = evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleDateString() : 'N/A';
        const autor = evento.creadoPor || 'Sistema';

        eventoDiv.innerHTML = `
            <div class="evento-titulo">${evento.titulo}</div>
            <div class="evento-fecha">📅 ${evento.fecha}</div>
            <div class="evento-tipo" style="color: var(--acento); font-size: 0.9rem;">🏷️ ${evento.tipo}</div>
            <div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">📍 ${evento.lugar}</div>
            ${userLogged === 'admin' ? `<div style="font-size: 0.75rem; color: var(--primario); margin-top: 0.3rem;">👤 Creado por: ${autor}</div>` : ''}
            <div style="font-size: 0.75rem; color: #999; margin-top: 0.3rem;">📆 Creado: ${fechaCreacion}</div>
        `;
        container.appendChild(eventoDiv);
    });
}

// ACTUALIZAR ESTADÍSTICAS
function actualizarEstadisticas() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    if (userLogged === 'admin') {
        const totalEventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]').length;
        const totalUsuarios = contarTotalUsuarios();

        document.getElementById('eventos-creados').textContent = totalEventos;
        document.getElementById('total-usuarios').textContent = totalUsuarios;

        const statUsuarios = document.getElementById('stat-usuarios');
        if (statUsuarios) {
            statUsuarios.style.display = 'block';
        }
    } else {
        const eventosUsuario = contarEventosUsuario(userEmail);
        document.getElementById('eventos-creados').textContent = eventosUsuario;

        const statUsuarios = document.getElementById('stat-usuarios');
        if (statUsuarios) {
            statUsuarios.style.display = 'none';
        }
    }
}

// CONFIGURAR LISTENERS
function configurarListeners() {
    // BOTÓN EDITAR PERFIL
    const btnEditar = document.getElementById('btn-editar-perfil');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            document.getElementById('datos-actuales').classList.add('oculto');
            document.getElementById('datos-perfil').classList.remove('oculto');
        });
    }

    // BOTÓN CANCELAR
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            document.getElementById('datos-perfil').classList.add('oculto');
            document.getElementById('datos-actuales').classList.remove('oculto');
            cargarDatosUsuario();
        });
    }

    // CAMBIO DE REGIÓN
    const selectRegion = document.getElementById('region');
    if (selectRegion) {
        selectRegion.addEventListener('change', function() {
            cargarComunasPorRegion(this.value);
        });
    }

    // FORMULARIO GUARDAR PERFIL
    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', guardarPerfil);
    }

    // CERRAR SESIÓN
    const btnCerrarSesion = document.getElementById('cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();

            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                localStorage.removeItem('user-logged');
                localStorage.removeItem('user-email');
                localStorage.removeItem('user-data');

                alert('Sesión cerrada exitosamente');
                window.location.replace('auth.html');
            }
        });
    }

    // PREVIEW FOTO URL
    const fotoUrlInput = document.getElementById('foto-url');
    if (fotoUrlInput) {
        fotoUrlInput.addEventListener('change', function() {
            const url = this.value.trim();
            if (url) {
                const imagenPerfil = document.querySelector('.imagen-perfil');
                if (imagenPerfil) {
                    imagenPerfil.src = url;
                }
            }
        });
    }
}

// GUARDAR PERFIL
function guardarPerfil(e) {
    e.preventDefault();

    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    // OBTENER DATOS DEL FORMULARIO
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const fotoUrl = document.getElementById('foto-url').value.trim();
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    // VALIDACIONES
    if (!nombre || nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return;
    }

    if (!correo || !correo.includes('@') || !correo.includes('.')) {
        alert('Ingresa un email válido');
        return;
    }

    if (!region || !comuna) {
        alert('Selecciona región y comuna');
        return;
    }

    // CREAR OBJETO CON NUEVOS DATOS
    const nuevosDatos = {
        name: nombre,
        email: correo,
        region: region,
        comuna: comuna,
        fotoUrl: fotoUrl || 'imagenes/ICONOperfil.png',
        fechaActualizacion: new Date().toISOString()
    };

    try {
        // GUARDAR SEGÚN EL ROL
        if (userLogged === 'admin') {
            localStorage.setItem('user-data', JSON.stringify(nuevosDatos));
        } else {
            const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
            const indiceUsuario = usuarios.findIndex(u => u.email === userEmail);

            if (indiceUsuario !== -1) {
                const usuarioOriginal = usuarios[indiceUsuario];
                usuarios[indiceUsuario] = {
                    ...usuarioOriginal,
                    ...nuevosDatos,
                    rut: usuarioOriginal.rut,
                    password: usuarioOriginal.password,
                    fechaRegistro: usuarioOriginal.fechaRegistro
                };

                localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
                localStorage.setItem('user-data', JSON.stringify(usuarios[indiceUsuario]));
            } else {
                alert('Error: Usuario no encontrado');
                return;
            }
        }

        // ACTUALIZAR EMAIL SI CAMBIÓ
        if (correo !== userEmail) {
            localStorage.setItem('user-email', correo);
        }

        alert(' Perfil actualizado exitosamente');

        document.getElementById('datos-perfil').classList.add('oculto');
        document.getElementById('datos-actuales').classList.remove('oculto');

        cargarDatosUsuario();
        actualizarEstadisticas();

    } catch (error) {
        alert('Error al guardar el perfil. Inténtalo de nuevo.');
    }
}
