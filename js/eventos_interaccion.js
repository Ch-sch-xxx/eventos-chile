// Genera tarjetas de eventos de forma pública al abrir la página
function generarTarjetasEventos() {
    const eventos = listarEventos(); // lee todos los eventos públicos
    const carruselLista = document.querySelector('.carrusel-lista');
    carruselLista.innerHTML = ''; // limpia el contenido anterior

    eventos.forEach((evento, indice) => {
        const tarjeta = document.createElement('article');
        tarjeta.className = "Tarjetas";
        tarjeta.innerHTML = `
            <img class="img-tarjeta-evento" src="${evento.imagen}" alt="Imagen evento">
            <h3>${evento.titulo}</h3>
            <p>Fecha: ${evento.fecha}<br>Lugar: ${evento.lugar}</p>
            <p><b class="tipo-evento">${evento.tipo}</b></p>
            
            <button class="btn-asistir" data-indice="${indice}">Asistir al Evento</button>
        `;
        carruselLista.appendChild(tarjeta);
        //creamos la tarjeta bajo la clase carrusel-lista
    });
}

// Botón "Asistir al Evento", debe autenticarse
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-asistir')) {
        const userLogged = localStorage.getItem('user-logged');
        if (!userLogged) {
            alert('Por favor inicia sesión para confirmar asistencia.');
            location.href = 'auth.html';
        } else {
            const indiceEvento = parseInt(e.target.dataset.indice);
            const eventos = listarEventos();
            const evento = eventos[indiceEvento];

            if (evento) {
                alert(`¡Te has unido a "${evento.titulo}"! Revisa tu perfil para más detalles.`);
                // Aquí se puede implementar lógica de "asistencia" futura
            } else {
                alert('Error: Evento no encontrado.');
            }
        }
    }
});

// generar las tarjetas al cargar página
document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasEventos();
    generarTarjetas3D(); // Cargar ambas vistas de una vez
});

// SECCION DE TARJETAS 3D
function generarTarjetas3D() {
    const eventos = listarEventos(); // Siempre la base oficial
    const grid = document.getElementById('contenedor-grid-eventos');

    if (!grid) return; // Verificación de existencia del contenedor

    grid.innerHTML = '';

    eventos.forEach((evento, indice) => {
        const tarjeta3D = document.createElement('div');
        tarjeta3D.className = 'tarjeta-evento-3d'; // ← nombre CSS coherente con contexto

        tarjeta3D.innerHTML = `
            <div class="carta-evento-flip" data-indice="${indice}">
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
                        <p>${evento.descripcion || 'Evento increíble que no te puedes perder. Ven y disfruta de una experiencia única.'}</p>
                        <p><strong>Capacidad:</strong> ${evento.capacidad || '100'} personas</p>
                        <p><strong>Precio:</strong> ${evento.precio || 'Gratis'}</p>
                    </div>
                    <button class="boton-volver">Volver</button>
                </div>
            </div>
        `;
        grid.appendChild(tarjeta3D);
    });

    agregarEfectos3D();
}

// EFECTOS 3D CON MOUSE Y FLIP
function agregarEfectos3D() {
    const tarjetas3D = document.querySelectorAll('.tarjeta-evento-3d');

    tarjetas3D.forEach(tarjeta => {
        const flip = tarjeta.querySelector('.carta-evento-flip');

        if (!flip) return; // Verificación de existencia del elemento flip

        // Mouse movimiento - ángulo más fuerte y realista
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

        if (btnDetalle && btnVolver) {
            btnDetalle.addEventListener('click', () => {
                flip.classList.add('volteada');
                flip.style.transform = 'rotateY(180deg)';
            });
            btnVolver.addEventListener('click', () => {
                flip.classList.remove('volteada');
                flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        }
    });
}
