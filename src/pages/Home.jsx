// Página de inicio con secciones de bienvenida y "quiénes somos"

import { Link } from 'react-router-dom'; // Importar Link para navegación SPA
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/home.css';

function Home() {
    return (
        <>
            <Navbar />

            <main className="container my-5">
                {/* Sección de bienvenida con llamado a la acción */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-8 col-xl-7">
                        {/* ID preservado para estilos CSS personalizados */}
                        <div className="card border-0 shadow-lg" id="destacado">
                            <div className="card-body p-5 text-center">
                                <h2 className="card-title display-5 fw-bold mb-4 text-dark">
                                    Bienvenido a Eventos Chile
                                </h2>

                                {/* Texto con clase para animación CSS */}
                                <p className="card-text lead mb-4 text-secondary">
                                    Descubre, crea y gestiona tus eventos{' '}
                                    <span className="destacado-opcion">.</span>
                                </p>

                                {/* Botón que redirige a la página de eventos (navegación SPA) */}
                                <Link
                                    to="/eventos"
                                    className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm"
                                >
                                    Ver eventos
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quiénes somos? */}
                <section className="row justify-content-center">
                    <div className="col-lg-8 col-xl-7">
                        {/* ID preservado para navegación desde footer */}
                        <div className="card border-0 shadow" id="nosotros">
                            <div className="card-body p-4">
                                <h2 className="card-title h3 mb-3 text-dark">
                                    ¿Quiénes somos?
                                </h2>

                                <p className="card-text text-secondary lh-lg">
                                    Plataforma chilena dedicada a facilitar la organización y confirmación de asistencia
                                    a todo tipo de eventos. Con nosotros puedes crear eventos presenciales, en streaming
                                    o generar acceso por QR.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Home;
