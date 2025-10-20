// Página de perfil con información del usuario, eventos y estadísticas
// Incluye formulario de edición con regiones/comunas dinámicas

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import iconoPerfil from '../assets/ICONOperfil.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { contarAsistentes, obtenerAsistentesPorEvento } from '../services/asistencia';
import { listarEventos, obtenerEventosPorUsuario } from '../services/eventos';
import '../styles/perfil.css';

// Importo las regiones desde el archivo centralizado
import { regionesYcomunas } from '../data/ubicaciones';

// FUNCIONES AUXILIARES
function contarTotalUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}

function Perfil() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // ESTADOS
    const [modoEdicion, setModoEdicion] = useState(false);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        fotoUrl: '',
        region: '',
        comuna: ''
    });
    const [comunasDisponibles, setComunasDisponibles] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        eventosCreados: 0,
        totalUsuarios: 0
    });
    const [modalAsistentes, setModalAsistentes] = useState({
        mostrar: false,
        eventoId: null,
        eventoTitulo: '',
        asistentes: []
    });
    const [mostrarTodosEventos, setMostrarTodosEventos] = useState(false);

    // CARGAR DATOS AL MONTAR
    useEffect(() => {
        cargarDatosUsuario();
        cargarEventosUsuario();
        actualizarEstadisticas();
    }, [user]);

    // Actualizar comunas cuando cambia región en el formulario
    useEffect(() => {
        if (formData.region && regionesYcomunas[formData.region]) {
            setComunasDisponibles(regionesYcomunas[formData.region]);
        } else {
            setComunasDisponibles([]);
        }
    }, [formData.region]);

    // FUNCIÓN: Cargar datos del usuario
    const cargarDatosUsuario = () => {
        let data = {};

        // Admin
        if (isAdmin()) {
            const storedData = localStorage.getItem('user-data');
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (e) {
                    data = {
                        name: 'Administrador Sistema',
                        email: user.email,
                        region: 'Región Metropolitana',
                        comuna: 'Santiago',
                        fotoUrl: iconoPerfil
                    };
                }
            } else {
                data = {
                    name: 'Administrador Sistema',
                    email: user.email,
                    region: 'Región Metropolitana',
                    comuna: 'Santiago',
                    fotoUrl: iconoPerfil
                };
            }
        }
        // Usuario normal
        else {
            const storedData = localStorage.getItem('user-data');
            if (storedData) {
                try {
                    data = JSON.parse(storedData);
                } catch (e) {
                    // Buscar en array de usuarios
                    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
                    const usuario = usuarios.find(u => u.email === user.email);
                    data = usuario || {
                        name: 'Usuario Sin Nombre',
                        email: user.email,
                        fotoUrl: iconoPerfil
                    };
                }
            } else {
                const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
                const usuario = usuarios.find(u => u.email === user.email);
                data = usuario || {
                    name: 'Usuario Sin Nombre',
                    email: user.email,
                    fotoUrl: iconoPerfil
                };
            }
        }

        setUserData(data);
        setFormData({
            name: data.name || '',
            email: data.email || user.email,
            fotoUrl: data.fotoUrl || '',
            region: data.region || '',
            comuna: data.comuna || ''
        });
    };

    // FUNCIÓN: Cargar eventos del usuario
    const cargarEventosUsuario = () => {
        if (isAdmin()) {
            // Admin ve todos
            setEventos(listarEventos());
        } else {
            // Usuario ve solo los suyos
            setEventos(obtenerEventosPorUsuario(user.email));
        }
    };

    // FUNCIÓN: Actualizar estadísticas
    const actualizarEstadisticas = () => {
        if (isAdmin()) {
            const totalEventos = listarEventos().length;
            const totalUsuarios = contarTotalUsuarios();
            setEstadisticas({
                eventosCreados: totalEventos,
                totalUsuarios: totalUsuarios
            });
        } else {
            const eventosUsuario = obtenerEventosPorUsuario(user.email).length;
            setEstadisticas({
                eventosCreados: eventosUsuario,
                totalUsuarios: 0
            });
        }
    };


    // FUNCIÓN: Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // FUNCIÓN: Manejar upload de foto
    const handleFotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        // Validar tamaño (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no debe pesar más de 2MB');
            return;
        }

        // Convertir a base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                fotoUrl: reader.result
            }));
        };
        reader.readAsDataURL(file);
    };

    // FUNCIÓN: Ver asistentes de un evento
    const handleVerAsistentes = (evento) => {
        const asistentes = obtenerAsistentesPorEvento(evento.id);
        setModalAsistentes({
            mostrar: true,
            eventoId: evento.id,
            eventoTitulo: evento.titulo,
            asistentes: asistentes
        });
    };

    // FUNCIÓN: Cerrar modal de asistentes
    const cerrarModalAsistentes = () => {
        setModalAsistentes({
            mostrar: false,
            eventoId: null,
            eventoTitulo: '',
            asistentes: []
        });
    };


    // FUNCIÓN: Guardar perfil
    const handleGuardarPerfil = (e) => {
        e.preventDefault();

        const { name, email, fotoUrl, region, comuna } = formData;

        // Validaciones
        if (!name || name.trim().length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!email || !email.includes('@') || !email.includes('.')) {
            alert('Ingresa un email válido');
            return;
        }

        if (!region || !comuna) {
            alert('Selecciona región y comuna');
            return;
        }

        // Construir objeto
        const nuevosDatos = {
            name: name.trim(),
            email: email.trim(),
            region,
            comuna,
            fotoUrl: fotoUrl.trim() || iconoPerfil,
            fechaActualizacion: new Date().toISOString()
        };

        try {
            if (isAdmin()) {
                // Admin: guardar en user-data
                localStorage.setItem('user-data', JSON.stringify(nuevosDatos));
            } else {
                // Usuario: actualizar array
                const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
                const indiceUsuario = usuarios.findIndex(u => u.email === user.email);

                if (indiceUsuario !== -1) {
                    const usuarioOriginal = usuarios[indiceUsuario];
                    usuarios[indiceUsuario] = {
                        ...usuarioOriginal,
                        ...nuevosDatos,
                        rut: usuarioOriginal.rut,
                        password: usuarioOriginal.password,
                        fechaRegistro: usuarioOriginal.fechaRegistro
                    };

                    localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
                    localStorage.setItem('user-data', JSON.stringify(usuarios[indiceUsuario]));
                } else {
                    alert('Error: Usuario no encontrado en el sistema');
                    return;
                }
            }

            // Actualizar email si cambió
            if (email !== user.email) {
                localStorage.setItem('user-email', email);
            }

            alert('Perfil actualizado exitosamente');
            setModoEdicion(false);
            cargarDatosUsuario();
            actualizarEstadisticas();

        } catch (error) {
            console.error('Error al guardar perfil:', error);
            alert('Error al guardar el perfil. Inténtalo de nuevo.');
        }
    };

    // RENDERIZADO
    if (!userData) {
        return (
            <>
                <Navbar />
                <div className="container my-5 text-center">
                    <p>Cargando perfil...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="container my-5">

                {/* HERO CON FOTO DE PERFIL */}
                <section className="row justify-content-center mb-4">
                    <div className="col-12 col-lg-10 col-xl-9">
                        <div className="perfil-hero-card">
                            <div className="perfil-hero-background">
                                <div className="hero-pattern"></div>
                            </div>

                            <div className="perfil-hero-content">
                                <div className="imagen-container-mejorado">
                                    {/* Anillos del portal con runas */}
                                    <div className="anillo-portal-1"></div>
                                    <div className="anillo-portal-2"></div>
                                    <div className="anillo-portal-3"></div>

                                    {/* Partículas orbitando */}
                                    {[...Array(8)].map((_, i) => (
                                        <span key={i} className="particula-portal"></span>
                                    ))}

                                    {/* Imagen de perfil */}
                                    <img
                                        src={formData.fotoUrl || iconoPerfil}
                                        alt="Foto de perfil"
                                        className="imagen-perfil-mejorado"
                                        onError={(e) => { e.target.src = iconoPerfil; }}
                                    />
                                </div>

                                <div className="info-basica-mejorada">
                                    <h2 className="perfil-nombre">{userData.name || 'Usuario'}</h2>
                                    <p className="perfil-email">{userData.email || user.email}</p>
                                    {userData.region && userData.comuna && (
                                        <p className="perfil-ubicacion">
                                            📍 {userData.comuna}, {userData.region}
                                        </p>
                                    )}
                                    <div className="perfil-badges">
                                        <span className={`badge-rol-mejorado ${isAdmin() ? 'admin' : 'user'}`}>
                                            {isAdmin() ? '👑 Administrador' : '👤 Usuario'}
                                        </span>
                                        <span className="badge-eventos">
                                            🎉 {estadisticas.eventosCreados} {estadisticas.eventosCreados === 1 ? 'evento' : 'eventos'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ACCORDION */}
                <section className="row justify-content-center">
                    <div className="col-lg-10 col-xl-9">
                        <div className="accordion accordion-flush" id="accordionPerfil">

                            {/* ITEM 1: MI INFORMACIÓN */}
                            <div className="accordion-item mb-3 rounded shadow-sm">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button fw-bold"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseInfo"
                                        aria-expanded="true"
                                    >
                                        📋 Mi Información Personal
                                    </button>
                                </h2>
                                <div id="collapseInfo" className="accordion-collapse collapse show" data-bs-parent="#accordionPerfil">
                                    <div className="accordion-body">

                                        {/* VISTA DE SOLO LECTURA */}
                                        {!modoEdicion && (
                                            <div>
                                                <h3 className="h5 mb-4 fw-bold text-center">Información Actual</h3>

                                                <div className="vista-datos">
                                                    <div className="dato-item row mb-3">
                                                        <div className="col-5 col-md-4"><strong>Nombre:</strong></div>
                                                        <div className="col-7 col-md-8">{userData.name || 'No registrado'}</div>
                                                    </div>
                                                    <div className="dato-item row mb-3">
                                                        <div className="col-5 col-md-4"><strong>Email:</strong></div>
                                                        <div className="col-7 col-md-8">{userData.email || user.email}</div>
                                                    </div>
                                                    <div className="dato-item row mb-3">
                                                        <div className="col-5 col-md-4"><strong>RUT:</strong></div>
                                                        <div className="col-7 col-md-8">{userData.rut || 'No registrado'}</div>
                                                    </div>
                                                    <div className="dato-item row mb-3">
                                                        <div className="col-5 col-md-4"><strong>Región:</strong></div>
                                                        <div className="col-7 col-md-8">{userData.region || 'No registrada'}</div>
                                                    </div>
                                                    <div className="dato-item row mb-3">
                                                        <div className="col-5 col-md-4"><strong>Comuna:</strong></div>
                                                        <div className="col-7 col-md-8">{userData.comuna || 'No registrada'}</div>
                                                    </div>
                                                </div>

                                                <div className="text-center mt-4">
                                                    <button
                                                        className="btn btn-primary px-5 py-2 fw-bold"
                                                        onClick={() => setModoEdicion(true)}
                                                    >
                                                        Editar mi información
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* FORMULARIO DE EDICIÓN */}
                                        {modoEdicion && (
                                            <div>
                                                <h3 className="h5 mb-4 fw-bold text-center">Editar Información</h3>

                                                <form onSubmit={handleGuardarPerfil}>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <label htmlFor="name" className="form-label">Nombre completo</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="name"
                                                                value={formData.name}
                                                                onChange={handleInputChange}
                                                                required
                                                                placeholder="Tu nombre completo"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="email" className="form-label">Email</label>
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                id="email"
                                                                value={formData.email}
                                                                onChange={handleInputChange}
                                                                required
                                                                placeholder="ejemplo@correo.cl"
                                                            />
                                                        </div>

                                                        <div className="col-12">
                                                            <label htmlFor="fotoUrl" className="form-label">Foto de perfil</label>

                                                            {/* Vista previa de la foto */}
                                                            {formData.fotoUrl && (
                                                                <div className="mb-3 text-center">
                                                                    <img
                                                                        src={formData.fotoUrl}
                                                                        alt="Vista previa"
                                                                        style={{
                                                                            width: '120px',
                                                                            height: '120px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '50%',
                                                                            border: '3px solid #0d6efd'
                                                                        }}
                                                                        onError={(e) => { e.target.src = iconoPerfil; }}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Botón para subir foto */}
                                                            <div className="mb-2">
                                                                <input
                                                                    type="file"
                                                                    className="form-control"
                                                                    id="fotoFile"
                                                                    accept="image/*"
                                                                    onChange={handleFotoUpload}
                                                                />
                                                                <small className="form-text text-muted">Sube una imagen (máx. 2MB)</small>
                                                            </div>

                                                            {/* O pegar URL */}
                                                            <div className="text-center my-2">
                                                                <small className="text-muted">- o pega una URL -</small>
                                                            </div>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="fotoUrl"
                                                                value={formData.fotoUrl}
                                                                onChange={handleInputChange}
                                                                placeholder="https://ejemplo.com/foto.jpg"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="region" className="form-label">Región</label>
                                                            <select
                                                                className="form-select"
                                                                id="region"
                                                                value={formData.region}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <option value="">Selecciona región</option>
                                                                {Object.keys(regionesYcomunas).map((region) => (
                                                                    <option key={region} value={region}>{region}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="comuna" className="form-label">Comuna</label>
                                                            <select
                                                                className="form-select"
                                                                id="comuna"
                                                                value={formData.comuna}
                                                                onChange={handleInputChange}
                                                                required
                                                                disabled={!formData.region}
                                                            >
                                                                <option value="">Selecciona comuna</option>
                                                                {comunasDisponibles.map((comuna) => (
                                                                    <option key={comuna} value={comuna}>{comuna}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="col-12 text-center mt-4">
                                                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold me-2">
                                                                Guardar cambios
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary px-4 py-2 fw-bold"
                                                                onClick={() => {
                                                                    setModoEdicion(false);
                                                                    cargarDatosUsuario();
                                                                }}
                                                            >
                                                                Cancelar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* ITEM 2: MIS EVENTOS */}
                            <div className="accordion-item mb-3 rounded shadow-sm">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed fw-bold"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseEventos"
                                        aria-expanded="false"
                                    >
                                        🎉 {isAdmin() ? 'Todos los Eventos del Sistema' : 'Mis Eventos Creados'}
                                        <span className="badge bg-primary ms-2">{eventos.length}</span>
                                    </button>
                                </h2>
                                <div id="collapseEventos" className="accordion-collapse collapse" data-bs-parent="#accordionPerfil">
                                    <div className="accordion-body p-4">
                                        {eventos.length === 0 ? (
                                            <div className="sin-eventos-mensaje">
                                                <div className="sin-eventos-icon">📅</div>
                                                <p>{isAdmin() ? 'No hay eventos en el sistema' : 'No has creado eventos aún'}</p>
                                                <Link to={isAdmin() ? "/admin" : "/eventos"} className="btn btn-primary btn-sm mt-2">
                                                    {isAdmin() ? 'Ir al Panel Admin' : 'Explorar Eventos'}
                                                </Link>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="eventos-grid-compacto">
                                                    {(mostrarTodosEventos ? eventos : eventos.slice(0, 6)).map((evento) => (
                                                        <div key={evento.id} className="evento-card-compacto">
                                                            <div className="evento-compacto-header">
                                                                <span className="evento-compacto-tipo">{evento.tipo}</span>
                                                                {isAdmin() && evento.creadoPor && (
                                                                    <span className="evento-compacto-autor" title={`Creado por ${evento.creadoPor}`}>
                                                                        👤
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <h5 className="evento-compacto-titulo">{evento.titulo}</h5>

                                                            <div className="evento-compacto-info">
                                                                <div className="info-compacto-item">
                                                                    <span className="icon">📅</span>
                                                                    <span className="text">{evento.fecha}</span>
                                                                </div>
                                                                <div className="info-compacto-item">
                                                                    <span className="icon">⏰</span>
                                                                    <span className="text">{evento.hora || 'Por definir'}</span>
                                                                </div>
                                                                <div className="info-compacto-item">
                                                                    <span className="icon">📍</span>
                                                                    <span className="text">{evento.lugar}</span>
                                                                </div>
                                                            </div>

                                                            <div className="evento-compacto-footer">
                                                                <div className="asistentes-count">
                                                                    <span className="icon">👥</span>
                                                                    <span className="count">{contarAsistentes(evento)}</span>
                                                                    <span className="total">/ {evento.capacidad || '∞'}</span>
                                                                </div>
                                                                <button
                                                                    className="btn-ver-participantes"
                                                                    onClick={() => handleVerAsistentes(evento)}
                                                                >
                                                                    Ver participantes
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {eventos.length > 6 && (
                                                    <div className="text-center mt-4">
                                                        <button
                                                            className="btn btn-outline-primary"
                                                            onClick={() => setMostrarTodosEventos(!mostrarTodosEventos)}
                                                        >
                                                            {mostrarTodosEventos ? '👆 Ver menos' : `👇 Ver todos (${eventos.length})`}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ITEM 3: ESTADÍSTICAS */}
                            <div className="accordion-item mb-3 rounded shadow-sm">
                                <h2 className="accordion-header">
                                    <button
                                        className="accordion-button collapsed fw-bold"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#collapseStats"
                                        aria-expanded="false"
                                    >
                                        📊 Mis Estadísticas
                                    </button>
                                </h2>
                                <div id="collapseStats" className="accordion-collapse collapse" data-bs-parent="#accordionPerfil">
                                    <div className="accordion-body">
                                        <div className="row g-4 text-center">
                                            <div className="col-md-6">
                                                <div className="stat-card p-4 rounded shadow-sm">
                                                    <span className="numero-stat display-4 fw-bold d-block mb-2">
                                                        {estadisticas.eventosCreados}
                                                    </span>
                                                    <span className="label-stat text-muted">Eventos creados</span>
                                                </div>
                                            </div>
                                            {isAdmin() && (
                                                <div className="col-md-6">
                                                    <div className="stat-card p-4 rounded shadow-sm">
                                                        <span className="numero-stat display-4 fw-bold d-block mb-2">
                                                            {estadisticas.totalUsuarios}
                                                        </span>
                                                        <span className="label-stat text-muted">Usuarios registrados</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ACCIONES RÁPIDAS */}
                <section className="row justify-content-center mt-5 mb-5">
                    <div className="col-lg-8 col-xl-7">
                        <div className="card border-0 shadow-lg">
                            <div className="card-body p-4">
                                <h2 className="card-title h5 mb-4 text-center fw-bold">⚡ Acciones Rápidas</h2>

                                <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <Link to="/eventos" className="btn btn-primary px-4 py-2 fw-bold">
                                        Ver todos los eventos
                                    </Link>
                                    <Link to="/admin" className="btn btn-primary px-4 py-2 fw-bold">
                                        {isAdmin() ? 'Ir a Panel Admin' : 'Ir a mi panel'}
                                    </Link>
                                    <Link to="/" className="btn btn-secondary px-4 py-2 fw-bold">
                                        Ir al inicio
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* MODAL DE PARTICIPANTES */}
            {modalAsistentes.mostrar && (
                <div className="modal-overlay-participantes" onClick={cerrarModalAsistentes}>
                    <div className="modal-content-participantes" onClick={(e) => e.stopPropagation()}>

                        {/* Header mejorado */}
                        <div className="modal-header-participantes">
                            <div className="header-titulo-section">
                                <div className="header-icon">👥</div>
                                <div>
                                    <h3 className="header-titulo">Participantes</h3>
                                    <p className="header-subtitulo">{modalAsistentes.eventoTitulo}</p>
                                </div>
                            </div>
                            <button className="btn-cerrar-modal-nuevo" onClick={cerrarModalAsistentes}>
                                <span>✕</span>
                            </button>
                        </div>

                        <div className="modal-body-participantes">
                            {modalAsistentes.asistentes.length === 0 ? (
                                <div className="sin-participantes-estado">
                                    <div className="estado-icono">😔</div>
                                    <h4>Sin confirmaciones aún</h4>
                                    <p>Este evento todavía no tiene participantes confirmados</p>
                                </div>
                            ) : (
                                <>
                                    {/* Stats mejoradas */}
                                    <div className="participantes-stats-mejorado">
                                        <div className="stat-card-modal total">
                                            <div className="stat-icono">👥</div>
                                            <div className="stat-info">
                                                <span className="stat-numero-grande">{modalAsistentes.asistentes.length}</span>
                                                <span className="stat-texto">Total Participantes</span>
                                            </div>
                                        </div>
                                        <div className="stat-card-modal registrados">
                                            <div className="stat-icono">✓</div>
                                            <div className="stat-info">
                                                <span className="stat-numero-grande">
                                                    {modalAsistentes.asistentes.filter(a => a.tipoAsistente === 'registrado').length}
                                                </span>
                                                <span className="stat-texto">Registrados</span>
                                            </div>
                                        </div>
                                        <div className="stat-card-modal invitados">
                                            <div className="stat-icono">✉</div>
                                            <div className="stat-info">
                                                <span className="stat-numero-grande">
                                                    {modalAsistentes.asistentes.filter(a => a.tipoAsistente === 'invitado').length}
                                                </span>
                                                <span className="stat-texto">Invitados</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lista mejorada */}
                                    <div className="lista-participantes-mejorada">
                                        <div className="lista-header">
                                            <h4>Lista de Participantes ({modalAsistentes.asistentes.length})</h4>
                                        </div>

                                        <div className="participantes-grid">
                                            {modalAsistentes.asistentes.map((asistente, index) => (
                                                <div key={index} className="participante-card">
                                                    <div className="participante-header-card">
                                                        <div className="participante-avatar-mejorado">
                                                            <span>{asistente.nombre.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <span className={`badge-tipo-mejorado ${asistente.tipoAsistente}`}>
                                                            {asistente.tipoAsistente === 'registrado' ? '✓ Registrado' :
                                                             asistente.tipoAsistente === 'invitado' ? '✉ Invitado' : '➕ Manual'}
                                                        </span>
                                                    </div>

                                                    <div className="participante-info-mejorada">
                                                        <h5 className="participante-nombre-mejorado">{asistente.nombre}</h5>
                                                        <div className="participante-datos">
                                                            <div className="dato-row">
                                                                <span className="dato-icono">📧</span>
                                                                <span className="dato-texto">{asistente.email}</span>
                                                            </div>
                                                            <div className="dato-row">
                                                                <span className="dato-icono">🆔</span>
                                                                <span className="dato-texto">{asistente.rut}</span>
                                                            </div>
                                                            {asistente.fechaConfirmacion && (
                                                                <div className="dato-row fecha">
                                                                    <span className="dato-icono">📅</span>
                                                                    <span className="dato-texto">
                                                                        {new Date(asistente.fechaConfirmacion).toLocaleDateString('es-CL', {
                                                                            day: '2-digit',
                                                                            month: 'short',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer-participantes">
                            <button className="btn-cerrar-footer" onClick={cerrarModalAsistentes}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Perfil;
