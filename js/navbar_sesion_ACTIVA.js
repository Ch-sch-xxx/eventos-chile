// Sistema de navbar dinámico - detecta sesión activa y modifica enlaces
document.addEventListener('DOMContentLoaded', function() {
    actualizarNavbarSegunSesion();
});

function actualizarNavbarSegunSesion() {
    const userLogged = localStorage.getItem('user-logged');
    const userData = JSON.parse(localStorage.getItem('user-data') || '{}');
    const navList = document.querySelector('.navbar-nav');

    // Si no existe el navbar, salir
    if (!navList) return;

    // Limpiar enlaces actuales (mantener solo los fijos)
    navList.innerHTML = '';

    // Enlaces fijos siempre visibles
    const itemInicio = crearNavItem('Inicio', 'index.html');
    const itemEventos = crearNavItem('Eventos', 'eventos.html');

    navList.appendChild(itemInicio);
    navList.appendChild(itemEventos);

    // Si HAY sesión activa, mostrar opciones de usuario logueado
    if (userLogged === 'admin' || userLogged === 'usuario') {
        // Botón "Mi Gestión" - redirige a gestion_admin.html
        const itemGestion = crearNavItem('Mi Gestión', 'gestion_admin.html');
        navList.appendChild(itemGestion);

        // Botón "Mi Perfil" - redirige a perfil_admin.html
        const itemPerfil = crearNavItem('Mi Perfil', 'perfil_admin.html');
        navList.appendChild(itemPerfil);

        // Botón "Cerrar sesión" con funcionalidad especial
        const itemCerrarSesion = document.createElement('li');
        itemCerrarSesion.className = 'nav-item';
        itemCerrarSesion.innerHTML = `
            <a class="nav-link px-3 py-2 rounded-pill" href="#" id="cerrar-sesion-navbar">
                Cerrar sesión
            </a>
        `;
        navList.appendChild(itemCerrarSesion);

        // Event listener para cerrar sesión
        const btnCerrarSesion = document.getElementById('cerrar-sesion-navbar');
        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', function(e) {
                e.preventDefault();
                cerrarSesionNavbar();
            });
        }
    } else {
        // Si NO hay sesión, mostrar "Iniciar sesión"
        const itemAuth = crearNavItem('Iniciar sesión', 'auth.html');
        navList.appendChild(itemAuth);
    }
}

// Función auxiliar para crear elementos de navegación
function crearNavItem(texto, href) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.innerHTML = `
        <a class="nav-link px-3 py-2 rounded-pill" href="${href}">${texto}</a>
    `;
    return li;
}

// Función para cerrar sesión desde el navbar
function cerrarSesionNavbar() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
        // Limpiar localStorage
        localStorage.removeItem('user-logged');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-data');

        alert('Sesión cerrada correctamente');

        // Limpiar historial y redirigir
        window.location.replace('index.html');

        // Prevenir navegación hacia atrás
        window.history.pushState(null, '', window.location.href);
        window.onpopstate = function() {
            window.location.replace('index.html');
        };
    }
}

