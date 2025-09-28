// Sistema de usuarios en localStorage
function obtenerUsuarios() {
    const usuarios = localStorage.getItem('usuarios-chile');
    return usuarios ? JSON.parse(usuarios) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
}

function crearUsuario(userData) {
    const usuarios = obtenerUsuarios();
    // Verificar si el email ya existe
    if (usuarios.find(user => user.email === userData.email)) {
        return false; // Ya existe
    }
    usuarios.push(userData);
    guardarUsuarios(usuarios);
    return true;
}

function validarUsuario(email, password) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(user => user.email === email && user.password === password);
}

// REEMPLAZAR estas funciones de validación RUT en js/auth.js

// Validación RUT chileno completa con algoritmo Módulo 11 CORREGIDA
function validarRUTCompleto(rut) {
    // Limpiar y validar formato básico
    const rutLimpio = rut.replace(/[^0-9kK-]/g, '');

    if (!/^[0-9]+-[0-9kK]$/i.test(rutLimpio)) {
        console.log('❌ Formato inválido:', rutLimpio);
        return false;
    }

    const partes = rutLimpio.split('-');
    const cuerpo = partes[0];
    const dv = partes[1].toLowerCase();

    // Validar que el cuerpo tenga entre 7 y 8 dígitos
    if (cuerpo.length < 7 || cuerpo.length > 8) {
        console.log('❌ Longitud inválida:', cuerpo.length);
        return false;
    }

    const dvCalculado = calcularDV(cuerpo);
    console.log('🔍 Debug RUT:', cuerpo, '- DV ingresado:', dv, '- DV calculado:', dvCalculado);

    return dv === dvCalculado;
}

// Calcular dígito verificador usando Módulo 11 CORREGIDO
function calcularDV(rutSinDV) {
    let suma = 0;
    let multiplicador = 2;

    // Recorrer de DERECHA a IZQUIERDA
    for (let i = rutSinDV.length - 1; i >= 0; i--) {
        const digito = parseInt(rutSinDV.charAt(i));
        suma += digito * multiplicador;
        console.log(`Pos ${i}: ${digito} × ${multiplicador} = ${digito * multiplicador}`);

        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    console.log('📊 Suma total:', suma);
    const resto = suma % 11;
    const dv = 11 - resto;

    console.log('📐 Resto:', resto, '- DV calculado:', dv);

    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
}

// Formatear RUT automáticamente MEJORADO
function formatearRUT(rut) {
    // Limpiar completamente
    let rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    if (rutLimpio.length < 2) return rutLimpio;

    // Separar cuerpo y DV
    const dv = rutLimpio.slice(-1);
    const cuerpo = rutLimpio.slice(0, -1);

    if (cuerpo.length === 0) return rutLimpio;

    // Formatear con puntos
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoFormateado}-${dv}`;
}


// Expresión regular para validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// DATOS DE REGIONES Y COMUNAS
const regionesYcomunas = {
    "Región Metropolitana": [
        "Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"
    ],
    "Valparaíso": [
        "Valparaíso", "Viña del Mar", "Concón", "Quilpué"
    ],
    "Biobío": [
        "Concepción", "Talcahuano", "Los Ángeles"
    ],
    "O'Higgins": [
        "Rancagua", "San Fernando", "Machalí"
    ]
};

// FUNCIÓN PARA CARGAR COMUNAS DINÁMICAMENTE
function cargarComunasPorRegion(regionSeleccionada) {
    const comunaSelect = document.getElementById('register-comuna');

    // Limpiar opciones existentes
    comunaSelect.innerHTML = '<option value="">Selecciona comuna</option>';

    // Cargar nuevas comunas si existe la región
    if (regionSeleccionada && regionesYcomunas[regionSeleccionada]) {
        regionesYcomunas[regionSeleccionada].forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
}

// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', function() {

    // INTERCAMBIO ENTRE FORMULARIOS
    document.getElementById('link-register').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('login').classList.add('oculto');
        document.getElementById('register').classList.remove('oculto');
    });

    document.getElementById('link-login').addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('register').classList.add('oculto');
        document.getElementById('login').classList.remove('oculto');
    });

    // EVENT LISTENER PARA CAMBIO DE REGIÓN
    document.getElementById('register-region').addEventListener('change', function() {
        const regionSeleccionada = this.value;
        cargarComunasPorRegion(regionSeleccionada);
    });

    // FORMATEO AUTOMÁTICO DEL RUT
    document.getElementById('register-rut').addEventListener('input', function(e) {
        const input = e.target;
        const cursorPos = input.selectionStart;
        const valorOriginal = input.value;

        // Formatear el RUT
        const valorFormateado = formatearRUT(valorOriginal);

        // Solo actualizar si cambió
        if (valorFormateado !== valorOriginal) {
            input.value = valorFormateado;

            // Ajustar cursor para mantener posición lógica
            const diferencia = valorFormateado.length - valorOriginal.length;
            const nuevaPos = Math.min(cursorPos + diferencia, valorFormateado.length);
            input.setSelectionRange(nuevaPos, nuevaPos);
        }
    });

    // MANEJO FORMULARIO DE LOGIN
    document.getElementById('login').addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value.trim();

        if (!emailRegex.test(email)) {
            alert('Email inválido');
            return;
        }
        if (pass.length < 4 || pass.length > 20) {
            alert('La contraseña debe tener entre 4 y 20 caracteres');
            return;
        }

        // Admin hardcodeado
        if (email === 'ad@ad.com' && pass === 'admin') {
            localStorage.setItem('user-logged', 'admin');
            localStorage.setItem('user-email', email);
            window.location.href = 'gestion_admin.html';
            return;
        }

        // Validar usuario registrado
        const usuario = validarUsuario(email, pass);
        if (usuario) {
            localStorage.setItem('user-logged', 'usuario');
            localStorage.setItem('user-email', email);
            localStorage.setItem('user-data', JSON.stringify(usuario));
            alert('¡Bienvenido ' + usuario.name + '!');
            window.location.href = 'perfil_admin.html';
        } else {
            alert('Credenciales incorrectas');
        }
    });

    // MANEJO FORMULARIO DE REGISTRO
    document.getElementById('register').addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const rut = document.getElementById('register-rut').value.trim();
        const pass = document.getElementById('register-password').value.trim();
        const region = document.getElementById('register-region').value;
        const comuna = document.getElementById('register-comuna').value;

        // Validaciones
        if (name === '' || name.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!emailRegex.test(email)) {
            alert('Email inválido');
            return;
        }

        if (!rut || !validarRUTCompleto(rut)) {
            alert('RUT inválido. Usar formato: 12345678-9');
            return;
        }

        if (pass.length < 4 || pass.length > 20) {
            alert('La contraseña debe tener entre 4 y 20 caracteres');
            return;
        }

        if (!region || !comuna) {
            alert('Selecciona región y comuna');
            return;
        }

        // Verificar si RUT ya existe
        const usuarios = obtenerUsuarios();
        if (usuarios.find(user => user.rut === formatearRUT(rut))) {
            alert('Este RUT ya está registrado');
            return;
        }

        // Crear usuario con estructura completa
        const nuevoUsuario = {
            name: name,
            email: email,
            rut: formatearRUT(rut),
            password: pass,
            region: region,
            comuna: comuna,
            fechaRegistro: new Date().toISOString()
        };

        if (crearUsuario(nuevoUsuario)) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            document.getElementById('register').reset();
            document.getElementById('register').classList.add('oculto');
            document.getElementById('login').classList.remove('oculto');
        } else {
            alert('Este email ya está registrado');
        }
    });
});
