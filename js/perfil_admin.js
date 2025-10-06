// FUNCIONES DE UTILIDAD - integradas con crud_eventos.js y auth.js
function contarEventosUsuario(email) {
    // Cuenta eventos creados por un usuario específico
    const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
    return eventos.filter(evento => evento.creadoPor === email).length;
}

function contarTotalUsuarios() {
    // Cuenta total de usuarios registrados en el sistema
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}

// DATOS DE REGIONES Y COMUNAS (igual que auth.js)
const regionesYcomunas = {
    "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Concón", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"],
    "O'Higgins": ["Rancagua", "San Fernando", "Machalí"]
};

// INICIALIZACIÓN - cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar acceso antes de cargar cualquier cosa
    if (!verificarAcceso()) return;

    // Cargar todos los componentes del perfil
    cargarDatosUsuario();
    cargarRegiones();
    cargarEventosUsuario();
    actualizarEstadisticas();
    configurarListeners();
});

// VERIFICAR ACCESO - protección de ruta (igual que gestion_admin.js)
function verificarAcceso() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    // Sin sesión activa, redirigir a login
    if (!userLogged || !userEmail) {
        alert('Debes iniciar sesión para acceder al perfil');
        window.location.href = 'auth.html';
        return false;
    }

    // Verificar que el rol sea válido (admin o usuario)
    if (userLogged !== 'admin' && userLogged !== 'usuario') {
        alert('Sesión inválida');
        window.location.href = 'auth.html';
        return false;
    }

    return true;
}

// CARGAR DATOS DEL USUARIO - con prioridad a user-data para persistencia
function cargarDatosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    let userData = {};

    console.log('=== DEBUG CARGA PERFIL ===');
    console.log('user-logged:', userLogged);
    console.log('user-email:', userEmail);

    // CASO ADMINISTRADOR
    if (userLogged === 'admin') {
        // Intentar cargar desde user-data primero (puede tener foto personalizada)
        const storedData = localStorage.getItem('user-data');

        if (storedData) {
            try {
                userData = JSON.parse(storedData);
                console.log('✅ Admin data cargado desde user-data:', userData);
            } catch (e) {
                console.error('❌ Error parsing user-data admin:', e);
                // Fallback a datos por defecto
                userData = {
                    name: 'Administrador Sistema',
                    email: 'ad@ad.com',
                    region: 'Región Metropolitana',
                    comuna: 'Santiago',
                    fotoUrl: 'imagenes/ICONOperfil.png'
                };
            }
        } else {
            // Primera vez, datos por defecto
            userData = {
                name: 'Administrador Sistema',
                email: 'ad@ad.com',
                region: 'Región Metropolitana',
                comuna: 'Santiago',
                fotoUrl: 'imagenes/ICONOperfil.png'
            };
            console.log('⚠️ Admin sin user-data, usando datos por defecto');
        }

        // Personalizar interfaz para admin
        document.getElementById('rol-usuario').textContent = 'Administrador';
        document.getElementById('titulo-eventos').textContent = 'Todos los Eventos del Sistema';

        const enlaceAdmin = document.getElementById('enlace-admin');
        if (enlaceAdmin) enlaceAdmin.textContent = 'Panel Admin';
    }
    // CASO USUARIO REGULAR
    else {
        // 1. Intentar cargar desde user-data (más rápido y confiable)
        const storedData = localStorage.getItem('user-data');

        if (storedData) {
            try {
                userData = JSON.parse(storedData);
                console.log('✅ Usuario data cargado desde user-data:', userData);
            } catch (e) {
                console.error('❌ Error parsing user-data usuario:', e);
            }
        }

        // 2. Si no hay user-data o está corrupto, buscar en el array
        if (!userData || !userData.email) {
            console.log('⚠️ No hay user-data válido, buscando en array usuarios-chile');
            const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
            const usuario = usuarios.find(u => u.email === userEmail);

            if (usuario) {
                userData = usuario;
                // Sincronizar user-data con el array
                localStorage.setItem('user-data', JSON.stringify(usuario));
                console.log('✅ Usuario encontrado en array y sincronizado:', usuario);
            } else {
                // Último recurso: datos mínimos
                userData = {
                    name: 'Usuario Sin Nombre',
                    email: userEmail,
                    fotoUrl: 'imagenes/ICONOperfil.png'
                };
                console.warn('⚠️ Usuario no encontrado, usando datos mínimos');
            }
        }

        // Personalizar interfaz para usuario
        document.getElementById('rol-usuario').textContent = 'Usuario';
        document.getElementById('titulo-eventos').textContent = 'Mis Eventos Creados';

        const enlaceAdmin = document.getElementById('enlace-admin');
        if (enlaceAdmin) enlaceAdmin.textContent = 'Mi Gestor';
    }

    // CARGAR EN INTERFAZ - Vista de solo lectura
    document.getElementById('nombre-usuario').textContent = userData.name || 'Usuario';
    document.getElementById('correo-usuario').textContent = userData.email || userEmail;
    document.getElementById('vista-nombre').textContent = userData.name || 'No registrado';
    document.getElementById('vista-correo').textContent = userData.email || userEmail;
    document.getElementById('vista-rut').textContent = userData.rut || 'No registrado';
    document.getElementById('vista-region').textContent = userData.region || 'No registrada';
    document.getElementById('vista-comuna').textContent = userData.comuna || 'No registrada';

    // CARGAR EN FORMULARIO - Campos editables
    document.getElementById('nombre').value = userData.name || '';
    document.getElementById('correo').value = userData.email || userEmail;
    document.getElementById('foto-url').value = userData.fotoUrl || '';

    // ACTUALIZAR IMAGEN DE PERFIL - con validación de URL
    const imagenesPerfil = document.querySelectorAll('.imagen-perfil');
    const fotoUrl = userData.fotoUrl || 'imagenes/ICONOperfil.png';

    console.log('📷 Cargando foto de perfil:', fotoUrl);

    imagenesPerfil.forEach(img => {
        img.src = fotoUrl;

        // Fallback si la imagen no carga
        img.onerror = function() {
            console.warn('⚠️ Error cargando imagen:', fotoUrl);
            this.src = 'imagenes/ICONOperfil.png';
        };

        // Log cuando carga correctamente
        img.onload = function() {
            console.log('✅ Imagen de perfil cargada correctamente');
        };
    });

    // CARGAR REGIÓN Y COMUNA EN SELECTS - con timeouts para asegurar carga
    setTimeout(() => {
        if (userData.region) {
            const selectRegion = document.getElementById('region');
            if (selectRegion) {
                selectRegion.value = userData.region;
                cargarComunasPorRegion(userData.region);

                // Cargar comuna después de que se carguen las opciones
                setTimeout(() => {
                    if (userData.comuna) {
                        const selectComuna = document.getElementById('comuna');
                        if (selectComuna) selectComuna.value = userData.comuna;
                    }
                }, 300);
            }
        }
    }, 200);
}

// CARGAR REGIONES EN SELECT - dinámicamente desde objeto
function cargarRegiones() {
    const regionSelect = document.getElementById('region');
    if (!regionSelect) return;

    // Limpiar y agregar opción por defecto
    regionSelect.innerHTML = '<option value="">Selecciona región</option>';

    // Agregar cada región como opción
    Object.keys(regionesYcomunas).forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });
}

// CARGAR COMUNAS SEGÚN REGIÓN SELECCIONADA - dinámico
function cargarComunasPorRegion(region) {
    const comunaSelect = document.getElementById('comuna');
    if (!comunaSelect) return;

    // Limpiar opciones actuales
    comunaSelect.innerHTML = '<option value="">Selecciona comuna</option>';

    // Cargar comunas de la región seleccionada
    if (region && regionesYcomunas[region]) {
        regionesYcomunas[region].forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

// CARGAR EVENTOS DEL USUARIO - usando Bootstrap grid
function cargarEventosUsuario() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');
    const eventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]');
    const container = document.getElementById('lista-eventos-perfil');

    if (!container) return;

    container.innerHTML = '';
    let eventosUsuario = [];

    // Admin ve todos los eventos, usuario solo los suyos
    if (userLogged === 'admin') {
        eventosUsuario = eventos;
    } else {
        eventosUsuario = eventos.filter(evento => evento.creadoPor === userEmail);
    }

    // Mensaje si no hay eventos
    if (eventosUsuario.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <p style="text-align: center; color: #666; font-style: italic; padding: 2rem; background: #f9f9f9; border-radius: 8px;">
                    ${userLogged === 'admin' ? 'No hay eventos en el sistema' : 'No has creado eventos aún. ¡Crea tu primer evento desde el panel!'}
                </p>
            </div>`;
        return;
    }

    // Generar tarjetas de eventos - con Bootstrap columns
    eventosUsuario.forEach(evento => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4'; // Responsive grid

        const eventoDiv = document.createElement('div');
        eventoDiv.className = 'evento-perfil-item';

        const fechaCreacion = evento.fechaCreacion
            ? new Date(evento.fechaCreacion).toLocaleDateString('es-CL')
            : 'N/A';
        const autor = evento.creadoPor || 'Sistema';

        eventoDiv.innerHTML = `
            <div class="evento-titulo">${evento.titulo}</div>
            <div class="evento-fecha">📅 ${evento.fecha}</div>
            <div class="evento-tipo">🏷️ ${evento.tipo}</div>
            <div style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">📍 ${evento.lugar}</div>
            ${userLogged === 'admin' ? `<div style="font-size: 0.8rem; color: var(--primario); margin-top: 0.4rem; font-weight: 500;">👤 ${autor}</div>` : ''}
            <div style="font-size: 0.75rem; color: #999; margin-top: 0.4rem;">📆 ${fechaCreacion}</div>
        `;

        col.appendChild(eventoDiv);
        container.appendChild(col);
    });
}

// ACTUALIZAR ESTADÍSTICAS - según rol del usuario
function actualizarEstadisticas() {
    const userLogged = localStorage.getItem('user-logged');
    const userEmail = localStorage.getItem('user-email');

    // ADMIN: muestra total de eventos y total de usuarios
    if (userLogged === 'admin') {
        const totalEventos = JSON.parse(localStorage.getItem('eventos-chile') || '[]').length;
        const totalUsuarios = contarTotalUsuarios();

        document.getElementById('eventos-creados').textContent = totalEventos;
        document.getElementById('total-usuarios').textContent = totalUsuarios;

        // Mostrar card de usuarios
        const statUsuarios = document.getElementById('stat-usuarios');
        if (statUsuarios) {
            statUsuarios.classList.remove('oculto');
        }
    }
    // USUARIO: solo muestra sus eventos, oculta card de usuarios
    else {
        const eventosUsuario = contarEventosUsuario(userEmail);
        document.getElementById('eventos-creados').textContent = eventosUsuario;

        // Ocultar card de usuarios
        const statUsuarios = document.getElementById('stat-usuarios');
        if (statUsuarios) {
            statUsuarios.classList.add('oculto');
        }
    }
}

// CONFIGURAR EVENT LISTENERS - todos los eventos de la página
function configurarListeners() {
    // BOTÓN: Editar perfil - muestra formulario, oculta vista
    const btnEditar = document.getElementById('btn-editar-perfil');
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            document.getElementById('datos-actuales').classList.add('oculto');
            document.getElementById('datos-perfil').classList.remove('oculto');
        });
    }

    // BOTÓN: Cancelar edición - oculta formulario, muestra vista
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            document.getElementById('datos-perfil').classList.add('oculto');
            document.getElementById('datos-actuales').classList.remove('oculto');
            // Recargar datos originales (cancela cambios)
            cargarDatosUsuario();
        });
    }

    // SELECT: Cambio de región - recarga comunas
    const selectRegion = document.getElementById('region');
    if (selectRegion) {
        selectRegion.addEventListener('change', function() {
            cargarComunasPorRegion(this.value);
        });
    }

    // FORM: Guardar perfil - validaciones y guardado
    const formPerfil = document.getElementById('form-perfil');
    if (formPerfil) {
        formPerfil.addEventListener('submit', guardarPerfil);
    }

    // BOTÓN: Cerrar sesión - confirmación y limpieza
    const btnCerrarSesion = document.getElementById('cerrar-sesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();

            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                // Limpiar localStorage
                localStorage.removeItem('user-logged');
                localStorage.removeItem('user-email');
                localStorage.removeItem('user-data');

                alert('Sesión cerrada exitosamente');
                // Redirigir a login sin historial (replace)
                window.location.replace('auth.html');
            }
        });
    }

    // INPUT: Preview foto URL - actualiza imagen en tiempo real
    const fotoUrlInput = document.getElementById('foto-url');
    if (fotoUrlInput) {
        fotoUrlInput.addEventListener('input', function() {
            const url = this.value.trim();

            if (url) {
                console.log('📷 Preview de imagen:', url);

                const imagenesPerfil = document.querySelectorAll('.imagen-perfil');
                imagenesPerfil.forEach(img => {
                    const urlAnterior = img.src;
                    img.src = url;

                    // Fallback si la URL no es válida
                    img.onerror = function() {
                        console.warn('⚠️ URL de imagen no válida:', url);
                        this.src = urlAnterior;
                    };
                });
            }
        });
    }
}

// GUARDAR PERFIL - validaciones y actualización en localStorage con persistencia garantizada
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

    // CONSTRUIR OBJETO - siempre incluye fotoUrl aunque esté vacío
    const nuevosDatos = {
        name: nombre,
        email: correo,
        region: region,
        comuna: comuna,
        fotoUrl: fotoUrl || 'imagenes/ICONOperfil.png', // ✅ Siempre tiene valor
        fechaActualizacion: new Date().toISOString()
    };

    try {
        // GUARDAR SEGÚN EL ROL
        if (userLogged === 'admin') {
            // Admin: guardar en user-data
            localStorage.setItem('user-data', JSON.stringify(nuevosDatos));
            console.log('✅ Admin data guardado:', nuevosDatos);
        } else {
            // Usuario: actualizar array
            const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
            const indiceUsuario = usuarios.findIndex(u => u.email === userEmail);

            if (indiceUsuario !== -1) {
                const usuarioOriginal = usuarios[indiceUsuario];

                // Mantener datos críticos (RUT, contraseña, fecha registro)
                usuarios[indiceUsuario] = {
                    ...usuarioOriginal,
                    ...nuevosDatos,
                    rut: usuarioOriginal.rut,
                    password: usuarioOriginal.password,
                    fechaRegistro: usuarioOriginal.fechaRegistro
                };

                // Guardar array actualizado
                localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
                localStorage.setItem('user-data', JSON.stringify(usuarios[indiceUsuario]));
                console.log('✅ Usuario data guardado:', usuarios[indiceUsuario]);
            } else {
                alert('Error: Usuario no encontrado en el sistema');
                return;
            }
        }

        // ACTUALIZAR EMAIL SI CAMBIÓ
        if (correo !== userEmail) {
            localStorage.setItem('user-email', correo);
        }

        alert('✅ Perfil actualizado exitosamente');

        // Volver a vista de solo lectura
        document.getElementById('datos-perfil').classList.add('oculto');
        document.getElementById('datos-actuales').classList.remove('oculto');

        // Recargar datos actualizados
        cargarDatosUsuario();
        actualizarEstadisticas();

    } catch (error) {
        console.error('❌ Error al guardar perfil:', error);
        alert('❌ Error al guardar el perfil. Inténtalo de nuevo.');
    }
}
