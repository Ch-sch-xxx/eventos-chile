// js/perfil_usuario.js - ARCHIVO NUEVO COMPLETO

// Regiones y comunas
const regionesYcomunas = {
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
    "O'Higgins": ["Rancagua", "San Fernando", "Machalí"]
};

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    verificarAcceso();
    cargarDatosUsuario();
    cargarRegiones();
    cargarEventosUsuario();
    actualizarEstadisticas();
    configurarListeners();
    configurarCambioFoto();
});

// VERIFICAR ACCESO
function verificarAcceso() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    if (!userLogged || !userEmail) {
        alert('Debes iniciar sesión para acceder al perfil');
        window.location.href = 'auth.html';
        return;
    }
}

// CARGAR DATOS DEL USUARIO
function cargarDatosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    let userData = {};

    if (userLogged === 'admin') {
        // Admin hardcodeado
        userData = {
            name: 'Administrador Sistema',
            email: 'ad@ad.com',
            rut: '12.345.678-9',
            region: 'Región Metropolitana',
            comuna: 'Santiago'
        };
        document.getElementById('rol-usuario').textContent = 'Administrador';
        document.getElementById('titulo-eventos').textContent = 'Todos los Eventos del Sistema';
        document.getElementById('enlace-admin').style.display = 'inline-block';
    } else {
        // Usuario registrado - CORREGIR obtención de datos
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const usuario = usuarios.find(u => u.email === userEmail);

        if (!usuario) {
            alert('Error: Usuario no encontrado');
            localStorage.clear();
            window.location.href = 'auth.html';
            return;
        }

        userData = usuario;
        document.getElementById('rol-usuario').textContent = 'Usuario';
        document.getElementById('titulo-eventos').textContent = 'Mis Eventos Creados';
        document.getElementById('enlace-admin').style.display = 'none';
    }

    // MOSTRAR DATOS EN LA VISTA
    document.getElementById('nombre-usuario').textContent = userData.name || 'Usuario';
    document.getElementById('correo-usuario').textContent = userData.email || userEmail;
    document.getElementById('vista-nombre').textContent = userData.name || 'No registrado';
    document.getElementById('vista-correo').textContent = userData.email || userEmail;
    document.getElementById('vista-rut').textContent = userData.rut || 'No registrado';
    document.getElementById('vista-region').textContent = userData.region || 'No registrada';
    document.getElementById('vista-comuna').textContent = userData.comuna || 'No registrada';

    // PRELLENAR FORMULARIO (RUT readonly)
    document.getElementById('nombre').value = userData.name || '';
    document.getElementById('correo').value = userData.email || userEmail;
    document.getElementById('rut').value = userData.rut || ''; // READONLY

    if (userData.region) {
        setTimeout(() => {
            document.getElementById('region').value = userData.region;
            cargarComunasPorRegion(userData.region);
            setTimeout(() => {
                document.getElementById('comuna').value = userData.comuna || '';
            }, 100);
        }, 100);
    }
}

// CARGAR REGIONES
function cargarRegiones() {
    const regionSelect = document.getElementById('region');
    regionSelect.innerHTML = '<option value="">Selecciona región</option>';

    Object.keys(regionesYcomunas).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

// CARGAR COMUNAS POR REGIÓN
function cargarComunasPorRegion(region) {
    const comunaSelect = document.getElementById('comuna');
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

// CONFIGURAR CAMBIO DE FOTO
function configurarCambioFoto() {
    const btnCambiarFoto = document.getElementById('btn-cambiar-foto');
    const inputFoto = document.getElementById('input-cambiar-foto');
    const imagenDisplay = document.getElementById('imagen-perfil-display');

    // Evento del botón
    btnCambiarFoto.addEventListener('click', () => {
        inputFoto.click();
    });

    // Evento del input file
    inputFoto.addEventListener('change', function(e) {
        const file = e.target.files[0];

        if (file) {
            // Validar que sea imagen
            if (!file.type.includes('image')) {
                alert('Solo se permiten archivos de imagen');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es muy grande. Máximo 5MB');
                return;
            }

            // Crear FileReader para preview
            const reader = new FileReader();
            reader.onload = function(e) {
                imagenDisplay.src = e.target.result;

                // Guardar imagen en localStorage (solo para demo)
                const userEmail = localStorage.getItem('user-email');
                localStorage.setItem(`foto-perfil-${userEmail}`, e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Cargar foto guardada si existe
    const userEmail = localStorage.getItem('user-email');
    const fotoGuardada = localStorage.getItem(`foto-perfil-${userEmail}`);
    if (fotoGuardada) {
        imagenDisplay.src = fotoGuardada;
    }
}

// CARGAR EVENTOS DEL USUARIO
function cargarEventosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
    const container = document.getElementById('lista-eventos-perfil');

    container.innerHTML = '';

    let eventosUsuario = [];

    if (userLogged === 'admin') {
        eventosUsuario = eventos;
    } else {
        eventosUsuario = eventos.filter(evento => evento.creadoPor === userEmail);
    }

    if (eventosUsuario.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No hay eventos para mostrar</p>';
        return;
    }

    eventosUsuario.forEach(evento => {
        const eventoDiv = document.createElement('div');
        eventoDiv.className = 'evento-perfil-item';
        eventoDiv.innerHTML = `
            <div class="evento-titulo">${evento.titulo}</div>
            <div class="evento-fecha">📅 ${evento.fecha}</div>
            <div class="evento-tipo" style="color: var(--acento); font-size: 0.9rem;">🏷️ ${evento.tipo}</div>
            <div style="font-size: 0.8rem; color: #888; margin-top: 0.5rem;">
                📍 ${evento.lugar}
            </div>
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
        const totalUsuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]').length;

        document.getElementById('eventos-creados').textContent = totalEventos;
        document.getElementById('total-usuarios').textContent = totalUsuarios;
        document.getElementById('stat-usuarios').style.display = 'block';
    } else {
        const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
        const eventosUsuario = eventos.filter(evento => evento.creadoPor === userEmail).length;

        document.getElementById('eventos-creados').textContent = eventosUsuario;
        document.getElementById('stat-usuarios').style.display = 'none';
    }
}

// CONFIGURAR LISTENERS
function configurarListeners() {
    // Editar perfil
    document.getElementById('btn-editar-perfil').addEventListener('click', () => {
        document.getElementById('datos-actuales').classList.add('oculto');
        document.getElementById('datos-perfil').classList.remove('oculto');
    });

    // Cancelar edición
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        document.getElementById('datos-perfil').classList.add('oculto');
        document.getElementById('datos-actuales').classList.remove('oculto');
        cargarDatosUsuario();
    });

    // Cambio región
    document.getElementById('region').addEventListener('change', function() {
        cargarComunasPorRegion(this.value);
    });

    // Formulario
    document.getElementById('form-perfil').addEventListener('submit', guardarPerfil);

    // Cerrar sesión
    document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            localStorage.clear();
            alert('Sesión cerrada exitosamente');
            window.location.href = 'auth.html';
        }
    });
}

// GUARDAR PERFIL (SIN MODIFICAR RUT)
function guardarPerfil(e) {
    e.preventDefault();

    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    // Validaciones básicas
    if (!nombre || nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return;
    }

    if (!correo.includes('@')) {
        alert('Ingresa un email válido');
        return;
    }

    if (!region || !comuna) {
        alert('Selecciona región y comuna');
        return;
    }

    if (userLogged !== 'admin') {
        // Usuario normal: actualizar en usuarios-chile
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const indiceUsuario = usuarios.findIndex(u => u.email === userEmail);

        if (indiceUsuario !== -1) {
            // MANTENER RUT original y otros datos críticos
            usuarios[indiceUsuario] = {
                ...usuarios[indiceUsuario], // Mantener datos originales
                name: nombre,
                email: correo,
                region: region,
                comuna: comuna,
                fechaActualizacion: new Date().toISOString()
            };
            localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));

            // Actualizar user-data también
            localStorage.setItem('user-data', JSON.stringify(usuarios[indiceUsuario]));

            alert('Perfil actualizado exitosamente');

            // Ocultar formulario y mostrar vista
            document.getElementById('datos-perfil').classList.add('oculto');
            document.getElementById('datos-actuales').classList.remove('oculto');
            cargarDatosUsuario();
        } else {
            alert('Error: No se pudo actualizar el perfil');
        }
    }
}
