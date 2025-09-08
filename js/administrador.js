
// Mostrar la sección Crear Evento y ocultar Listar Eventos
document.getElementById('nav-crear').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('crear-evento').classList.remove('oculto');
    document.getElementById('listar-eventos').classList.add('oculto');
});

// Mostrar la sección Listar Eventos y ocultar Crear Evento
document.getElementById('nav-listar').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('listar-eventos').classList.remove('oculto');
    document.getElementById('crear-evento').classList.add('oculto');
});
