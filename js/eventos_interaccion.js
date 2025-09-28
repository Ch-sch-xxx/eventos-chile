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
            <p><b class="tipo-evento">${evento.tipo}</b></p>
            
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

// SECCION DE TARJETAS 3D
function generarTarjetas3D() {
    const eventos = listarEventos(); // Siempre la base
    const grid = document.getElementById('contenedor-grid-eventos');
    grid.innerHTML = '';

    eventos.forEach((evento, i) => {
        const tarjeta3D = document.createElement('div');
        tarjeta3D.className = 'tarjeta-evento-3d';
        tarjeta3D.innerHTML = `
            <div class="carta-evento-flip" data-indice="${i}">
                <!-- Cara frontal -->
                <div class="cara-frontal">
                    <img class="imagen-evento" src="${evento.imagen}" alt="${evento.titulo}">
                    <div class="informacion-evento">
                        <h3>${evento.titulo}</h3>
                        <p><strong>Fecha:</strong> ${evento.fecha}</p>
                        <p><strong>Lugar:</strong> ${evento.lugar}</p>
                        <span class="etiqueta-tipo">${evento.tipo}</span>
                    </div>
                    <button class="boton-detalle">Ver Detalle</button>
                </div>
                <!-- Cara posterior -->
                <div class="cara-posterior">
                    <div class="informacion-evento">
                        <h3>${evento.titulo}</h3>
                        <p><strong>Descripción:</strong></p>
                        <p>${evento.descripcion}</p>
                        <p><strong>Capacidad:</strong> ${evento.capacidad} personas</p>
                        <p><strong>Precio:</strong> ${evento.precio}</p>
                        <p><strong>Creado por:</strong> ${evento.creadoPor}</span></p>
                        <p><strong>Fecha creación:</strong> ${evento.fecha}</p>
                    </div>
                    <button class="boton-volver">Volver</button>
                </div>
            </div>
        `;
        grid.appendChild(tarjeta3D);
    });

    agregarEfectos3D();
}

// EFECTOS 3D MOUSE Y FLIP
function agregarEfectos3D() {
    const tarjetas3D = document.querySelectorAll('.tarjeta-evento-3d');

    tarjetas3D.forEach(tarjeta => {
        const flip = tarjeta.querySelector('.carta-evento-flip');
        // Mouse movimiento - ángulo más fuerte y realista al 3D
        tarjeta.addEventListener('mousemove', (e) => {
            if (flip.classList.contains('volteada')) return;
            const rect = tarjeta.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            // Más intenso el efecto al dividir por menos: (más cerca del borde, más ángulo)
            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 0.6;
            flip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Mouse sale - regresa a posición original
        tarjeta.addEventListener('mouseleave', () => {
            if (!flip.classList.contains('volteada')) {
                flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });

        // Voltear tarjeta (detalle)
        const btnDetalle = tarjeta.querySelector('.boton-detalle');
        const btnVolver = tarjeta.querySelector('.boton-volver');
        btnDetalle.addEventListener('click', () => {
            flip.classList.add('volteada');
            flip.style.transform = 'rotateY(180deg)';
        });
        btnVolver.addEventListener('click', () => {
            flip.classList.remove('volteada');
            flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Cargar ambas vistas

document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasEventos(); // Carrusel
    generarTarjetas3D();      // Grid 3D
});