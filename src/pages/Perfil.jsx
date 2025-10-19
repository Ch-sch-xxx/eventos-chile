// Página de perfil con información del usuario, eventos y estadísticas
// Incluye formulario de edición con regiones/comunas dinámicas

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import iconoPerfil from '../assets/ICONOperfil.png';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
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
                <section className="row justify-content-center mb-5">
                    <div className="col-lg-8 col-xl-7">
                        <div className="card border-0 shadow-lg text-center p-4">
                            <div className="imagen-container mx-auto mb-3">
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
                                    className="imagen-perfil"
                                    onError={(e) => { e.target.src = iconoPerfil; }}
                                />
                            </div>
                            <div className="info-basica">
                                <h2 className="fw-bold mb-2">{userData.name || 'Usuario'}</h2>
                                <p className="text-muted mb-3">{userData.email || user.email}</p>
                                <span className="badge badge-rol">
                                    {isAdmin() ? 'Administrador' : 'Usuario'}
                                </span>
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
                                                            <label htmlFor="fotoUrl" className="form-label">URL Foto de perfil</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="fotoUrl"
                                                                value={formData.fotoUrl}
                                                                onChange={handleInputChange}
                                                                placeholder="https://ejemplo.com/foto.jpg"
                                                            />
                                                            <small className="form-text text-muted">Pega la URL de tu imagen de perfil</small>
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
                                    <div className="accordion-body">
                                        <div className="row gy-4 justify-content-center">
                                            {eventos.length === 0 ? (
                                                <div className="col-12">
                                                    <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                                                        {isAdmin() ? 'No hay eventos en el sistema' : 'No has creado eventos aún. ¡Crea tu primer evento desde el panel!'}
                                                    </p>
                                                </div>
                                            ) : (
                                                eventos.map((evento) => (
                                                    <div key={evento.id} className="col-md-6 col-lg-4">
                                                        <div className="evento-perfil-item">
                                                            <div className="evento-titulo">{evento.titulo}</div>
                                                            <div className="evento-fecha">📅 {evento.fecha}</div>
                                                            <div className="evento-tipo">🏷️ {evento.tipo}</div>
                                                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
                                                                📍 {evento.lugar}
                                                            </div>
                                                            {isAdmin() && (
                                                                <div style={{ fontSize: '0.8rem', color: 'var(--primario)', marginTop: '0.4rem', fontWeight: '500' }}>
                                                                    👤 {evento.creadoPor || 'Sistema'}
                                                                </div>
                                                            )}
                                                            <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.4rem' }}>
                                                                📆 {evento.fechaCreacion ? new Date(evento.fechaCreacion).toLocaleDateString('es-CL') : 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
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

            <Footer />
        </>
    );
}

export default Perfil;
