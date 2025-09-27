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

// Expresión regular para validar email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Intercambio entre formularios
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


const regionesYcomunas = {
    "Región Metropolitana": [
        "Santiago",
        "Providencia",
        "Las Condes",
        "Puente Alto",
        "Maipú",

    ],
    "Valparaíso": [
        "Valparaíso",
        "Viña del Mar",
        "Concón",
        "Quilpué"

    ],
    "Biobío": [
        "Concepción",
        "Talcahuano",
        "Los Ángeles"

    ],
    "O’Higgins": [
        "Rancagua",
        "San Fernando",
        "Machalí"

    ],
    // se pueden agregar más regiones y comunas a futuro
};

// Manejo del formulario de login
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
        window.location.href = 'perfil_admin.html'; // o donde quieras redirigir
    } else {
        alert('Credenciales incorrectas');
    }
});



// Manejo del formulario de registro
// REEMPLAZAR el addEventListener de register:
document.getElementById('register').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const pass = document.getElementById('register-password').value.trim();
    const region = document.getElementById('register-region').value;
    const comuna = document.getElementById('register-comuna').value;

    if (name === '') {
        alert('Ingresa tu nombre');
        return;
    }
    if (!emailRegex.test(email)) {
        alert('Email inválido');
        return;
    }
    if (pass.length < 4 || pass.length > 20) {
        alert('La contraseña debe tener entre 4 y 20 caracteres');
        return;
    }

    // Crear usuario
    const nuevoUsuario = {
        name: name,
        email: email,
        password: pass,
        region: region,
        comuna: comuna,
        fechaRegistro: new Date().toISOString()
    };

    if (crearUsuario(nuevoUsuario)) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        // Limpiar formulario
        document.getElementById('register').reset();
        // Cambiar a login
        document.getElementById('register').classList.add('oculto');
        document.getElementById('login').classList.remove('oculto');
    } else {
        alert('Este email ya está registrado');
    }
});


document.getElementById('register-region').addEventListener('change', function() {
    const region = this.value;
    const comunaSelect = document.getElementById('register-comuna');
    comunaSelect.innerHTML = '<option value="">Selecciona comuna</option>';
    if(region && regionesYcomunas[region]) {
        regionesYcomunas[region].forEach(comuna => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    }
});
