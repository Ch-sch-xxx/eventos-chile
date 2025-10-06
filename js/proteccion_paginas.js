// Sistema de protección anti-caché para páginas privadas
// Ejecuta INMEDIATAMENTE al cargar el script (antes del DOM)

(function() {
    'use strict';

    // Verificación inicial inmediata
    verificarAccesoInmediato();

    // Prevenir caché del navegador
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
        // Usuario llegó usando botón atrás/adelante
        verificarAccesoInmediato();
    }

    // Listener para cuando la página se muestra desde caché
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
            // Página cargada desde caché (bfcache)
            verificarAccesoInmediato();
        }
    });

    // Listener adicional para popstate (botón atrás)
    window.addEventListener('popstate', function() {
        verificarAccesoInmediato();
    });

    // Verificación al cargar completamente
    window.addEventListener('load', function() {
        verificarAccesoInmediato();
    });

    // Función de verificación de acceso
    function verificarAccesoInmediato() {
        const userLogged = localStorage.getItem('user-logged');

        // Si NO hay sesión válida, redirigir inmediatamente
        if (userLogged !== 'admin' && userLogged !== 'usuario') {
            // Limpiar cualquier dato residual
            localStorage.removeItem('user-logged');
            localStorage.removeItem('user-email');
            localStorage.removeItem('user-data');

            // Redirigir sin permitir volver atrás
            window.location.replace('auth.html');

            // Bloquear renderizado de contenido
            if (document.body) {
                document.body.style.display = 'none';
            }

            // Detener ejecución de scripts
            throw new Error('Acceso no autorizado');
        }
    }

    // Prevenir navegación hacia atrás después de cerrar sesión
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', function() {
        verificarAccesoInmediato();
        window.history.pushState(null, '', window.location.href);
    });

})();
