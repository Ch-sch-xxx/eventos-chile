// Página de autenticación con login y registro
// Incluye validación RUT chileno (Módulo 11), regiones/comunas y formateo automático

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/auth.css';

// DATOS DE REGIONES Y COMUNAS
const regionesYcomunas = {
    "Región Metropolitana": [
        "Santiago", "Providencia", "Las Condes", "Puente Alto", "Maipú"
    ],
    "Valparaíso": [
        "Valparaíso", "Viña del Mar", "Concón", "Quilpué"
    ],
    "Biobío": [
        "Concepción", "Talcahuano", "Los Ángeles"
    ],
    "O'Higgins": [
        "Rancagua", "San Fernando", "Machalí"
    ]
};

// FUNCIONES DE VALIDACIÓN RUT (Módulo 11)
/**
 * Calcula el dígito verificador de un RUT usando algoritmo Módulo 11
 */
function calcularDV(rutSinDV) {
    let suma = 0;
    let multiplicador = 2;

    // Recorrer de DERECHA a IZQUIERDA
    for (let i = rutSinDV.length - 1; i >= 0; i--) {
        const digito = parseInt(rutSinDV.charAt(i));
        suma += digito * multiplicador;

        multiplicador++;
        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    const resto = suma % 11;
    const dv = 11 - resto;

    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return dv.toString();
}

/**
 * Válida RUT completo con formato y dígito verificador
 */
function validarRUTCompleto(rut) {
    // Limpiar y validar formato básico
    const rutLimpio = rut.replace(/[^0-9kK-]/g, '');

    if (!/^[0-9]+-[0-9kK]$/i.test(rutLimpio)) {
        return false;
    }

    const partes = rutLimpio.split('-');
    const cuerpo = partes[0];
    const dv = partes[1].toLowerCase();

    // Validar que el cuerpo tenga entre 7 y 8 dígitos
    if (cuerpo.length < 7 || cuerpo.length > 8) {
        return false;
    }

    const dvCalculado = calcularDV(cuerpo);
    return dv === dvCalculado;
}

/**
 * Formatea RUT automáticamente: 12345678-9
 */
function formatearRUT(rut) {
    // Limpiar completamente
    let rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

    if (rutLimpio.length < 2) return rutLimpio;

    // Separar cuerpo y DV
    const dv = rutLimpio.slice(-1);
    const cuerpo = rutLimpio.slice(0, -1);

    if (cuerpo.length === 0) return rutLimpio;

    // Formatear con puntos
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${cuerpoFormateado}-${dv}`;
}

// FUNCIONES DE USUARIOS (localStorage)
function obtenerUsuarios() {
    const usuarios = localStorage.getItem('usuarios-chile');
    return usuarios ? JSON.parse(usuarios) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios-chile', JSON.stringify(usuarios));
}

function crearUsuario(userData) {
    const usuarios = obtenerUsuarios();
    // Verificar si el email ya existe
    if (usuarios.find(user => user.email === userData.email)) {
        return false;
    }
    usuarios.push(userData);
    guardarUsuarios(usuarios);
    return true;
}

function validarUsuario(email, password) {
    const usuarios = obtenerUsuarios();
    return usuarios.find(user => user.email === email && user.password === password);
}

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
    const handleLogin = (e) => {
        e.preventDefault();

        const email = loginEmail.trim();
        const pass = loginPassword.trim();

        // Validaciones básicas
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Email inválido');
            return;
        }

        if (pass.length < 4 || pass.length > 20) {
            alert('La contraseña debe tener entre 4 y 20 caracteres');
            return;
        }

        // Admin hardcodeado
        if (email === 'ad@ad.com' && pass === 'admin') {
            login(email, 'admin');
            localStorage.setItem('user-data', JSON.stringify({
                name: 'Administrador',
                email: email,
                role: 'admin'
            }));
            alert('¡Bienvenido Administrador!');
            navigate('/admin', { replace: true });
            return;
        }

        // Validar usuario registrado
        const usuario = validarUsuario(email, pass);
        if (usuario) {
            login(email, 'user');
            localStorage.setItem('user-data', JSON.stringify(usuario));
            alert('¡Bienvenido ' + usuario.name + '!');
            navigate('/admin', { replace: true });
        } else {
            alert('Credenciales incorrectas');
        }
    };

    // MANEJO REGISTRO
    const handleRegister = (e) => {
        e.preventDefault();

        const name = registerName.trim();
        const email = registerEmail.trim();
        const rut = registerRut.trim();
        const pass = registerPassword.trim();
        const region = registerRegion;
        const comuna = registerComuna;

        // Validaciones
        if (name === '' || name.length < 3) {
            alert('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Email inválido');
            return;
        }

        if (!rut || !validarRUTCompleto(rut)) {
            alert('RUT inválido. Usar formato: 12345678-9');
            return;
        }

        if (pass.length < 4 || pass.length > 20) {
            alert('La contraseña debe tener entre 4 y 20 caracteres');
            return;
        }

        if (!region || !comuna) {
            alert('Selecciona región y comuna');
            return;
        }

        // Verificar si RUT ya existe
        const usuarios = obtenerUsuarios();
        if (usuarios.find(user => user.rut === formatearRUT(rut))) {
            alert('Este RUT ya está registrado');
            return;
        }

        // Crear usuario
        const nuevoUsuario = {
            name: name,
            email: email,
            rut: formatearRUT(rut),
            password: pass,
            region: region,
            comuna: comuna,
            fechaRegistro: new Date().toISOString()
        };

        if (crearUsuario(nuevoUsuario)) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            // Limpiar formulario y volver a login
            setRegisterName('');
            setRegisterEmail('');
            setRegisterRut('');
            setRegisterPassword('');
            setRegisterRegion('');
            setRegisterComuna('');
            setMostrarRegistro(false);
        } else {
            alert('Este email ya está registrado');
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
                                            className="form-control"
                                            id="login-email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                            placeholder="ejemplo-correo@dominio.cl"
                                        />
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
                                <form onSubmit={handleRegister} className="auth-form">
                                    <h2 className="text-center mb-4">Registro</h2>

                                    <div className="mb-3">
                                        <label htmlFor="register-name" className="form-label">Nombre completo</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="register-name"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            required
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="register-email"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            required
                                            placeholder="ejemplo-correo@dominio.cl"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-rut" className="form-label">RUT chileno</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="register-rut"
                                            value={registerRut}
                                            onChange={handleRutChange}
                                            required
                                            placeholder="12345678-9"
                                            maxLength="12"
                                        />
                                        <small className="form-text text-muted">Formato: 12345678-9</small>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-password" className="form-label">Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="register-password"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            required
                                            minLength="4"
                                            maxLength="20"
                                            placeholder="Contraseña"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="register-region" className="form-label">Región</label>
                                        <select
                                            className="form-select"
                                            id="register-region"
                                            value={registerRegion}
                                            onChange={(e) => setRegisterRegion(e.target.value)}
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
                                            className="form-select"
                                            id="register-comuna"
                                            value={registerComuna}
                                            onChange={(e) => setRegisterComuna(e.target.value)}
                                            required
                                            disabled={!registerRegion}
                                        >
                                            <option value="">Selecciona comuna</option>
                                            {comunasDisponibles.map((comuna) => (
                                                <option key={comuna} value={comuna}>{comuna}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold">
                                        Registrar
                                    </button>

                                    <p className="text-center mt-3 mb-0">
                                        ¿Ya tienes cuenta?{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setMostrarRegistro(false);
                                            }}
                                            className="text-decoration-none"
                                        >
                                            Inicia sesión
                                        </a>
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
