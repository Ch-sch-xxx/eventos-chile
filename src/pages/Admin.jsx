// Panel de gestión CRUD de eventos con permisos
// Admin ve todos los eventos, usuario normal solo los suyos

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventoIMG from '../assets/eventosIMG.png';
import Footer from '../components/Footer';
import ModalAsistentes from '../components/ModalAsistentes';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
    crearEvento,
    editarEvento,
    eliminarEvento,
    listarEventos,
    obtenerMisEventos
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

    // Estados para manejo de imágenes
    const [tipoImagen, setTipoImagen] = useState('url'); // 'url' o 'archivo'
    const [imagenPreview, setImagenPreview] = useState(null);

    // Estados para validación y mensajes
    const [errores, setErrores] = useState({});
    const [camposTocados, setCamposTocados] = useState({});
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    // Estados del modal
    const [modalAbierto, setModalAbierto] = useState(false);
    const [eventoDetalle, setEventoDetalle] = useState(null);

    // Estados del modal de asistentes
    const [modalAsistentesAbierto, setModalAsistentesAbierto] = useState(false);
    const [eventoAsistentes, setEventoAsistentes] = useState(null);

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
        setImagenPreview(null);
        setTipoImagen('url');
        setErrores({});
        setCamposTocados({});
        setMensajeExito('');
        setMensajeError('');
    };

    // Validar un campo individual
    const validarCampo = (nombre, valor) => {
        let error = '';

        switch (nombre) {
            case 'titulo':
                if (!valor || valor.trim().length === 0) {
                    error = 'El título es obligatorio';
                } else if (valor.trim().length < 3) {
                    error = 'El título debe tener al menos 3 caracteres';
                } else if (valor.trim().length > 100) {
                    error = 'El título no puede superar 100 caracteres';
                }
                break;

            case 'fecha':
                if (!valor) {
                    error = 'La fecha es obligatoria';
                } else {
                    const fechaSeleccionada = new Date(valor);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);

                    const año = fechaSeleccionada.getFullYear();

                    if (isNaN(fechaSeleccionada.getTime())) {
                        error = 'Fecha inválida';
                    } else if (año < 1900 || año > 2100) {
                        error = 'El año debe estar entre 1900 y 2100';
                    } else if (fechaSeleccionada < hoy) {
                        error = 'La fecha no puede ser anterior a hoy';
                    }
                }
                break;

            case 'lugar':
                if (!valor || valor.trim().length === 0) {
                    error = 'El lugar es obligatorio';
                } else if (valor.trim().length < 3) {
                    error = 'El lugar debe tener al menos 3 caracteres';
                } else if (valor.trim().length > 150) {
                    error = 'El lugar no puede superar 150 caracteres';
                }
                break;

            case 'tipo':
                if (!valor) {
                    error = 'El tipo de evento es obligatorio';
                }
                break;

            case 'capacidad':
                if (valor && valor !== '') {
                    const num = parseInt(valor);
                    if (isNaN(num)) {
                        error = 'La capacidad debe ser un número';
                    } else if (num < 1) {
                        error = 'La capacidad debe ser al menos 1';
                    } else if (num > 1000000) {
                        error = 'Capacidad máxima: 1,000,000';
                    }
                }
                break;

            case 'precio':
                if (valor && valor.trim().length > 50) {
                    error = 'El precio no puede superar 50 caracteres';
                }
                break;

            case 'descripcion':
                if (valor && valor.trim().length > 500) {
                    error = 'La descripción no puede superar 500 caracteres';
                }
                break;

            default:
                break;
        }

        return error;
    };

    // Validar todo el formulario
    const validarFormulario = () => {
        const nuevosErrores = {};

        // Validar campos obligatorios
        nuevosErrores.titulo = validarCampo('titulo', formData.titulo);
        nuevosErrores.fecha = validarCampo('fecha', formData.fecha);
        nuevosErrores.lugar = validarCampo('lugar', formData.lugar);
        nuevosErrores.tipo = validarCampo('tipo', formData.tipo);

        // Validar campos opcionales solo si tienen valor
        if (formData.capacidad) {
            nuevosErrores.capacidad = validarCampo('capacidad', formData.capacidad);
        }
        if (formData.precio) {
            nuevosErrores.precio = validarCampo('precio', formData.precio);
        }
        if (formData.descripcion) {
            nuevosErrores.descripcion = validarCampo('descripcion', formData.descripcion);
        }

        // Filtrar errores vacíos
        Object.keys(nuevosErrores).forEach(key => {
            if (!nuevosErrores[key]) delete nuevosErrores[key];
        });

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Manejar cuando un campo pierde el foco
    const handleBlur = (e) => {
        const { id } = e.target;
        setCamposTocados(prev => ({ ...prev, [id]: true }));

        const error = validarCampo(id, formData[id]);
        setErrores(prev => ({
            ...prev,
            [id]: error
        }));
    };

    // Manejar cambios en inputs
    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Validación especial para fecha: limitar año a 4 dígitos
        if (id === 'fecha' && value) {
            const [year] = value.split('-');
            if (year && year.length > 4) {
                return; // No actualizar si el año tiene más de 4 dígitos
            }
        }

        setFormData(prev => ({
            ...prev,
            [id]: value
        }));

        // Validar en tiempo real solo si el campo ya fue tocado
        if (camposTocados[id]) {
            const error = validarCampo(id, value);
            setErrores(prev => ({
                ...prev,
                [id]: error
            }));
        }
    };

    // Manejar subida de archivo de imagen
    const handleImagenArchivo = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar que sea una imagen
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            return;
        }

        // Validar tamaño (máximo 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('La imagen no debe superar los 2MB');
            return;
        }

        // Convertir a base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result;
            setFormData(prev => ({
                ...prev,
                imagen: base64String
            }));
            setImagenPreview(base64String);
        };
        reader.readAsDataURL(file);
    };

    // Procesar formulario (crear o editar)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Limpiar mensajes anteriores
        setMensajeExito('');
        setMensajeError('');

        // Marcar todos los campos como tocados
        const todosTocados = {
            titulo: true,
            fecha: true,
            lugar: true,
            tipo: true,
            capacidad: true,
            precio: true,
            descripcion: true
        };
        setCamposTocados(todosTocados);

        // Validar formulario completo
        if (!validarFormulario()) {
            setMensajeError('Por favor corrige los errores antes de continuar');
            // Scroll al primer error
            setTimeout(() => {
                const primerError = document.querySelector('.is-invalid');
                if (primerError) {
                    primerError.focus();
                    primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
            return;
        }

        const { titulo, fecha, lugar, tipo, imagen, descripcion, capacidad, precio } = formData;

        // Construir objeto evento
        const eventoData = {
            titulo: titulo.trim(),
            fecha,
            lugar: lugar.trim(),
            tipo,
            imagen: imagen.trim() || eventoIMG,
            descripcion: descripcion.trim() || 'Sin descripción',
            capacidad: parseInt(capacidad, 10) || 100, // Siempre como número
            precio: parseInt(precio, 10) || 0 // Siempre como número, 0 si es gratis
        };

        try {
            if (editandoIndice !== null) {
                // Modo edición
                const resultado = editarEvento(editandoIndice, eventoData, user.email, isAdmin());
                if (resultado) {
                    limpiarFormulario();
                    setEditandoIndice(null);
                    cambiarVista('listar');
                    cargarEventos(); // Recargar después de cambiar vista
                    alert('✅ Evento editado exitosamente!');
                } else {
                    alert('No tienes permisos para editar este evento');
                }
            } else {
                // Modo creación
                const resultado = crearEvento(eventoData, user.email);
                if (resultado) {
                    // Primero limpio y cambio vista
                    limpiarFormulario();
                    cambiarVista('listar');
                    // Luego recargo eventos (para asegurar que se muestren)
                    cargarEventos();
                    // Mensaje final
                    alert('✅ Evento creado exitosamente! Ya puedes verlo en la lista.');
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

    // Abrir modal de asistentes
    const abrirModalAsistentes = () => {
        if (!eventoDetalle) return;
        setEventoAsistentes(eventoDetalle);
        setModalAsistentesAbierto(true);
    };

    // Cerrar modal de asistentes
    const cerrarModalAsistentes = () => {
        setModalAsistentesAbierto(false);
        setEventoAsistentes(null);
    };

    // Actualizar eventos después de cambios en asistentes
    const actualizarDespuesAsistentes = () => {
        cargarEventos();
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
                                                            <label htmlFor="titulo" className="form-label">🎭 Título</label>
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
                                                            <label htmlFor="fecha" className="form-label">📅 Fecha</label>
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
                                                            <label htmlFor="lugar" className="form-label">📍 Lugar</label>
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
                                                            <label htmlFor="tipo" className="form-label">🎪 Tipo</label>
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

                                                        {/* Selector de tipo de imagen */}
                                                        <div className="col-md-12">
                                                            <label className="form-label">🖼️ Imagen del Evento</label>
                                                            <div className="btn-group w-100 mb-3" role="group">
                                                                <button
                                                                    type="button"
                                                                    className={`btn ${tipoImagen === 'url' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                    onClick={() => {
                                                                        setTipoImagen('url');
                                                                        setImagenPreview(null);
                                                                    }}
                                                                >
                                                                    🔗 URL
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className={`btn ${tipoImagen === 'archivo' ? 'btn-primary' : 'btn-outline-primary'}`}
                                                                    onClick={() => {
                                                                        setTipoImagen('archivo');
                                                                        setFormData(prev => ({ ...prev, imagen: '' }));
                                                                    }}
                                                                >
                                                                    📁 Subir Archivo
                                                                </button>
                                                            </div>

                                                            {tipoImagen === 'url' ? (
                                                                <div>
                                                                    <input
                                                                        id="imagen"
                                                                        type="text"
                                                                        className="form-control"
                                                                        value={formData.imagen}
                                                                        onChange={handleInputChange}
                                                                        placeholder="https://ejemplo.com/imagen.jpg"
                                                                    />
                                                                    <small className="form-text text-muted">
                                                                        Ingresa la URL de una imagen o deja vacío para usar la imagen por defecto
                                                                    </small>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <input
                                                                        type="file"
                                                                        className="form-control"
                                                                        accept="image/*"
                                                                        onChange={handleImagenArchivo}
                                                                    />
                                                                    <small className="form-text text-muted">
                                                                        Sube una imagen (máximo 2MB). Formatos: JPG, PNG, GIF, WebP
                                                                    </small>
                                                                </div>
                                                            )}

                                                            {/* Vista previa de la imagen */}
                                                            {(imagenPreview || formData.imagen) && (
                                                                <div className="mt-3 text-center">
                                                                    <p className="text-muted small mb-2">Vista previa:</p>
                                                                    <img
                                                                        src={imagenPreview || formData.imagen}
                                                                        alt="Preview"
                                                                        className="img-thumbnail"
                                                                        style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="col-md-6">
                                                            <label htmlFor="capacidad" className="form-label">👥 Capacidad</label>
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
                                                            <label htmlFor="precio" className="form-label">💰 Precio</label>
                                                            <input
                                                                id="precio"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.precio}
                                                                onChange={handleInputChange}
                                                                placeholder="Gratis o $5000"
                                                            />
                                                        </div>

                                                        <div className="col-md-12">
                                                            <label htmlFor="descripcion" className="form-label">📝 Descripción</label>
                                                            <textarea
                                                                id="descripcion"
                                                                rows="4"
                                                                className="form-control"
                                                                value={formData.descripcion}
                                                                onChange={handleInputChange}
                                                                placeholder="Describe los detalles y atractivos del evento..."
                                                            />
                                                        </div>

                                                        <div className="col-12 text-center mt-4">
                                                            <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
                                                                {editandoIndice !== null ? '💾 Guardar Cambios' : '✨ Crear Evento'}
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
                                                                    ❌ Cancelar
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
                                                                        onError={(e) => {
                                                                            e.target.onerror = null; // Prevenir bucle infinito
                                                                            e.target.src = eventoIMG;
                                                                        }}
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
                                        onError={(e) => {
                                            e.target.onerror = null; // Prevenir bucle infinito
                                            e.target.src = eventoIMG;
                                        }}
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
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={abrirModalAsistentes}
                                        style={{
                                            background: 'linear-gradient(135deg, var(--primario), #9F7AEA)',
                                            border: 'none',
                                            fontWeight: '600'
                                        }}
                                    >
                                        👥 Ver Asistentes
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* MODAL ASISTENTES */}
            {modalAsistentesAbierto && eventoAsistentes && (
                <ModalAsistentes
                    evento={eventoAsistentes}
                    onClose={cerrarModalAsistentes}
                    onUpdate={actualizarDespuesAsistentes}
                />
            )}

            <Footer />
        </>
    );
}

export default Admin;
