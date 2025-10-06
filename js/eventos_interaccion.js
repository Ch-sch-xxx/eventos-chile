// Función para truncar texto y mantener compacidad
function truncarTexto(texto, maxCaracteres) {
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
}

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
            <h3>${truncarTexto(evento.titulo, 40)}</h3>
            <p>Fecha: ${evento.fecha}<br>Lugar: ${truncarTexto(evento.lugar, 25)}</p>
            <p><b class="tipo-evento">${evento.tipo}</b></p>
            
            <button class="btn-asistir">Asistir al Evento</button>
        `;
        carruselLista.appendChild(tarjeta);
    });
}

// Botón "Asistir al Evento", debe autenticarse
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-asistir')) {
        alert('Por favor inicia sesión para confirmar asistencia.');
        location.href = 'auth.html';
    }
});

// SECCION DE TARJETAS 3D - CONTENIDO COMPACTO Y ORGANIZADO
function generarTarjetas3D() {
    const eventos = listarEventos(); // la base de datos
    const grid = document.getElementById('contenedor-grid-eventos');
    grid.innerHTML = '';

    eventos.forEach((evento, i) => {
        // Cada tarjeta en su columna Bootstrap
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 d-flex justify-content-center align-items-stretch mb-4';

        const tarjeta3D = document.createElement('div');
        tarjeta3D.className = 'tarjeta-evento-3d';
        tarjeta3D.innerHTML = `
            <div class="carta-evento-flip" data-indice="${i}">
                <!-- Cara frontal - información esencial y compacta -->
                <div class="cara-frontal">
                    <img class="imagen-evento" src="${evento.imagen}" alt="${truncarTexto(evento.titulo, 30)}">
                    <div class="informacion-evento">
                        <h3>${truncarTexto(evento.titulo, 50)}</h3>
                        <p><strong>📅 Fecha:</strong> ${evento.fecha}</p>
                        <p><strong>📍 Lugar:</strong> ${truncarTexto(evento.lugar, 50)}</p>
                        <span class="etiqueta-tipo">${evento.tipo}</span>
                    </div>
                    <button class="boton-detalle">Ver Detalle</button>
                </div>
                <!-- Cara posterior - detalles completos organizados -->
                <div class="cara-posterior">
                    <div class="informacion-evento">
                        <h3>${truncarTexto(evento.titulo, 40)}</h3>
                        
                        <p><strong>📋 Descripción:</strong></p>
                        <p class="detalle-completo">${truncarTexto(evento.descripcion, 200)}</p>
                        
                        <p><strong>👥 Capacidad:</strong> ${evento.capacidad} personas</p>
                        <p><strong>💰 Precio:</strong> ${evento.precio}</p>
                        <p><strong>👤 Organizador:</strong> ${truncarTexto(evento.creadoPor, 30)}</p>
                        <p><strong>📆 Creado:</strong> ${evento.fechaCreacion || evento.fecha}</p>
                    </div>
                    <button class="boton-volver">← Volver</button>
                </div>
            </div>
        `;

        // Agregar la tarjeta al col y el col al grid
        col.appendChild(tarjeta3D);
        grid.appendChild(col);
    });

    agregarEfectos3D();
}

// EFECTOS 3D MOUSE Y FLIP - optimizados
function agregarEfectos3D() {
    const tarjetas3D = document.querySelectorAll('.tarjeta-evento-3d');

    tarjetas3D.forEach(tarjeta => {
        const flip = tarjeta.querySelector('.carta-evento-flip');

        // Mouse movimiento - efecto 3D suave
        tarjeta.addEventListener('mousemove', (e) => {
            if (flip.classList.contains('volteada')) return;

            const rect = tarjeta.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 4;
            const centerY = rect.height / 4;

            // Efecto 3D más suave para no marear
            const rotateX = (y - centerY) / 6;
            const rotateY = (centerX - x) / 0.8;


            flip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Mouse sale - regresa a posición original
        tarjeta.addEventListener('mouseleave', () => {
            if (!flip.classList.contains('volteada')) {
                flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });

        // Voltear tarjeta (mostrar detalle)
        const btnDetalle = tarjeta.querySelector('.boton-detalle');
        const btnVolver = tarjeta.querySelector('.boton-volver');

        btnDetalle.addEventListener('click', (e) => {
            e.preventDefault();
            flip.classList.add('volteada');
            flip.style.transform = 'rotateY(180deg)';
        });

        btnVolver.addEventListener('click', (e) => {
            e.preventDefault();
            flip.classList.remove('volteada');
            flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Cargar ambas vistas al iniciar la página
document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasEventos(); // Carrusel horizontal
    generarTarjetas3D();      // Grid 3D compacto
});
