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

// Manejo del formulario de login
document.getElementById('login').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const pass  = document.getElementById('login-password').value.trim();

    // Validar formato de email
    if (!emailRegex.test(email)) {
        alert('Email inválido');
        return;
    }
    // Validar longitud de contraseña
    if (pass.length < 4 || pass.length > 20) {
        alert('La contraseña debe tener entre 4 y 20 caracteres');
        return;
    }

    // Simular login admin
    if (email === 'admin@admin.com' && pass === 'admin') {
        localStorage.setItem('user-logged', 'admin');// Guardamos que el admin está logueado
        localStorage.setItem('user-email', email);
        window.location.href = 'gestion_admin.html';
    } else {
        alert('Credenciales incorrectas');
    }
});

// Manejo del formulario de registro
document.getElementById('register').addEventListener('submit', e => {
    e.preventDefault();
    const name   = document.getElementById('register-name').value.trim();
    const email  = document.getElementById('register-email').value.trim();
    const pass   = document.getElementById('register-password').value.trim();
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
    if (!region) {
        alert('Selecciona una región');
        return;
    }
    if (!comuna) {
        alert('Selecciona una comuna');
        return;
    }

    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    document.getElementById('register').classList.add('oculto');
    document.getElementById('login').classList.remove('oculto');
});
