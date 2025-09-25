// Genera tarjetas de eventos de forma pública al abrir la página
function generarTarjetasEventos() {
    const eventos = listarEventos(); // lee todos los eventos públicos
    const carruselLista = document.querySelector('.carrusel-lista');
    carruselLista.innerHTML = ''; // limpia el contenido anterior

    eventos.forEach(evento => {
        let tarjeta = document.createElement('article');
        tarjeta.className = "Tarjetas";
        tarjeta.innerHTML = `
            <img class="img-tarjeta-evento" src="${evento.imagen}" alt="Imagen evento">
            <h3>${evento.titulo}</h3>
            <p>Fecha: ${evento.fecha}<br>Lugar: ${evento.lugar}</p>
            <button class="btn-asistir">Asistir al Evento</button>
        `;
        carruselLista.appendChild(tarjeta);
        //creamos la tarjeta bajo la clase carrusel-lista
    });
}

// Botón "Asistir al Evento", debe autenticarse
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-asistir')) {
        alert('Por favor inicia sesión para confirmar asistencia.');
        location.href = 'auth.html';
    }
});

// generar las tarjetas al cargar página
document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasEventos();
});
