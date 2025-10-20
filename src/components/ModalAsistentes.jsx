// Modal de gestión de asistentes para Admin
// Muestra lista de asistentes con opciones de:
// - Ver información de cada asistente
// - Eliminar asistente
// - Agregar nuevo asistente manualmente

import { useEffect, useState } from 'react';
import {
    agregarAsistenteManual,
    eliminarAsistente,
    obtenerAsistentes,
    obtenerEstadisticasEvento
} from '../services/asistencia';
import '../styles/modalAsistentes.css';
import { validarEmail, validarNombre, validarRUT } from '../utils/validation';

function ModalAsistentes({ evento, onClose, onUpdate }) {
    const [asistentes, setAsistentes] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [vistaActual, setVistaActual] = useState('lista'); // 'lista' o 'agregar'

    // Estados del formulario de agregar
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rut: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Cargar asistentes y estadísticas
    const cargarAsistentes = () => {
        const listaAsistentes = obtenerAsistentes(evento.id);
        const stats = obtenerEstadisticasEvento(evento.id);
        setAsistentes(listaAsistentes);
        setEstadisticas(stats);
    };

    // Cargar asistentes al montar
    useEffect(() => {
        cargarAsistentes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Formatear RUT automáticamente
    const formatearRUTInput = (rut) => {
        // Eliminar todo lo que no sea número o K
        let rutLimpio = rut.replace(/[^0-9kK]/g, '');

        // Limitar longitud máxima (8 o 9 dígitos)
        if (rutLimpio.length > 9) {
            rutLimpio = rutLimpio.substring(0, 9);
        }

        // Si no hay nada, retornar vacío
        if (rutLimpio.length === 0) return '';

        // Separar cuerpo y dígito verificador
        const cuerpo = rutLimpio.slice(0, -1);
        const dv = rutLimpio.slice(-1).toUpperCase();

        // Si solo hay un dígito, retornarlo sin formato
        if (cuerpo.length === 0) return dv;

        // Formatear cuerpo con puntos
        const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        return `${cuerpoFormateado}-${dv}`;
    };

    // Manejar cambios en formulario
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Si es el campo RUT, aplicar formato
        if (name === 'rut') {
            const rutFormateado = formatearRUTInput(value);
            setFormData(prev => ({ ...prev, [name]: rutFormateado }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Eliminar asistente
    const handleEliminar = (asistenteId, nombreAsistente) => {
        if (!window.confirm(`¿Seguro que deseas eliminar a ${nombreAsistente}?`)) {
            return;
        }

        const resultado = eliminarAsistente(evento.id, asistenteId);

        if (resultado.success) {
            alert(resultado.mensaje);
            cargarAsistentes();
            onUpdate(); // Notificar al componente padre
        } else {
            alert(resultado.error);
        }
    };

    // Agregar asistente manual
    const handleAgregar = (e) => {
        e.preventDefault();

        // Validar campos
        const newErrors = {};

        if (!validarNombre(formData.nombre)) {
            newErrors.nombre = 'Ingresa el nombre completo (mínimo 2 caracteres)';
        }

        if (!validarEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        // RUT es obligatorio y debe ser válido
        if (!formData.rut || formData.rut.trim() === '') {
            newErrors.rut = 'El RUT es obligatorio';
        } else if (!validarRUT(formData.rut)) {
            newErrors.rut = 'Ingresa un RUT válido (ej: 12.345.678-9)';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        const resultado = agregarAsistenteManual(evento.id, formData);

        setLoading(false);

        if (resultado.success) {
            alert(resultado.mensaje);
            setFormData({ nombre: '', email: '', rut: '' });
            setVistaActual('lista');
            cargarAsistentes();
            onUpdate();
        } else {
            alert(resultado.error);
        }
    };

    // Obtener icono según tipo de asistente
    const obtenerIconoTipo = (tipo) => {
        switch (tipo) {
            case 'registrado': return '👤';
            case 'invitado': return '✉️';
            case 'manual': return '📝';
            default: return '👥';
        }
    };

    // Formatear fecha
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-overlay-asistentes" onClick={onClose}>
            <div className="modal-asistentes-contenido" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-asistentes-header">
                    <div>
                        <h2 className="modal-asistentes-titulo">
                            👥 Gestión de Asistentes
                        </h2>
                        <p className="modal-asistentes-subtitulo">{evento.titulo}</p>
                    </div>
                    <button className="btn-cerrar-asistentes" onClick={onClose}>×</button>
                </div>

                {/* Estadísticas */}
                {estadisticas && (
                    <div className="estadisticas-asistentes">
                        <div className="stat-card">
                            <div className="stat-numero">{estadisticas.total}</div>
                            <div className="stat-label">Total Asistentes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-numero">{estadisticas.disponibles}</div>
                            <div className="stat-label">Cupos Disponibles</div>
                        </div>
                    </div>
                )}

                {/* Botones de acción */}
                <div className="acciones-asistentes">
                    <button
                        className={`btn-vista ${vistaActual === 'lista' ? 'activo' : ''}`}
                        onClick={() => setVistaActual('lista')}
                    >
                        📋 Ver Lista
                    </button>
                    <button
                        className={`btn-vista ${vistaActual === 'agregar' ? 'activo' : ''}`}
                        onClick={() => setVistaActual('agregar')}
                        disabled={estadisticas?.disponibles <= 0}
                    >
                        ➕ Agregar Asistente
                    </button>
                </div>

                {/* Contenido según vista */}
                <div className="modal-asistentes-body">
                    {vistaActual === 'lista' ? (
                        // VISTA LISTA
                        <div className="lista-asistentes">
                            {asistentes.length === 0 ? (
                                <div className="sin-asistentes">
                                    <p>😔 Aún no hay asistentes confirmados para este evento</p>
                                </div>
                            ) : (
                                <div className="tabla-asistentes-wrapper">
                                    <table className="tabla-asistentes">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Tipo</th>
                                                <th>Nombre</th>
                                                <th>Email</th>
                                                <th>RUT</th>
                                                <th>Fecha Confirmación</th>
                                                <th>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {asistentes.map((asistente, index) => (
                                                <tr key={asistente.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <span
                                                            className={`badge-tipo tipo-${asistente.tipoAsistente}`}
                                                            title={asistente.tipoAsistente}
                                                        >
                                                            {obtenerIconoTipo(asistente.tipoAsistente)}
                                                        </span>
                                                    </td>
                                                    <td className="nombre-asistente">{asistente.nombre}</td>
                                                    <td className="email-asistente">{asistente.email}</td>
                                                    <td>{asistente.rut}</td>
                                                    <td className="fecha-asistente">
                                                        {formatearFecha(asistente.fechaConfirmacion)}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn-eliminar-asistente"
                                                            onClick={() => handleEliminar(asistente.id, asistente.nombre)}
                                                            title="Eliminar asistente"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Leyenda de tipos */}
                            <div className="leyenda-tipos">
                                <div className="leyenda-item">
                                    <span className="badge-tipo tipo-registrado">👤</span>
                                    <span>Usuario Registrado</span>
                                </div>
                                <div className="leyenda-item">
                                    <span className="badge-tipo tipo-invitado">✉️</span>
                                    <span>Invitado (sin cuenta)</span>
                                </div>
                                <div className="leyenda-item">
                                    <span className="badge-tipo tipo-manual">📝</span>
                                    <span>Agregado Manual</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // VISTA AGREGAR
                        <div className="agregar-asistente-form">
                            <h3 className="form-titulo">➕ Agregar Nuevo Asistente</h3>
                            <p className="form-descripcion">
                                Completa los datos del asistente. Se enviará un correo de confirmación automáticamente.
                            </p>

                            <form onSubmit={handleAgregar}>
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Juan Pérez"
                                        className={errors.nombre ? 'input-error' : ''}
                                    />
                                    {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Ej: juan@email.com"
                                        className={errors.email ? 'input-error' : ''}
                                    />
                                    {errors.email && <span className="error-text">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="rut">RUT *</label>
                                    <input
                                        type="text"
                                        id="rut"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        placeholder="Ej: 12.345.678-9"
                                        className={errors.rut ? 'input-error' : ''}
                                        maxLength="12"
                                    />
                                    {errors.rut && <span className="error-text">{errors.rut}</span>}
                                    <small className="form-hint">Se formatea automáticamente mientras escribes. Acepta 8 o 9 dígitos.</small>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        className="btn-agregar"
                                        disabled={loading}
                                    >
                                        {loading ? 'Agregando...' : '✅ Agregar Asistente'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancelar"
                                        onClick={() => {
                                            setFormData({ nombre: '', email: '', rut: '' });
                                            setErrors({});
                                            setVistaActual('lista');
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-asistentes-footer">
                    <button className="btn-cerrar-footer" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalAsistentes;
