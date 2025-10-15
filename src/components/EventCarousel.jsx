// Carrusel infinito de eventos con auto-scroll
// Portado desde eventos_interaccion.js SIN REACT -
// mantiene lógica de loop infinito

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Función auxiliar para recortar textos largos
function truncarTexto(texto, maxCaracteres) {
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
}

function EventCarousel({ eventos }) {
    const carruselRef = useRef(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    // Auto-scroll y lógica de loop infinito
    useEffect(() => {
        const carrusel = carruselRef.current;
        if (!carrusel) return;

        // Auto-scroll suave cada 18ms
        const intervalo = setInterval(() => {
            carrusel.scrollLeft += 1.2;
        }, 18);

        // Lógica de scroll infinito: si llego al final, vuelvo al inicio
        const handleScroll = () => {
            // Fin derecho, salto adelante un pixel para no quedar pegado
            if (carrusel.scrollLeft + carrusel.clientWidth >= carrusel.scrollWidth - 1) {
                carrusel.scrollLeft = 1;
            }
            // Inicio, salto a mitad del scroll
            if (carrusel.scrollLeft === 0) {
                carrusel.scrollLeft = carrusel.scrollWidth / 2;
            }
        };

        carrusel.addEventListener('scroll', handleScroll);

        // Cleanup al desmontar componente
        return () => {
            clearInterval(intervalo);
            carrusel.removeEventListener('scroll', handleScroll);
        };
    }, [eventos]);

    // Autenticación al "Asistir al Evento" - redirige o muestra mensaje según sesión
    const handleAsistir = (evento) => {
        if (isLoggedIn()) {
            // Sí hay sesión, mostrar confirmación de asistencia
            alert(`¡Asistencia confirmada! Verás "${evento.titulo}" en tu perfil.`);
            // Aquí podrías agregar lógica para guardar asistencia en localStorage
        } else {
            // Si NO hay sesión, redirigir a login
            alert('Por favor inicia sesión para confirmar asistencia.');
            navigate('/auth');
        }
    };

    // Duplicar el array para dar efecto de loop infinito
    const eventosDobles = [...eventos, ...eventos];

    return (
        <div id="carrusel-lista" className="carrusel-lista" ref={carruselRef}>
            {eventosDobles.map((evento, index) => (
                <article className="Tarjetas" key={`${evento.id}-${index}`}>
                    <img
                        className="img-tarjeta-evento"
                        src={evento.imagen}
                        alt="Imagen evento"
                    />
                    <h3>{truncarTexto(evento.titulo, 40)}</h3>
                    <p>
                        📅 Fecha: {evento.fecha}<br />
                        📍 Lugar: {truncarTexto(evento.lugar, 50)}
                    </p>
                    <p><b className="tipo-evento">{evento.tipo}</b></p>
                    <button
                        className="btn-asistir"
                        onClick={() => handleAsistir(evento)}
                    >
                        Asistir al Evento
                    </button>
                </article>
            ))}
        </div>
    );
}

export default EventCarousel;
