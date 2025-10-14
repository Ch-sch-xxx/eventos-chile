import { useState, useEffect } from 'react';
import CarruselEventos from '../components/CarruselEventos';
import TarjetasEventos3D from '../components/TarjetasEventos3D';
import { obtenerEventos } from '../util/localStorage';
import '../css/EventosStyle.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    const eventosData = obtenerEventos();
    setEventos(eventosData);
  }, []);

  return (
    <main className="container my-5">
      <CarruselEventos eventos={eventos.slice(0, 5)} />
      <TarjetasEventos3D eventos={eventos} />
    </main>
  );
}

export default Eventos;
