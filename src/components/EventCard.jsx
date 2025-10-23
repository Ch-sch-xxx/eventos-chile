// Tarjeta 3D con flip + efecto mouse
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Eventos from '../assets/eventosIMG.png';
import { useAuth } from '../context/AuthContext';
import { contarAsistentes } from '../services/asistencia';
import ModalAsistencia from './ModalAsistencia';
import ModalDecisionAsistencia from './ModalDecisionAsistencia';

// Función auxiliar para recortar textos largos
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

    // Efecto 3D con mouse (solo cuando NO está volteada)
    const handleMouseMove = (e) => {
        if (volteada || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 7.80;
        const rotateY = (centerX - x) / 0.65;

        // Usar CSS variables para no interferir con la clase .volteada
        cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`);
        cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`);
    };

    // Al salir del mouse, resetear rotación
    const handleMouseLeave = () => {
        if (!volteada && cardRef.current) {
            cardRef.current.style.setProperty('--rotate-x', '0deg');
            cardRef.current.style.setProperty('--rotate-y', '0deg');
        }
    };

    // Botón ver detalle (voltea tarjeta)
    const handleVerDetalle = (e) => {
        e.preventDefault();
        setVolteada(true);
    };

    // Botón volver (devuelve tarjeta a su cara frontal)
    const handleVolver = (e) => {
        e.preventDefault();
        setVolteada(false);
    };

    // Abrir modal de asistencia
    const handleAsistir = (e) => {
        e.preventDefault();
        if (isLoggedIn()) {
            setMostrarModalAsistencia(true);
        } else {
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
            <div className={`carta-evento-flip ${volteada ? 'volteada' : ''}`}>
                {/* Cara frontal */}
                <div className="cara-frontal">
                    <img
                        className="imagen-evento"
                        src={evento.imagen || Eventos}
                        alt={truncarTexto(evento.titulo, 30)}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = Eventos;
                        }}
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
                        <p><strong>👥 Asistentes:</strong> {contarAsistentes(evento)}/{evento.capacidad}</p>
                        <p><strong>💰 Precio:</strong> {evento.precio === 0 ? 'Gratis' : `$${evento.precio.toLocaleString('es-CL')}`}</p>
                        <p><strong>👤 Organizador:</strong> {truncarTexto(evento.creadoPor, 30)}</p>
                        <p><strong>📆 Creado:</strong> {formatearFechaLegible(evento.fechaCreacion)}</p>
                    </div>

                    {/* Botones de acción */}
                    <div className="botones-cara-posterior">
                        <button className="boton-asistir" onClick={handleAsistir}>
                            ✓ Asistir
                        </button>
                        <button className="boton-volver" onClick={handleVolver}>
                            ← Volver
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de decisión (NO logueados) */}
            {mostrarModalDecision && createPortal(
                <ModalDecisionAsistencia
                    evento={evento}
                    onClose={() => setMostrarModalDecision(false)}
                    onSeleccionarInvitado={handleSeleccionarInvitado}
                />,
                document.body
            )}

            {/* Modal de asistencia */}
            {mostrarModalAsistencia && createPortal(
                <ModalAsistencia
                    evento={evento}
                    onClose={() => setMostrarModalAsistencia(false)}
                    onSuccess={() => console.log('Asistencia confirmada')}
                />,
                document.body
            )}
        </div>
    );
}

export default EventCard;
