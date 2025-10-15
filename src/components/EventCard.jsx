// Tarjeta 3D con flip para mostrar detalles de un evento
// Portado desde eventos_interaccion.js SIN react
// - mantiene efectos de mouse y flip

import { useState, useRef } from 'react';

// Función auxiliar para recortar textos largos (por visual, si no se pierde la respo)
function truncarTexto(texto, maxCaracteres) {
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
}

// Función para formatear fecha ISO a formato legible chileno
function formatearFechaLegible(fechaISO) {
    if (!fechaISO) return 'No disponible';

    const fecha = new Date(fechaISO);
    const opciones = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };

    return fecha.toLocaleDateString('es-CL', opciones);
}

function EventCard({ evento, onAsistir }) {
    const [volteada, setVolteada] = useState(false);
    const cardRef = useRef(null);
    const flipRef = useRef(null);

    // Movimiento mouse para efecto 3D
    const handleMouseMove = (e) => {
        if (volteada || !flipRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 0.8;

        flipRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    // Al salir del mouse, regreso a posición inicial
    const handleMouseLeave = () => {
        if (!volteada && flipRef.current) {
            flipRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    };

    // Botón ver detalle (voltea tarjeta)
    const handleVerDetalle = (e) => {
        e.preventDefault();
        setVolteada(true);
        if (flipRef.current) {
            flipRef.current.style.transform = 'rotateY(180deg)';
        }
    };

    // Botón volver (devuelve tarjeta a su cara frontal)
    const handleVolver = (e) => {
        e.preventDefault();
        setVolteada(false);
        if (flipRef.current) {
            flipRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
        }
    };

    return (
        <div
            className="tarjeta-evento-3d"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`carta-evento-flip ${volteada ? 'volteada' : ''}`} ref={flipRef}>
                {/* Cara frontal */}
                <div className="cara-frontal">
                    <img
                        className="imagen-evento"
                        src={evento.imagen}
                        alt={truncarTexto(evento.titulo, 30)}
                    />
                    <div className="informacion-evento">
                        <h3>{truncarTexto(evento.titulo, 50)}</h3>
                        <p><strong>📅 Fecha:</strong> {evento.fecha}</p>
                        <p><strong>📍 Lugar:</strong> {truncarTexto(evento.lugar, 50)}</p>
                        <span className="etiqueta-tipo">{evento.tipo}</span>
                    </div>
                    <button className="boton-detalle" onClick={handleVerDetalle}>
                        Ver Detalle
                    </button>
                </div>

                {/* Cara posterior */}
                <div className="cara-posterior">
                    <div className="informacion-evento">
                        <h3>{truncarTexto(evento.titulo, 40)}</h3>
                        <p><strong>📋 Descripción:</strong></p>
                        <p className="detalle-completo">{truncarTexto(evento.descripcion, 200)}</p>
                        <p><strong>👥 Capacidad:</strong> {evento.capacidad} personas</p>
                        <p><strong>💰 Precio:</strong> ${evento.precio.toLocaleString('es-CL')}</p>
                        <p><strong>👤 Organizador:</strong> {truncarTexto(evento.creadoPor, 30)}</p>
                        <p><strong>📆 Creado:</strong> {formatearFechaLegible(evento.fechaCreacion)}</p>
                    </div>
                    <button className="boton-volver" onClick={handleVolver}>
                        ← Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
