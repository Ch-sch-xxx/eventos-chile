// src/pages/Eventos.jsx
// Página principal de eventos con carrusel infinito y grilla de tarjetas 3D

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCarousel from '../components/EventCarousel';
import EventCard from '../components/EventCard';
import { obtenerEventos } from '../services/eventos';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/eventos.css';

function Eventos() {
    const eventos = obtenerEventos();
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleAsistir = (evento) => {
        if (isLoggedIn()) {
            alert(`¡Asistencia confirmada! Verás "${evento.titulo}" en tu perfil.`);
        } else {
            alert('Por favor inicia sesión para confirmar asistencia.');
            navigate('/auth');
        }
    };

    return (
        <>
            <Navbar />

            <main className="container my-5">
                {/* Sección Carrusel Infinito - CON OVERFLOW CONTROLADO */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-10">
                        <h2 className="mb-4 text-center fw-bold">Eventos Destacados</h2>
                        <p className="mb-4 text-center fw-bold">Descubre las tendencias</p>
                    </div>
                    <EventCarousel eventos={eventos} />
                </section>

                {/* Sección Grid de Tarjetas 3D - CON CONTAINER LIMITADO */}
                <section className="eventos-tarjetas-3d container rounded shadow-lg py-4 my-4">
                    <div className="row gy-4 justify-content-center">
                        <h2 className="mb-4 text-center fw-bold">Todos los Eventos</h2>
                        <p className="mb-4 text-center fw-bold">
                            Explora en detalle cada evento
                        </p>
                    </div>
                    <div
                        id="contenedor-grid-eventos"
                        className="row g-4 justify-content-center"
                    >
                        {eventos.map((evento) => (
                            <div
                                key={evento.id}
                                className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
                            >
                                <EventCard
                                    evento={evento}
                                    onAsistir={handleAsistir}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Eventos;
