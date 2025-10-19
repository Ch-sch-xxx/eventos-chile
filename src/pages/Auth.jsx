// Página de autenticación con login y registro
// Sistema mejorado de validación y seguridad

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import {
    crearUsuario,
    validarUsuario
} from '../services/usuarios';
import '../styles/auth.css';
import {
    formatearRUT,
    validarEmail,
    validarNombre,
    validarPassword,
    validarRUT
} from '../utils/validation';

// DATOS DE REGIONES Y COMUNAS
import { regionesYcomunas } from '../data/ubicaciones';

// Las funciones de validación de RUT se han movido a utils/validation.js

// Las funciones de validación han sido movidas a utils/validation.js y services/usuarios.js

// COMPONENTE AUTH
function Auth() {
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate('/admin', { replace: true });
        }
    }, [isLoggedIn, navigate]);

    if (isLoggedIn()) {
        return null; // No renderiza nada mientras redirige
    }

    // Estado para toggle entre login/registro
    const [mostrarRegistro, setMostrarRegistro] = useState(false);

    // Estados para manejo de errores
    const [errors, setErrors] = useState({});
    const [loginError, setLoginError] = useState('');
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Estados formulario LOGIN
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Estados formulario REGISTRO
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerRut, setRegisterRut] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerRegion, setRegisterRegion] = useState('');
    const [registerComuna, setRegisterComuna] = useState('');
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    // Cargar comunas cuando cambia la región
    useEffect(() => {
        if (registerRegion && regionesYcomunas[registerRegion]) {
            setComunasDisponibles(regionesYcomunas[registerRegion]);
            setRegisterComuna(''); // Reset comuna al cambiar región
        } else {
            setComunasDisponibles([]);
        }
    }, [registerRegion]);

    // Formateo automático de RUT mientras escribe
    const handleRutChange = (e) => {
        const valorFormateado = formatearRUT(e.target.value);
        setRegisterRut(valorFormateado);
    };

    // MANEJO LOGIN
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setErrors({});

        try {
            const email = loginEmail.trim();
            const pass = loginPassword.trim();

            // Admin hardcodeado
            if (email === 'ad@ad.com' && pass === 'admin') {
                login(email, 'admin');
                localStorage.setItem('user-data', JSON.stringify({
                    name: 'Administrador',
                    email: email,
                    role: 'admin'
                }));
                navigate('/admin', { replace: true });
                return;
            }

            // Validar usuario registrado
            const resultado = validarUsuario(email, pass);

            if (resultado.success) {
                setLoginError('');
                login(email, 'user');
                localStorage.setItem('user-data', JSON.stringify(resultado.user));
                navigate('/eventos', { replace: true });
            } else {
                setLoginError('El email o la contraseña son incorrectos');
                setLoginPassword(''); // Limpiar solo la contraseña para facilitar reintentos
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setLoginError('Error al iniciar sesión. Por favor, intenta nuevamente.');
        }
    };

    // MANEJO REGISTRO
    const handleRegister = async (e) => {
        e.preventDefault();
        setFormSubmitting(true);

        try {
            // Obtener y limpiar valores
            const name = registerName.trim();
            const email = registerEmail.trim();
            const rut = registerRut.trim();
            const pass = registerPassword.trim();

            // Validaciones
            const newErrors = {};

            // Validar nombre
            if (!validarNombre(name)) {
                newErrors.name = 'El nombre debe contener solo letras y tener al menos 2 caracteres';
            }

            // Validar email
            if (!validarEmail(email)) {
                newErrors.email = 'Por favor, ingresa un email válido';
            }

            // Validar RUT
            if (!validarRUT(rut)) {
                newErrors.rut = 'Por favor, ingresa un RUT chileno válido';
            }

            // Validar contraseña
            const validacionPass = validarPassword(pass);
            if (!validacionPass.isValid) {
                newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
            }

            // Validar ubicación
            if (!registerRegion || !registerComuna) {
                newErrors.ubicacion = 'Por favor, selecciona región y comuna';
            }

            // Si hay errores, actualizamos el estado y detenemos el proceso
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setFormSubmitting(false);
                // Hacer scroll al primer error
                const firstErrorField = document.querySelector('.is-invalid');
                if (firstErrorField) {
                    firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstErrorField.focus();
                }
                return;
            }

            // Limpiar errores si todo está bien
            setErrors({});

            // Crear nuevo usuario
            const nuevoUsuario = {
                name,
                email,
                rut: formatearRUT(rut),
                password: pass,
                region: registerRegion,
                comuna: registerComuna,
                fechaRegistro: new Date().toISOString()
            };

            const resultado = await crearUsuario(nuevoUsuario);

            if (resultado.success) {
                setErrors({});
                setLoginError('');
                alert('¡Registro exitoso! Ahora puedes iniciar sesión.');

                // Limpiar formulario
                setRegisterName('');
                setRegisterEmail('');
                setRegisterRut('');
                setRegisterPassword('');
                setRegisterRegion('');
                setRegisterComuna('');

                // Volver al login
                setMostrarRegistro(false);
            } else {
                setErrors(prev => ({
                    ...prev,
                    submit: resultado.error || 'Error al crear el usuario'
                }));
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            setErrors(prev => ({
                ...prev,
                submit: 'Error del servidor. Por favor, intenta más tarde.'
            }));
        } finally {
            setFormSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="container my-5">
                <section className="row justify-content-center">
                    <div className="col-lg-6 col-xl-5">
                        <div className="auth-contenedor">

                            {/* FORMULARIO LOGIN */}
                            {!mostrarRegistro && (
                                <form onSubmit={handleLogin} className="auth-form">
                                    <h2 className="text-center mb-4">Iniciar sesión</h2>

                                    <div className="mb-3">
                                        <label htmlFor="login-email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${loginError ? 'is-invalid' : ''}`}
                                            id="login-email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                            placeholder="ejemplo@correo.com"
                                        />
                                        {loginError && <div className="error-message">{loginError}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="login-password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="login-password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                            minLength="4"
                                            maxLength="20"
                                            placeholder="Contraseña"
                                        />
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold" id="logueado">
                                        Entrar
                                    </button>

                                    <p className="text-center mt-3 mb-0">
                                        ¿No tienes cuenta?{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMostrarRegistro(true);
                                            }}
                                            className="text-decoration-none"
                                            id="link-register"
                                        >
                                            Regístrate
                                        </a>
                                    </p>
                                </form>
                            )}

                            {/* FORMULARIO REGISTRO */}
                            {mostrarRegistro && (
                                <form
                                    onSubmit={handleRegister}
                                    className="auth-form needs-validation"
                                    noValidate
                                >
                                    <h2 className="text-center mb-4">Crear cuenta nueva</h2>
                                    {errors.submit && (
                                        <div className="alert alert-danger" role="alert">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            {errors.submit}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="register-name" className="form-label">Nombre completo</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="register-name"
                                            value={registerName}
                                            onChange={(e) => {
                                                setRegisterName(e.target.value);
                                                if (errors.name) {
                                                    setErrors(prev => ({ ...prev, name: null }));
                                                }
                                            }}
                                            aria-describedby="nameHelp"
                                            required
                                            placeholder="Tu nombre completo"
                                        />
                                        {errors.name && (
                                            <div className="invalid-feedback">
                                                {errors.name}
                                            </div>
                                        )}
                                        <div id="nameHelp" className="form-text">
                                            Ingresa tu nombre y apellido
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="register-email"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            required
                                            placeholder="ejemplo-correo@dominio.cl"
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-rut" className="form-label">RUT chileno</label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.rut ? 'is-invalid' : ''}`}
                                            id="register-rut"
                                            value={registerRut}
                                            onChange={(e) => {
                                                handleRutChange(e);
                                                if (errors.rut) {
                                                    setErrors(prev => ({ ...prev, rut: null }));
                                                }
                                            }}
                                            required
                                            placeholder="12345678-9"
                                            maxLength="12"
                                        />
                                        {errors.rut ? (
                                            <div className="invalid-feedback">
                                                {errors.rut}
                                            </div>
                                        ) : (
                                            <small className="form-text text-muted">Formato: 12345678-9</small>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-password" className="form-label">Contraseña</label>
                                        <div className="input-group">
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="register-password"
                                                value={registerPassword}
                                                onChange={(e) => {
                                                    setRegisterPassword(e.target.value);
                                                    if (errors.password) {
                                                        setErrors(prev => ({ ...prev, password: null }));
                                                    }
                                                }}
                                                required
                                                placeholder="Contraseña"
                                                autoComplete="new-password"
                                                aria-describedby="passwordHelp"
                                            />
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => {
                                                    const input = document.getElementById('register-password');
                                                    input.type = input.type === 'password' ? 'text' : 'password';
                                                }}
                                            >
                                                👁️
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <div className="invalid-feedback d-block">
                                                {errors.password}
                                            </div>
                                        )}
                                        <div id="passwordHelp" className="form-text">
                                            La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-region" className="form-label">Región</label>
                                        <select
                                            className={`form-select ${errors.ubicacion ? 'is-invalid' : ''}`}
                                            id="register-region"
                                            value={registerRegion}
                                            onChange={(e) => {
                                                setRegisterRegion(e.target.value);
                                                if (errors.ubicacion) {
                                                    setErrors(prev => ({ ...prev, ubicacion: null }));
                                                }
                                            }}
                                            required
                                        >
                                            <option value="">Selecciona región</option>
                                            {Object.keys(regionesYcomunas).map((region) => (
                                                <option key={region} value={region}>{region}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-comuna" className="form-label">Comuna</label>
                                        <select
                                            className={`form-select ${errors.ubicacion ? 'is-invalid' : ''}`}
                                            id="register-comuna"
                                            value={registerComuna}
                                            onChange={(e) => {
                                                setRegisterComuna(e.target.value);
                                                if (errors.ubicacion) {
                                                    setErrors(prev => ({ ...prev, ubicacion: null }));
                                                }
                                            }}
                                            required
                                            disabled={!registerRegion}
                                        >
                                            <option value="">Selecciona comuna</option>
                                            {comunasDisponibles.map((comuna) => (
                                                <option key={comuna} value={comuna}>{comuna}</option>
                                            ))}
                                        </select>
                                        {errors.ubicacion && (
                                            <div className="invalid-feedback">
                                                {errors.ubicacion}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-bold"
                                        disabled={formSubmitting}
                                    >
                                        {formSubmitting ? (
                                            <span>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Procesando...
                                            </span>
                                        ) : 'Registrar'}
                                    </button>
                                    {errors.submit && (
                                        <div className="alert alert-danger mt-3" role="alert">
                                            {errors.submit}
                                        </div>
                                    )}                                    <div className="d-grid gap-2">

                                    </div>

                                    <hr className="my-4" />

                                    <p className="text-center mb-0">
                                        ¿Ya tienes cuenta?{' '}
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 border-0 align-baseline"
                                            onClick={() => {
                                                setMostrarRegistro(false);
                                                setErrors({});
                                            }}
                                        >
                                            Inicia sesión aquí
                                        </button>
                                    </p>
                                </form>
                            )}

                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Auth;
