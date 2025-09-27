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




// Logica para nueva SECCION de TARJETAS 3D, eventos generales UNICOS
// Genera tarjetas de eventos para el carrusel
function generarTarjetasEventos() {
    const eventos = listarEventos(); // usa función del CRUD
    const carruselLista = document.querySelector('.carrusel-lista');
    carruselLista.innerHTML = '';

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
    });
}

// Generar tarjetas 3D
function generarTarjetas3D() {
    const eventos = listarEventos(); // usa función del CRUD
    const gridEventos = document.getElementById('grid-eventos');
    gridEventos.innerHTML = '';

    eventos.forEach((evento, index) => {
        const tarjeta3D = document.createElement('div');
        tarjeta3D.className = 'tarjeta-3d';
        tarjeta3D.innerHTML = `
            <div class="tarjeta-flip" data-evento="${index}">
                <!-- Cara frontal -->
                <div class="cara-front">
                    <img src="${evento.imagen}" alt="${evento.titulo}">
                    <div class="info-evento">
                        <h3>${evento.titulo}</h3>
                        <p><strong>Fecha:</strong> ${evento.fecha}</p>
                        <p><strong>Lugar:</strong> ${evento.lugar}</p>
                        <p><strong>Tipo:</strong> ${evento.tipo}</p>
                    </div>
                    <button class="btn-detalle">Ver Detalle</button>
                </div>
                
                <!-- Cara trasera -->
                <div class="cara-back">
                    <div class="info-evento">
                        <h3>${evento.titulo}</h3>
                        <p><strong>Descripción:</strong></p>
                        <p>${evento.descripcion || 'Evento increíble que no te puedes perder. Ven y disfruta de una experiencia única con actividades para toda la familia.'}</p>
                        <p><strong>Capacidad:</strong> ${evento.capacidad || '100'} personas</p>
                        <p><strong>Precio:</strong> ${evento.precio || 'Gratis'}</p>
                    </div>
                    <button class="btn-volver">Volver</button>
                </div>
            </div>
        `;
        gridEventos.appendChild(tarjeta3D);
    });

    // Agregar efectos 3D después de crear las tarjetas
    agregarEfectos3D();
}

// Efectos 3D con mouse y click
function agregarEfectos3D() {
    const tarjetas3D = document.querySelectorAll('.tarjeta-3d');

    tarjetas3D.forEach(tarjeta => {
        const flip = tarjeta.querySelector('.tarjeta-flip');

        // Efecto mouse movimiento (solo si no está volteada)
        tarjeta.addEventListener('mousemove', (e) => {
            if (flip.classList.contains('volteada')) return;

            const rect = tarjeta.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            flip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Volver a posición normal al salir
        tarjeta.addEventListener('mouseleave', () => {
            if (!flip.classList.contains('volteada')) {
                flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });

        // Click para voltear tarjeta
        const btnDetalle = tarjeta.querySelector('.btn-detalle');
        const btnVolver = tarjeta.querySelector('.btn-volver');

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

// Botón "Asistir al Evento" - redirige a login
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-asistir')) {
        alert('Por favor inicia sesión para confirmar asistencia.');
        location.href = 'auth.html';
    }
});

// Generar ambas secciones al cargar página
document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasEventos(); // carrusel original
    generarTarjetas3D(); // tarjetas 3D nuevas
});
