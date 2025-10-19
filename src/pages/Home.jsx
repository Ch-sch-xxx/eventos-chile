// Página de inicio con secciones de bienvenida y "quiénes somos"
// Mejorada con más contenido, categorías y mejores CTA

import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import '../styles/home-mejoras.css';
import '../styles/home.css';

function Home() {
    return (
        <>
            <Navbar />

            <main className="container my-5">
                {/* Hero Section - Bienvenida Principal */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-10 col-xl-9">
                        <div className="card border-0 shadow-lg" id="destacado">
                            <div className="card-body p-5 text-center">
                                <h1 className="display-4 fw-bold mb-4 text-gradient">
                                    Bienvenido a Eventos Chile 🇨🇱
                                </h1>

                                <p className="lead mb-4 text-secondary fs-5">
                                    La plataforma chilena para <strong>descubrir</strong>, <strong>crear</strong> y <strong>gestionar</strong> eventos de todo tipo{' '}
                                    <span className="destacado-opcion">.</span>
                                </p>

                                <p className="text-muted mb-5">
                                    Desde conciertos hasta conferencias, encuentra lo que buscas o crea tu propio evento
                                    y llegue a miles de personas en todo Chile.
                                </p>

                                {/* CTAs mejorados */}
                                <div className="d-flex gap-3 justify-content-center flex-wrap">
                                    <Link
                                        to="/eventos"
                                        className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
                                    >
                                        🎉 Explorar Eventos
                                    </Link>
                                    <Link
                                        to="/auth"
                                        className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill"
                                    >
                                        ✨ Crear Cuenta
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categorías de Eventos */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-10 col-xl-9">
                        <h2 className="text-center mb-4 fw-bold">¿Qué tipo de evento buscas?</h2>
                        <p className="text-center text-muted mb-5">
                            Explora eventos de todas las categorías
                        </p>

                        <div className="row g-4">
                            {/* Música */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">🎵</div>
                                        <h4 className="card-title">Música</h4>
                                        <p className="card-text text-muted">
                                            Conciertos, festivales y presentaciones en vivo
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Cultura */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">🎭</div>
                                        <h4 className="card-title">Cultura</h4>
                                        <p className="card-text text-muted">
                                            Teatro, exposiciones y eventos artísticos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Deportes */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">⚽</div>
                                        <h4 className="card-title">Deportes</h4>
                                        <p className="card-text text-muted">
                                            Competencias, entrenamientos y torneos
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tecnología */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">💻</div>
                                        <h4 className="card-title">Tecnología</h4>
                                        <p className="card-text text-muted">
                                            Conferencias, workshops y hackatones
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Educación */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">📚</div>
                                        <h4 className="card-title">Educación</h4>
                                        <p className="card-text text-muted">
                                            Charlas, seminarios y cursos presenciales
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Gastronomía */}
                            <div className="col-md-4">
                                <div className="categoria-card card border-0 shadow-sm h-100">
                                    <div className="card-body text-center p-4">
                                        <div className="icono-categoria mb-3">🍷</div>
                                        <h4 className="card-title">Gastronomía</h4>
                                        <p className="card-text text-muted">
                                            Catas, ferias gastronómicas y degustaciones
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quiénes somos - Mejorado */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-10 col-xl-9">
                        <div className="card border-0 shadow" id="nosotros">
                            <div className="card-body p-5">
                                <h2 className="text-center mb-4 fw-bold">
                                    ¿Quiénes somos?
                                </h2>

                                <p className="text-secondary lh-lg text-center mb-4">
                                    Somos una <strong>plataforma chilena</strong> dedicada a facilitar la organización
                                    y confirmación de asistencia a todo tipo de eventos en Chile.
                                </p>

                                <div className="row g-4 mt-3">
                                    <div className="col-md-6">
                                        <div className="caracteristica-card">
                                            <h5>🎯 Nuestra Misión</h5>
                                            <p className="text-muted">
                                                Conectar a las personas con los eventos que les interesan,
                                                facilitando el acceso a experiencias culturales, deportivas,
                                                educativas y de entretenimiento.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="caracteristica-card">
                                            <h5>✨ ¿Qué Ofrecemos?</h5>
                                            <p className="text-muted">
                                                Creación de eventos presenciales, en streaming, gestión de asistencia,
                                                confirmaciones por correo y una plataforma intuitiva para organizadores.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center mt-5">
                                    <Link
                                        to="/eventos"
                                        className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
                                    >
                                        Comenzar Ahora
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Estadísticas o CTA Final */}
                <section className="row justify-content-center">
                    <div className="col-lg-10 col-xl-9">
                        <div className="cta-final card border-0 shadow-lg bg-gradient-primary text-white">
                            <div className="card-body p-5 text-center">
                                <h3 className="mb-3 fw-bold">
                                    ¿Listo para crear tu primer evento?
                                </h3>
                                <p className="mb-4 fs-5">
                                    Únete a cientos de organizadores que confían en Eventos Chile
                                </p>
                                <Link
                                    to="/auth"
                                    className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm"
                                >
                                    Crear Cuenta Gratis
                                </Link>
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
