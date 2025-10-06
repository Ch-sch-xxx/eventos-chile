// interacción visual y lógica en la página de eventos
// Este script se conecta con 'crud_eventos.js' y usa sus funciones para mostrar los eventos

// Función para recortar textos largos en las tarjetas (por visual, si no se pierde la respo)
function truncarTexto(texto, maxCaracteres) {
    // Evito textos demasiado extensos en las tarjetas, que podrían romper el diseño
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
}

//Carrusel infinito
// listarEventos() del crud_eventos.js
function generarTarjetasCarruselInfinito() {
    const eventos = listarEventos();
    const carruselLista = document.getElementById('carrusel-lista');
    carruselLista.innerHTML = '';

    // Duplicar el array para dar efecto de loop infinito
    const eventosDobles = [...eventos, ...eventos];
    eventosDobles.forEach(evento => {
        let tarjeta = document.createElement('article');
        tarjeta.className = "Tarjetas";
        tarjeta.innerHTML = `
            <img class="img-tarjeta-evento" src="${evento.imagen}" alt="Imagen evento">
            <h3>${truncarTexto(evento.titulo, 40)}</h3>
            <p>📅 Fecha: ${evento.fecha}<br>📍 Lugar: ${truncarTexto(evento.lugar, 50)}</p>
            <p><b class="tipo-evento">${evento.tipo}</b></p>
            <button class="btn-asistir">Asistir al Evento</button>
        `;
        carruselLista.appendChild(tarjeta);
    });

    // Logica básica de scroll infinito; si llego al final, vuelvo al inicio y viceversa
    carruselLista.addEventListener('scroll', function () {
        // Fin derecho, salto adelante un pixel para no quedar pegado
        if (carruselLista.scrollLeft + carruselLista.clientWidth >= carruselLista.scrollWidth - 1) {
            carruselLista.scrollLeft = 1;
        }
        // Inicio, salto a mitad del scroll
        if (carruselLista.scrollLeft === 0) {
            carruselLista.scrollLeft = carruselLista.scrollWidth / 2;
        }
    });

    // auto-scroll (opcional, para que el carrusel se mueva solo)
    setInterval(() => {
        carruselLista.scrollLeft += 1.2;
    }, 18);

}

// autenticacion al "Asistir al Evento" sin login
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-asistir')) {
        alert('Por favor inicia sesión para confirmar asistencia.');
        location.href = 'auth.html'; // Redirige al login
    }
});

//SECCIÓN tarjetas 3D para todos los eventos
function generarTarjetas3D() {
    const eventos = listarEventos();
    const grid = document.getElementById('contenedor-grid-eventos');
    grid.innerHTML = '';

    eventos.forEach((evento, i) => {
        // Card responsive usando Bootstrap
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 d-flex justify-content-center align-items-stretch mb-4';

        const tarjeta3D = document.createElement('div');
        tarjeta3D.className = 'tarjeta-evento-3d';
        tarjeta3D.innerHTML = `
            <div class="carta-evento-flip" data-indice="${i}">
                <!-- Cara frontal -->
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
                <!-- Cara posterior -->
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
        col.appendChild(tarjeta3D);
        grid.appendChild(col);
    });

    agregarEfectos3D();
}

// Efectos 3D y flip en tarjetas
function agregarEfectos3D() {
    const tarjetas3D = document.querySelectorAll('.tarjeta-evento-3d');
    tarjetas3D.forEach(tarjeta => {
        const flip = tarjeta.querySelector('.carta-evento-flip');

        // Movimiento mouse para efecto 3D
        tarjeta.addEventListener('mousemove', (e) => {
            if (flip.classList.contains('volteada')) return;
            const rect = tarjeta.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 4;
            const centerY = rect.height / 4;
            const rotateX = (y - centerY) / 6;
            const rotateY = (centerX - x) / 0.8;
            flip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        // Al salir del mouse, regreso a posición inicial
        tarjeta.addEventListener('mouseleave', () => {
            if (!flip.classList.contains('volteada')) {
                flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }
        });

        // Botón ver detalle (voltea tarjeta)
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

// Al cargar la página, ejecuto ambos
document.addEventListener('DOMContentLoaded', function () {
    generarTarjetasCarruselInfinito(); // Carrusel horizontal infinito
    generarTarjetas3D();               // Grid de tarjetas 3D
});
