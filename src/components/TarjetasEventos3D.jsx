// components/TarjetasEventos3D.jsx - VERSIÓN COMPLETA Y CORREGIDA
import { useState, useEffect, useRef } from 'react';

function TarjetasEventos3D({ eventos }) {
  return (
    <section className="eventos-tarjetas-3d container rounded shadow-lg py-4 my-4">
      <h2 className="mb-4 text-center fw-bold">Todos los Eventos Disponibles</h2>
      <div className="row gy-4 justify-content-center" id="contenedor-grid-eventos">
        {eventos.map((evento, index) => (
          <div key={evento.id} className="col-md-6 col-lg-4 d-flex justify-content-center align-items-stretch mb-4">
            <TarjetaEvento3D evento={evento} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

function TarjetaEvento3D({ evento, index }) {
  const [volteada, setVolteada] = useState(false);
  const tarjetaRef = useRef(null);
  const flipRef = useRef(null);

  // Función para truncar texto (del JS original)
  const truncarTexto = (texto, maxCaracteres) => {
    if (typeof texto !== "string") return "";
    return texto.length > maxCaracteres ? texto.substring(0, maxCaracteres) + '...' : texto;
  };

  // Función para formatear fecha (del JS original)
  const formatearFechaLegible = (fechaISO) => {
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
  };

  // Efectos 3D con mouse (del JS original)
  useEffect(() => {
    const tarjeta = tarjetaRef.current;
    const flip = flipRef.current;

    if (!tarjeta || !flip) return;

    const handleMouseMove = (e) => {
      if (flip.classList.contains('volteada')) return;
      
      const rect = tarjeta.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8; // Corregido: era 0.8, ahora 8 para menor intensidad

      flip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      if (!flip.classList.contains('volteada')) {
        flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
      }
    };

    tarjeta.addEventListener('mousemove', handleMouseMove);
    tarjeta.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      tarjeta.removeEventListener('mousemove', handleMouseMove);
      tarjeta.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const manejarVoltear = () => {
    const flip = flipRef.current;
    setVolteada(!volteada);
    
    if (!volteada) {
      // Voltear hacia atrás
      flip.style.transform = 'rotateY(180deg)';
    } else {
      // Volver al frente
      flip.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  };

  // Manejo de asistir al evento (del JS original)
  const manejarAsistir = () => {
    const userLogged = localStorage.getItem('user-logged');

    if (userLogged === 'admin' || userLogged === 'usuario') {
      alert('¡Asistencia confirmada! Verás este evento en tu perfil.');
      // Aquí podrías agregar lógica para guardar asistencia en localStorage
    } else {
      alert('Por favor inicia sesión para confirmar asistencia.');
      // En React, usarías navigate('/auth') si tienes React Router
      window.location.href = '/auth'; // o la ruta que uses para login
    }
  };

  return (
    <div className="tarjeta-evento-3d" ref={tarjetaRef}>
      <div 
        className={`carta-evento-flip ${volteada ? 'volteada' : ''}`} 
        ref={flipRef}
        data-indice={index}
      >
        {/* Cara frontal */}
        <div className="cara-frontal">
          <img 
            src={evento.imagen} 
            alt={truncarTexto(evento.titulo, 30)}
            className="imagen-evento"
          />
          <div className="informacion-evento">
            <h3>{truncarTexto(evento.titulo, 50)}</h3>
            <p><strong>📅 Fecha:</strong> {evento.fecha}</p>
            <p><strong>📍 Lugar:</strong> {truncarTexto(evento.lugar, 50)}</p>
            <span className="etiqueta-tipo">{evento.tipo}</span>
          </div>
          <button className="boton-detalle" onClick={manejarVoltear}>
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
            <p><strong>💰 Precio:</strong> ${evento.precio}</p>
            <p><strong>👤 Organizador:</strong> {truncarTexto(evento.creadoPor, 30)}</p>
            <p><strong>📆 Creado:</strong> {formatearFechaLegible(evento.fechaCreacion) || evento.fecha}</p>
          </div>
          <button className="boton-volver" onClick={manejarVoltear}>
            ← Volver
          </button>
        </div>
      </div>
    </div>
  );
}

export default TarjetasEventos3D;
