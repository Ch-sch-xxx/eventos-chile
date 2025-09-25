// Cancelar inicio de sesion por URL DIRECTA

// no entrar sin haber logueado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay sesión activa
    const usuarioLogueado = localStorage.getItem('sesionAdmin');
    if (!usuarioLogueado) {
        alert('Acceso denegado. Inicia sesión.');
        window.location.href = 'auth.html';
        return;
    }
    renderTablaEventos();
});



// manejar el panel de administración (después de login)
// funciónes de crud_eventos.js para los datos

// NAVEGACIÓN ENTRE SECCIONES
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
    renderTablaEventos(); // Actualiza la tabla cuando la muestras
});

// Actualiza tabla eventos (renderizado)
function renderTablaEventos() {
    const eventos = listarEventos(); // función del crud
    const tbody = document.querySelector('#listar-eventos tbody');
    tbody.innerHTML = ''; // Limpia la tabla

    // Por cada evento, crea una fila en la tabla
    eventos.forEach((evento, idx) => {
        let tableRow = document.createElement('tableRow');
        tableRow.innerHTML = `
            <td>${evento.titulo}</td>
            <td>${evento.fecha}</td>
            <td>${evento.lugar}</td>
            <td>${evento.tipo}</td>
            <td>
                <button class="btn-ver" data-idx="${idx}">Ver</button>
                <button class="btn-eliminar" data-idx="${idx}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tableRow);
    });
}

// CREAR EVENTO
document.getElementById('form-crear').addEventListener('submit', e => {
    e.preventDefault();

    // Obtén los datos del formulario
    const titulo = document.getElementById('titulo').value.trim();
    const fecha = document.getElementById('fecha').value;
    const lugar = document.getElementById('lugar').value.trim();
    const tipo = document.getElementById('tipo').value;

    // Validación básica
    if (!titulo || !fecha || !lugar || !tipo) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Crea el objeto evento
    const nuevoEvento = {
        titulo: titulo,
        fecha: fecha,
        lugar: lugar,
        tipo: tipo,
        imagen: "imagenes/eventosIMG.png" // Por defecto
    };

    // Usa la función del crud para guardarlo
    crearEvento(nuevoEvento);

    // Limpia el formulario
    e.target.reset();

    // Cambia a la sección de lista para mostrar el nuevo evento
    document.getElementById('nav-listar').click();

    alert('Evento creado exitosamente!');
});

// Ver y Eliminar
document.querySelector('#listar-eventos').addEventListener('click', function(e) {
    const idx = e.target.dataset.idx;
    const eventos = listarEventos();

    if (e.target.classList.contains('btn-ver')) {
        // Mostrar detalles del evento
        const evento = eventos[idx];
        alert(`Detalles del evento:\n\nTítulo: ${evento.titulo}\nFecha: ${evento.fecha}\nLugar: ${evento.lugar}\nTipo: ${evento.tipo}`);
    }

    if (e.target.classList.contains('btn-eliminar')) {
        // Confirmar y eliminar evento
        const evento = eventos[idx];
        if (confirm(`¿Seguro que quieres eliminar "${evento.titulo}"?`)) {
            eliminarEvento(idx); // Usa función del crud
            renderTablaEventos(); // Actualiza la tabla
            alert('Evento eliminado');
        }
    }
});

// ====== INICIALIZAR AL CARGAR ======
// Renderiza la tabla cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    renderTablaEventos();
});
