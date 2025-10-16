// Panel de gestión CRUD de eventos con permisos
// Admin ve todos los eventos, usuario normal solo los suyos

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    obtenerMisEventos,
    crearEvento,
    editarEvento,
    eliminarEvento,
    listarEventos
} from '../services/eventos';
import '../styles/admin.css';

function Admin() {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();

    // Estados de vista
    const [vistaActual, setVistaActual] = useState('listar'); // 'crear' o 'listar'
    const [eventos, setEventos] = useState([]);
    const [editandoIndice, setEditandoIndice] = useState(null);

    // Estados del formulario
    const [formData, setFormData] = useState({
        titulo: '',
        fecha: '',
        lugar: '',
        tipo: '',
        imagen: '',
        descripcion: '',
        capacidad: '',
        precio: ''
    });

    // Estados del modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [eventoDetalle, setEventoDetalle] = useState(null);

    // Cargar eventos al montar y cuando cambia la vista
    useEffect(() => {
        cargarEventos();
    }, []);

    // Función para cargar eventos según permisos
    const cargarEventos = () => {
        const misEventos = obtenerMisEventos(user.email, isAdmin());
        setEventos(misEventos);
    };

    // Cambiar vista (crear/listar)
    const cambiarVista = (vista) => {
        setVistaActual(vista);
    };

    // Limpiar formulario
    const limpiarFormulario = () => {
        setFormData({
            titulo: '',
            fecha: '',
            lugar: '',
            tipo: '',
            imagen: '',
            descripcion: '',
            capacidad: '',
            precio: ''
        });
    };

    // Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    // Procesar formulario (crear o editar)
    const handleSubmit = (e) => {
        e.preventDefault();

        const { titulo, fecha, lugar, tipo, imagen, descripcion, capacidad, precio } = formData;

        // Validaciones
        if (!titulo || titulo.trim().length < 3) {
            return alert('El título debe tener al menos 3 caracteres');
        }
        if (!fecha) {
            return alert('Selecciona una fecha válida');
        }
        if (!lugar || lugar.trim().length < 3) {
            return alert('El lugar debe tener al menos 3 caracteres');
        }
        if (!tipo) {
            return alert('Selecciona el tipo de evento');
        }

        // Validar que la fecha no sea en el pasado
        const fechaEvento = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaEvento < hoy) {
            return alert('La fecha del evento no puede ser anterior a hoy');
        }

        // Construir objeto evento
        const eventoData = {
            titulo: titulo.trim(),
            fecha,
            lugar: lugar.trim(),
            tipo,
            imagen: imagen.trim() || '/imagenes/eventosIMG.png',
            descripcion: descripcion.trim() || 'Sin descripción',
            capacidad: parseInt(capacidad) || 100,
            precio: precio.trim() || 'Gratis'
        };

        try {
            if (editandoIndice !== null) {
                // Modo edición
                const resultado = editarEvento(editandoIndice, eventoData, user.email, isAdmin());
                if (resultado) {
                    alert('Evento editado exitosamente!');
                    limpiarFormulario();
                    setEditandoIndice(null);
                    cargarEventos();
                    cambiarVista('listar');
                } else {
                    alert('No tienes permisos para editar este evento');
                }
            } else {
                // Modo creación
                const resultado = crearEvento(eventoData, user.email);
                if (resultado) {
                    alert('Evento creado exitosamente!');
                    limpiarFormulario();
                    cargarEventos();
                    cambiarVista('listar');
                } else {
                    alert('Error al crear el evento');
                }
            }
        } catch (error) {
            console.error('Error al guardar evento:', error);
            alert('Error al guardar el evento');
        }
    };

    // Iniciar edición
    const iniciarEdicion = (idx) => {
        const evento = eventos[idx];

        if (!evento) {
            alert('Evento no encontrado');
            return;
        }

        // Verificar permisos
        if (!isAdmin() && evento.creadoPor !== user.email) {
            alert('Solo puedes editar tus propios eventos');
            return;
        }

        // Cargar datos en el formulario
        setFormData({
            titulo: evento.titulo,
            fecha: evento.fecha,
            lugar: evento.lugar,
            tipo: evento.tipo,
            imagen: evento.imagen,
            descripcion: evento.descripcion || '',
            capacidad: evento.capacidad || '',
            precio: evento.precio || ''
        });

        // Encontrar índice real del evento en la lista completa
        const todosLosEventos = listarEventos();
        const indiceReal = todosLosEventos.findIndex(e => e.id === evento.id);
        setEditandoIndice(indiceReal);

        // Cambiar a vista crear (modo edición)
        cambiarVista('crear');
    };

    // Eliminar evento
    const borrarEvento = (idx) => {
        const evento = eventos[idx];

        if (!evento) {
            alert('Evento no encontrado');
            return;
        }

        // Verificar permisos
        if (!isAdmin() && evento.creadoPor !== user.email) {
            alert('Solo puedes eliminar tus propios eventos');
            return;
        }

        if (window.confirm(`¿Eliminar "${evento.titulo}"?`)) {
            try {
                // Encontrar índice real del evento en la lista completa
                const todosLosEventos = listarEventos();
                const indiceReal = todosLosEventos.findIndex(e => e.id === evento.id);

                const resultado = eliminarEvento(indiceReal, user.email, isAdmin());
                if (resultado) {
                    cargarEventos();
                    alert('Evento eliminado correctamente');
                } else {
                    alert('Error: No se pudo eliminar el evento');
                }
            } catch (error) {
                console.error('Error al eliminar evento:', error);
                alert('Error al eliminar el evento');
            }
        }
    };

    // Ver detalle (modal)
    const verEvento = (idx) => {
        const evento = eventos[idx];
        if (!evento) {
            alert('Evento no encontrado');
            return;
        }
        setEventoDetalle(evento);
        setModalAbierto(true);
    };

    // Cerrar modal
    const cerrarModal = () => {
        setModalAbierto(false);
        setEventoDetalle(null);
    };

    return (
        <>
            <Navbar />

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <aside className="col-lg-2 col-md-3 sidebar bg-light border-end p-4">
                        <h2 className="h5 mb-3 fw-bold text-dark">Eventos</h2>
                        <ul className="nav flex-column gap-2">
                            <li className="nav-item">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        limpiarFormulario();        // Limpiar al crear NUEVO
                                        setEditandoIndice(null);    // Resetear índice
                                        cambiarVista('crear');
                                    }}
                                    className={`nav-link text-dark px-3 py-2 rounded ${vistaActual === 'crear' ? 'active' : ''}`}
                                >
                                    Crear Evento
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        cambiarVista('listar');
                                    }}
                                    className={`nav-link text-dark px-3 py-2 rounded ${vistaActual === 'listar' ? 'active' : ''}`}
                                >
                                    Listar Eventos
                                </a>
                            </li>
                        </ul>
                    </aside>

                    {/* Contenido principal */}
                    <main className="col-lg-10 col-md-9 admin-content p-4">

                        {/* SECCIÓN CREAR/EDITAR */}
                        {vistaActual === 'crear' && (
                            <section>
                                <div className="row justify-content-center">
                                    <div className="col-xl-10">
                                        <div className="card border-0 shadow-lg mb-4">
                                            <div className="card-body p-4">
                                                <h2 className="card-title h3 mb-4 text-center fw-bold">
                                                    {editandoIndice !== null ? 'Editar Evento' : 'Crear Evento'}
                                                </h2>

                                                <form onSubmit={handleSubmit}>
                                                    <div className="row g-3">
                                                        <div className="col-md-6">
                                                            <label htmlFor="titulo" className="form-label">Título</label>
                                                            <input
                                                                id="titulo"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.titulo}
                                                                onChange={handleInputChange}
                                                                required
                                                                minLength="3"
                                                                placeholder="Nombre del evento"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="fecha" className="form-label">Fecha</label>
                                                            <input
                                                                id="fecha"
                                                                type="date"
                                                                className="form-control"
                                                                value={formData.fecha}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="lugar" className="form-label">Lugar</label>
                                                            <input
                                                                id="lugar"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.lugar}
                                                                onChange={handleInputChange}
                                                                required
                                                                placeholder="Ubicación del evento"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="tipo" className="form-label">Tipo</label>
                                                            <select
                                                                id="tipo"
                                                                className="form-select"
                                                                value={formData.tipo}
                                                                onChange={handleInputChange}
                                                                required
                                                            >
                                                                <option value="">Selecciona tipo</option>
                                                                <option>Presencial</option>
                                                                <option>Streaming</option>
                                                                <option>Consumo</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="imagen" className="form-label">URL Imagen</label>
                                                            <input
                                                                id="imagen"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.imagen}
                                                                onChange={handleInputChange}
                                                                placeholder="/imagenes/eventosIMG.png"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="capacidad" className="form-label">Capacidad</label>
                                                            <input
                                                                id="capacidad"
                                                                type="number"
                                                                className="form-control"
                                                                value={formData.capacidad}
                                                                onChange={handleInputChange}
                                                                min="1"
                                                                placeholder="100"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="precio" className="form-label">Precio</label>
                                                            <input
                                                                id="precio"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.precio}
                                                                onChange={handleInputChange}
                                                                placeholder="Gratis o $5000"
                                                            />
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                                            <textarea
                                                                id="descripcion"
                                                                rows="3"
                                                                className="form-control"
                                                                value={formData.descripcion}
                                                                onChange={handleInputChange}
                                                                placeholder="Detalles del evento"
                                                            />
                                                        </div>

                                                        <div className="col-12 text-center mt-4">
                                                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
                                                                {editandoIndice !== null ? 'Guardar Cambios' : 'Crear Evento'}
                                                            </button>
                                                            {editandoIndice !== null && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary px-5 py-2 fw-bold ms-2"
                                                                    onClick={() => {
                                                                        limpiarFormulario();
                                                                        setEditandoIndice(null);
                                                                        cambiarVista('listar');
                                                                    }}
                                                                >
                                                                    Cancelar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* SECCIÓN LISTAR */}
                        {vistaActual === 'listar' && (
                            <section>
                                <div className="card border-0 shadow-lg">
                                    <div className="card-body p-4">
                                        <h2 className="card-title h3 mb-4 text-center fw-bold">
                                            {isAdmin() ? 'Gestión de Eventos (Administrador)' : 'Mis Eventos Creados'}
                                        </h2>

                                        <div className="table-responsive">
                                            <table className="table table-hover table-striped align-middle">
                                                <thead className="table-dark">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Imagen</th>
                                                    <th>Título</th>
                                                    <th>Fecha</th>
                                                    <th>Lugar</th>
                                                    <th>Tipo</th>
                                                    <th>Acciones</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {eventos.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                                            No tienes eventos creados aún. ¡Crea tu primer evento!
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    eventos.map((evento, i) => {
                                                        const autor = evento.creadoPor || 'Sistema';
                                                        const esMiEvento = evento.creadoPor === user.email;
                                                        const puedeEditar = isAdmin() || esMiEvento;

                                                        return (
                                                            <tr key={evento.id}>
                                                                <td>{i + 1}</td>
                                                                <td>
                                                                    <img
                                                                        src={evento.imagen}
                                                                        alt="Evento"
                                                                        className="img-fluid rounded"
                                                                        style={{ width: '60px', height: '50px', objectFit: 'cover' }}
                                                                        onError={(e) => { e.target.src = '/imagenes/eventosIMG.png'; }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <strong>{evento.titulo}</strong><br />
                                                                    <small style={{ color: '#666' }}>Por: {autor}</small>
                                                                    {esMiEvento && (
                                                                        <><br /><span style={{ color: 'var(--primario)', fontSize: '0.75rem', fontWeight: '600' }}>● Tu evento</span></>
                                                                    )}
                                                                </td>
                                                                <td>{evento.fecha}</td>
                                                                <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {evento.lugar}
                                                                </td>
                                                                <td>
                                                                        <span className="badge" style={{ background: 'var(--acento)', color: 'white', fontSize: '0.8rem' }}>
                                                                            {evento.tipo}
                                                                        </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn-ver"
                                                                        onClick={() => verEvento(i)}
                                                                        title="Ver detalles"
                                                                    >
                                                                        Ver
                                                                    </button>
                                                                    {puedeEditar && (
                                                                        <>
                                                                            <button
                                                                                className="btn-editar"
                                                                                onClick={() => iniciarEdicion(i)}
                                                                                title="Editar evento"
                                                                            >
                                                                                Editar
                                                                            </button>
                                                                            <button
                                                                                className="btn-eliminar"
                                                                                onClick={() => borrarEvento(i)}
                                                                                title="Eliminar evento"
                                                                            >
                                                                                Eliminar
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                    </main>
                </div>
            </div>

            {/* MODAL DETALLE */}
            {modalAbierto && eventoDetalle && (
                <>
                    {/* Backdrop */}
                    <div
                        className="modal-backdrop fade show"
                        onClick={cerrarModal}
                        style={{ zIndex: 1040 }}
                    ></div>

                    {/* Modal */}
                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        style={{ zIndex: 1050 }}
                        onClick={cerrarModal}
                    >
                        <div
                            className="modal-dialog modal-dialog-centered modal-lg"
                            onClick={(e) => e.stopPropagation()} // Evita cerrar al click dentro
                        >
                            <div className="modal-content">
                                <div className="modal-header border-0">
                                    <h3 className="modal-title fw-bold">Detalle del Evento</h3>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={cerrarModal}
                                        aria-label="Cerrar"
                                    ></button>
                                </div>
                                <div className="modal-body text-center">
                                    <img
                                        src={eventoDetalle.imagen}
                                        alt="Imagen Evento"
                                        className="img-fluid rounded shadow-sm mb-3"
                                        style={{ maxWidth: '300px' }}
                                        onError={(e) => { e.target.src = '/imagenes/eventosIMG.png'; }}
                                    />
                                    <h4 className="fw-bold mb-3">{eventoDetalle.titulo}</h4>
                                    <div className="text-start">
                                        <p className="mb-2"><strong>📅 Fecha:</strong> {eventoDetalle.fecha}</p>
                                        <p className="mb-2"><strong>📍 Lugar:</strong> {eventoDetalle.lugar}</p>
                                        <p className="mb-2"><strong>🎭 Tipo:</strong> {eventoDetalle.tipo}</p>
                                        <p className="mb-2"><strong>📋 Descripción:</strong> {eventoDetalle.descripcion || 'Sin descripción'}</p>
                                        <p className="mb-2"><strong>👥 Capacidad:</strong> {eventoDetalle.capacidad || 'No informada'}</p>
                                        <p className="mb-2"><strong>💰 Precio:</strong> {eventoDetalle.precio || 'Gratis'}</p>
                                    </div>
                                </div>
                                <div className="modal-footer border-0">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}


            <Footer />
        </>
    );
}

export default Admin;
