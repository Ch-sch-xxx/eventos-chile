// js/perfil_admin.js - ARCHIVO NUEVO COMPLETO

// Regiones y comunas (reutilizando de auth.js)
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
        // Datos del admin hardcodeado
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
        // Usuario registrado
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const usuario = usuarios.find(u => u.email === userEmail);
        userData = usuario || {};

        document.getElementById('rol-usuario').textContent = 'Usuario';
        document.getElementById('titulo-eventos').textContent = 'Mis Eventos Creados';
        document.getElementById('enlace-admin').style.display = 'none';
    }

    // Mostrar en la vista
    document.getElementById('nombre-usuario').textContent = userData.name || 'Usuario';
    document.getElementById('correo-usuario').textContent = userData.email || userEmail;
    document.getElementById('vista-nombre').textContent = userData.name || 'No registrado';
    document.getElementById('vista-correo').textContent = userData.email || userEmail;
    document.getElementById('vista-rut').textContent = userData.rut || 'No registrado';
    document.getElementById('vista-region').textContent = userData.region || 'No registrada';
    document.getElementById('vista-comuna').textContent = userData.comuna || 'No registrada';

    // Prellenar formulario
    document.getElementById('nombre').value = userData.name || '';
    document.getElementById('correo').value = userData.email || userEmail;
    document.getElementById('rut').value = userData.rut || '';

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

// CARGAR COMUNAS
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

// VALIDAR RUT (misma función que en auth.js)
function validarRUTCompleto(rut) {
    if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;

    const tmp = rut.split('-');
    const digv = tmp[1].toLowerCase();
    const rutNum = tmp[0];

    return calcularDV(rutNum) === digv;
}

function calcularDV(rut) {
    let suma = 0;
    let multiplicador = 2;

    for (let i = rut.length - 1; i >= 0; i--) {
        suma += parseInt(rut.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dv = 11 - (suma % 11);
    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
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
        const eventosUsuario = contarEventosUsuario(userEmail);
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
            localStorage.removeItem('user-logged');
            localStorage.removeItem('user-email');
            localStorage.removeItem('user-data');
            alert('Sesión cerrada exitosamente');
            window.location.href = 'auth.html';
        }
    });
}

// GUARDAR PERFIL
function guardarPerfil(e) {
    e.preventDefault();

    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const rut = document.getElementById('rut').value.trim();
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    // Validaciones
    if (!nombre || nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return;
    }

    if (!correo.includes('@')) {
        alert('Ingresa un email válido');
        return;
    }

    if (rut && !validarRUTCompleto(rut)) {
        alert('Formato de RUT inválido. Usar formato: 12345678-9');
        return;
    }

    if (!region || !comuna) {
        alert('Selecciona región y comuna');
        return;
    }

    const nuevosDatos = {
        name: nombre,
        email: correo,
        rut: rut,
        region: region,
        comuna: comuna,
        fechaActualizacion: new Date().toISOString()
    };

    if (userLogged !== 'admin') {
        // Usuario normal: actualizar en usuarios-chile
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const indiceUsuario = usuarios.findIndex(u => u.email === userEmail);

        if (indiceUsuario !== -1) {
            usuarios[indiceUsuario] = { ...usuarios[indiceUsuario], ...nuevosDatos };
            localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
        }
    }

    // Actualizar user-data para ambos tipos
    localStorage.setItem('user-data', JSON.stringify(nuevosDatos));

    alert('Perfil actualizado exitosamente');

    document.getElementById('datos-perfil').classList.add('oculto');
    document.getElementById('datos-actuales').classList.remove('oculto');
    cargarDatosUsuario();
}
