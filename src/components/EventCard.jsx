// Tarjeta 3D con flip para mostrar detalles de un evento
// Portado desde eventos_interaccion.js SIN REACT
// - mantiene efectos de mouse y flip
// - ahora incluye sistema de asistencia con modal
// - modal se renderiza fuera de la tarjeta usando Portal

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Eventos from '../assets/eventosIMG.png';
import { useAuth } from '../context/AuthContext';
import ModalAsistencia from './ModalAsistencia';
import ModalDecisionAsistencia from './ModalDecisionAsistencia';

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

function EventCard({ evento }) {
    const { isLoggedIn } = useAuth();
    const [volteada, setVolteada] = useState(false);
    const [mostrarModalDecision, setMostrarModalDecision] = useState(false);
    const [mostrarModalAsistencia, setMostrarModalAsistencia] = useState(false);
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
        const rotateX = (y - centerY) / 7.80;
        const rotateY = (centerX - x) / 0.65;

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

    // Abrir modal de asistencia
    const handleAsistir = (e) => {
        e.preventDefault();

        // Si está logueado, va directo al modal de asistencia
        if (isLoggedIn()) {
            setMostrarModalAsistencia(true);
        } else {
            // Si NO está logueado, primero mostrar modal de decisión
            setMostrarModalDecision(true);
        }
    };

    // Handler cuando selecciona "Asistir como Invitado"
    const handleSeleccionarInvitado = () => {
        setMostrarModalDecision(false);
        setMostrarModalAsistencia(true);
    };

    return (
        <div
            className="tarjeta-evento-3d"
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`carta-evento-flip  ${volteada ? 'volteada' : ''}`} ref={flipRef}>
                {/* Cara frontal */}
                <div className="cara-frontal">
                    <img
                        className="imagen-evento"
                        src={Eventos}
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

                        {/* Contador de asistentes en cara posterior */}
                        <p><strong>👥 Asistentes:</strong> {evento.asistentes?.length || 0}/{evento.capacidad}</p>

                        <p><strong>💰 Precio:</strong> {evento.precio === 0 ? 'Gratis' : `$${evento.precio.toLocaleString('es-CL')}`}</p>
                        <p><strong>👤 Organizador:</strong> {truncarTexto(evento.creadoPor, 30)}</p>
                        <p><strong>📆 Creado:</strong> {formatearFechaLegible(evento.fechaCreacion)}</p>
                    </div>

                    {/* Botones de acción - mejor responsive */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', width: '100%' }}>
                        <button className="boton-asistir" onClick={handleAsistir} style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}>
                            ✓ Asistir
                        </button>
                        <button className="boton-volver" onClick={handleVolver} style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}>
                            ← Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de decisión (NO logueados) - Renderizado fuera de la tarjeta usando Portal */}
            {mostrarModalDecision && createPortal(
                <ModalDecisionAsistencia
                    evento={evento}
                    onClose={() => setMostrarModalDecision(false)}
                    onSeleccionarInvitado={handleSeleccionarInvitado}
                />,
                document.body
            )}

            {/* Modal de asistencia - Renderizado fuera de la tarjeta usando Portal */}
            {mostrarModalAsistencia && createPortal(
                <ModalAsistencia
                    evento={evento}
                    onClose={() => setMostrarModalAsistencia(false)}
                    onSuccess={() => {
                        // Opcional: recargar o mostrar mensaje
                        console.log('Asistencia confirmada exitosamente');
                    }}
                />,
                document.body
            )}
        </div>
    );
}

export default EventCard;
