// Selecciona todos los botones .btn-asistir y les añade un clic handler
document.querySelectorAll('.btn-asistir').forEach(b => {
    b.addEventListener('click', () => {
        // Muestra alerta solicitando inicio de sesión
        alert('Por favor inicia sesión para confirmar asistencia.');
        // Redirige a la página de autenticación
        location.href = 'auth.html';
    });
});