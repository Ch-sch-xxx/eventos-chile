// Página principal de eventos con carrusel infinito y grilla de tarjetas 3D
// Mejorada con buscador, filtros, ordenamiento y mejor UX

import { useMemo, useState } from 'react';
import EventCard from '../components/EventCard';
import EventCarousel from '../components/EventCarousel';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { obtenerEventos } from '../services/eventos';
import '../styles/eventos.css';

function Eventos() {
    const todosLosEventos = obtenerEventos();

    // Estados para filtros y búsqueda
    const [busqueda, setBusqueda] = useState('');
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [filtroCategoria, setFiltroCategoria] = useState('todos');
    const [ordenamiento, setOrdenamiento] = useState('fecha');

    // Obtener tipos únicos de eventos
    const tiposDisponibles = useMemo(() => {
        const tipos = [...new Set(todosLosEventos.map(e => e.tipo))];
        return tipos.sort();
    }, [todosLosEventos]);

    // Obtener categorías únicas
    const categoriasDisponibles = useMemo(() => {
        const categorias = [...new Set(todosLosEventos.map(e => e.categoria))];
        return categorias.sort();
    }, [todosLosEventos]);

    // Filtrar y ordenar eventos
    const eventosFiltrados = useMemo(() => {
        let resultado = [...todosLosEventos];

        // Filtro por búsqueda
        if (busqueda.trim()) {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(e =>
                e.titulo.toLowerCase().includes(termino) ||
                e.descripcion.toLowerCase().includes(termino) ||
                e.lugar.toLowerCase().includes(termino) ||
                e.creadoPor.toLowerCase().includes(termino)
            );
        }

        // Filtro por tipo
        if (filtroTipo !== 'todos') {
            resultado = resultado.filter(e => e.tipo === filtroTipo);
        }

        // Filtro por categoría
        if (filtroCategoria !== 'todos') {
            resultado = resultado.filter(e => e.categoria === filtroCategoria);
        }

        // Ordenamiento
        switch (ordenamiento) {
            case 'fecha':
                resultado.sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));
                break;
            case 'titulo':
                resultado.sort((a, b) => a.titulo.localeCompare(b.titulo));
                break;
            case 'precio-asc':
                resultado.sort((a, b) => a.precio - b.precio);
                break;
            case 'precio-desc':
                resultado.sort((a, b) => b.precio - a.precio);
                break;
            case 'cupos':
                resultado.sort((a, b) => {
                    const cuposA = a.capacidad - (a.asistentes?.length || 0);
                    const cuposB = b.capacidad - (b.asistentes?.length || 0);
                    return cuposB - cuposA;
                });
                break;
            default:
                break;
        }

        return resultado;
    }, [todosLosEventos, busqueda, filtroTipo, filtroCategoria, ordenamiento]);

    // Limpiar todos los filtros
    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroTipo('todos');
        setFiltroCategoria('todos');
        setOrdenamiento('fecha');
    };

    return (
        <>
            <Navbar />

            <main className="container my-5">
                {/* Sección Carrusel Infinito */}
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-10">
                        <h2 className="mb-4 text-center fw-bold">Eventos Destacados</h2>
                        <p className="mb-4 text-center text-muted">Descubre las tendencias del momento</p>
                    </div>

                    <div className="carrusel-eventos">
                        <EventCarousel eventos={todosLosEventos} />
                    </div>
                </section>

                {/* Sección de Filtros y Búsqueda */}
                <section className="row justify-content-center mb-4">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-sm p-4">
                            <h3 className="mb-3 fw-bold">
                                🔍 Encuentra tu evento ideal
                            </h3>

                            {/* Barra de búsqueda */}
                            <div className="row g-3">
                                <div className="col-md-12">
                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-white">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Buscar por título, descripción, lugar u organizador..."
                                            value={busqueda}
                                            onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                        {busqueda && (
                                            <button
                                                className="btn btn-outline-secondary"
                                                onClick={() => setBusqueda('')}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Filtros */}
                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Tipo de Evento</label>
                                    <select
                                        className="form-select"
                                        value={filtroTipo}
                                        onChange={(e) => setFiltroTipo(e.target.value)}
                                    >
                                        <option value="todos">Todos los tipos</option>
                                        {tiposDisponibles.map(tipo => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Categoría</label>
                                    <select
                                        className="form-select"
                                        value={filtroCategoria}
                                        onChange={(e) => setFiltroCategoria(e.target.value)}
                                    >
                                        <option value="todos">Todas las categorías</option>
                                        {categoriasDisponibles.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label fw-semibold">Ordenar por</label>
                                    <select
                                        className="form-select"
                                        value={ordenamiento}
                                        onChange={(e) => setOrdenamiento(e.target.value)}
                                    >
                                        <option value="fecha">Fecha de creación</option>
                                        <option value="titulo">Nombre (A-Z)</option>
                                        <option value="precio-asc">Precio (menor a mayor)</option>
                                        <option value="precio-desc">Precio (mayor a menor)</option>
                                        <option value="cupos">Cupos disponibles</option>
                                    </select>
                                </div>
                            </div>

                            {/* Botón limpiar filtros */}
                            {(busqueda || filtroTipo !== 'todos' || filtroCategoria !== 'todos' || ordenamiento !== 'fecha') && (
                                <div className="text-center mt-3">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={limpiarFiltros}
                                    >
                                        🔄 Limpiar Filtros
                                    </button>
                                </div>
                            )}

                            {/* Contador de resultados */}
                            <div className="mt-3 text-center">
                                <span className="badge bg-primary fs-6">
                                    {eventosFiltrados.length} evento{eventosFiltrados.length !== 1 ? 's' : ''} encontrado{eventosFiltrados.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección Grid de Tarjetas 3D */}
                <section className="eventos-tarjetas-3d container rounded shadow-lg py-4 my-4">
                    <div className="row gy-4 justify-content-center">
                        <h2 className="mb-4 text-center fw-bold">
                            {eventosFiltrados.length > 0 ? 'Resultados de Búsqueda' : 'No hay resultados'}
                        </h2>
                        {eventosFiltrados.length > 0 ? (
                            <p className="mb-4 text-center text-muted">
                                Explora en detalle cada evento
                            </p>
                        ) : (
                            <p className="mb-4 text-center text-muted">
                                No se encontraron eventos con los filtros seleccionados.
                                <button
                                    className="btn btn-link"
                                    onClick={limpiarFiltros}
                                >
                                    Limpiar filtros
                                </button>
                            </p>
                        )}
                    </div>

                    {/* Grid de eventos */}
                    <div id="contenedor-grid-eventos" className="row g-4 justify-content-center">
                        {eventosFiltrados.length > 0 ? (
                            eventosFiltrados.map((evento) => (
                                <div
                                    key={evento.id}
                                    className="col-md-6 col-lg-4 d-flex justify-content-center align-items-stretch mb-4"
                                >
                                    <EventCard evento={evento} />
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">
                                <div className="sin-resultados">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="text-muted mb-3" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                                    </svg>
                                    <h4 className="text-muted">No hay eventos disponibles</h4>
                                    <p className="text-muted">Intenta ajustar tus filtros o búsqueda</p>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Eventos;
