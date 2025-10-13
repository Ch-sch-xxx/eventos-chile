// components/CarruselEventos.jsx - VERSIÓN COMPLETA CON SCROLL INFINITO
import { useEffect, useRef } from 'react';

function CarruselEventos({ eventos }) {
  const carruselRef = useRef(null);

  useEffect(() => {
    const carruselLista = carruselRef.current;
    if (!carruselLista || eventos.length === 0) return;

    // Lógica básica de scroll infinito (del JS original)
    const handleScroll = () => {
      // Fin derecho, salto adelante un pixel para no quedar pegado
      if (carruselLista.scrollLeft + carruselLista.clientWidth >= carruselLista.scrollWidth - 1) {
        carruselLista.scrollLeft = 1;
      }
      // Inicio, salto a mitad del scroll
      if (carruselLista.scrollLeft === 0) {
        carruselLista.scrollLeft = carruselLista.scrollWidth / 2;
      }
    };

    carruselLista.addEventListener('scroll', handleScroll);

    // Auto-scroll (del JS original) - se mueve solo
    const autoScrollInterval = setInterval(() => {
      carruselLista.scrollLeft += 1.2;
    }, 18);

    // Cleanup
    return () => {
      carruselLista.removeEventListener('scroll', handleScroll);
      clearInterval(autoScrollInterval);
    };
  }, [eventos]);

  // Función para truncar texto (del JS original)
  const truncarTexto = (texto, maxCaracteres) => {
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
  };

  // Duplicar el array para dar efecto de loop infinito (del JS original)
  const eventosDobles = [...eventos, ...eventos];

  return (
    <section className="row justify-content-center mb-5">
      <div className="col-lg-10">
        <div className="carrusel-eventos">
          <div 
            className="carrusel-lista" 
            id="carrusel-lista"
            ref={carruselRef}
          >
            {eventosDobles.map((evento, index) => (
              <TarjetaCarrusel 
                key={`${evento.id}-${index}`} // Key único para eventos duplicados
                evento={evento} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TarjetaCarrusel({ evento }) {
  // Función para truncar texto
  const truncarTexto = (texto, maxCaracteres) => {
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
  };

  // Manejo de asistir al evento (del JS original)
  const manejarAsistir = () => {
    const userLogged = localStorage.getItem('user-logged');

    if (userLogged === 'admin' || userLogged === 'usuario') {
      // Sí hay sesión, mostrar confirmación de asistencia
      alert('¡Asistencia confirmada! Verás este evento en tu perfil.');
      // Aquí podrías agregar lógica para guardar asistencia en localStorage
    } else {
      // Si NO hay sesión, redirigir a login
      alert('Por favor inicia sesión para confirmar asistencia.');
      window.location.href = '/auth'; // Ajustar según tu ruta de login
    }
  };

  return (
    <article className="Tarjetas">
      <img 
        className="img-tarjeta-evento" 
        src={evento.imagen} 
        alt="Imagen evento"
      />
      <h3>{truncarTexto(evento.titulo, 40)}</h3>
      <p>
        📅 Fecha: {evento.fecha}<br/>
        📍 Lugar: {truncarTexto(evento.lugar, 50)}
      </p>
      <p><b className="tipo-evento">{evento.tipo}</b></p>
      <button className="btn-asistir" onClick={manejarAsistir}>
        Asistir al Evento
      </button>
    </article>
  );
}

export default CarruselEventos;
