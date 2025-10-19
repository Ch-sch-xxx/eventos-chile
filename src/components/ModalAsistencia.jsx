// Modal para confirmar asistencia a un evento
// Detecta si el usuario está logueado o no
// - Logueado: confirmación rápida con sus datos
// - Invitado: formulario con validaciones (nombre, email, RUT)

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { registrarAsistenciaInvitado, registrarAsistenciaLogueado } from '../services/asistencia';
import '../styles/modalAsistencia.css';
import '../styles/modalDecision.css';
import { validarEmail, validarNombre, validarRUT } from '../utils/validation';

function ModalAsistencia({ evento, onClose, onSuccess }) {
    const { user, isLoggedIn } = useAuth();

    // Estados del formulario (solo para invitados)
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        rut: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Manejar cambios en inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error al escribir
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Confirmar asistencia de usuario logueado
    const confirmarLogueado = async () => {
        setLoading(true);

        // Obtener datos completos del usuario desde localStorage
        const usuariosData = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        const usuarioCompleto = usuariosData.find(u => u.email === user.email);

        const resultado = registrarAsistenciaLogueado(evento.id, {
            name: usuarioCompleto?.name || 'Usuario',
            email: user.email,
            rut: usuarioCompleto?.rut || 'No proporcionado'
        });

        setLoading(false);

        if (resultado.success) {
            alert(resultado.mensaje);
            onSuccess();
            onClose();
        } else {
            alert(resultado.error);
        }
    };

    // Confirmar asistencia de invitado
    const confirmarInvitado = async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const newErrors = {};

        if (!validarNombre(formData.nombre)) {
            newErrors.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres)';
        }

        if (!validarEmail(formData.email)) {
            newErrors.email = 'Ingresa un email válido';
        }

        if (!validarRUT(formData.rut)) {
            newErrors.rut = 'Ingresa un RUT válido (ej: 12.345.678-9)';
        }

        // Si hay errores, mostrarlos y no enviar
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        const resultado = registrarAsistenciaInvitado(evento.id, formData);

        setLoading(false);

        if (resultado.success) {
            alert(resultado.mensaje);
            onSuccess();
            onClose();
        } else {
            alert(resultado.error);
        }
    };

    // Calcular cupos disponibles
    const asistentesActuales = evento.asistentes?.length || 0;
    const cuposDisponibles = evento.capacidad - asistentesActuales;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-contenido-asistencia" onClick={(e) => e.stopPropagation()}>
                <button className="btn-cerrar-modal" onClick={onClose}>×</button>

                <h2 className="modal-titulo">Confirmar Asistencia</h2>
                <h3 className="evento-titulo">{evento.titulo}</h3>

                <div className="info-evento-modal">
                    <p>📅 <strong>Fecha:</strong> {evento.fecha}</p>
                    <p>📍 <strong>Lugar:</strong> {evento.lugar}</p>
                    <p>👥 <strong>Cupos:</strong> {asistentesActuales}/{evento.capacidad}</p>
                    <p className={cuposDisponibles < 10 ? 'cupos-limitados' : ''}>
                        {cuposDisponibles > 0
                            ? `✓ ${cuposDisponibles} cupos disponibles`
                            : '✗ Sin cupos disponibles'
                        }
                    </p>
                </div>

                {cuposDisponibles === 0 ? (
                    // Sin cupos - mostrar mensaje
                    <div className="sin-cupos">
                        <p>😔 Lo sentimos, este evento está lleno</p>
                        <button className="btn-cerrar-principal" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                ) : isLoggedIn() ? (
                    // Usuario logueado - confirmación rápida
                    <div className="confirmacion-logueado">
                        <p className="texto-info">
                            ¿Confirmas tu asistencia a este evento?
                        </p>
                        <button
                            className="btn-confirmar-principal"
                            onClick={confirmarLogueado}
                            disabled={loading}
                        >
                            {loading ? 'Confirmando...' : '✓ Confirmar Asistencia'}
                        </button>
                    </div>
                ) : (
                    // Invitado - formulario completo
                    <form onSubmit={confirmarInvitado} className="form-invitado">
                        <p className="texto-info">
                            Para confirmar tu asistencia, necesitamos tus datos:
                        </p>

                        <div className="form-group">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                className={errors.nombre ? 'input-error' : ''}
                                placeholder="Juan Pérez González"
                                required
                            />
                            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'input-error' : ''}
                                placeholder="juan@email.com"
                                required
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>RUT *</label>
                            <input
                                type="text"
                                name="rut"
                                value={formData.rut}
                                onChange={handleChange}
                                className={errors.rut ? 'input-error' : ''}
                                placeholder="12.345.678-9"
                                required
                            />
                            {errors.rut && <span className="error-text">{errors.rut}</span>}
                        </div>

                        <button
                            type="submit"
                            className="btn-confirmar-principal"
                            disabled={loading}
                        >
                            {loading ? 'Confirmando...' : '✓ Confirmar Asistencia'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ModalAsistencia;
