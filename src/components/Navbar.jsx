// Barra de navegación responsive que cambia según el estado de sesión

import { useAuth } from '../context/AuthContext';
// ✅ DESPUÉS (navegación SPA sin recargar)
import { Link, useNavigate } from 'react-router-dom'; // Agregar useNavigate

function Navbar() {
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate(); // Hook para navegación

    const handleLogout = () => {
        if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
            logout();
            navigate('/'); // Navegación sin recargar página
        }
    };

    return (
        <header
            className="navbar navbar-expand-lg navbar-dark"
            style={{
                background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
                minHeight: '80px'
            }}
        >
            <div className="container-fluid px-4">
                {/* Título con ID específico para animaciones CSS */}
                <h1 className="navbar-brand mb-0 fw-bold" id="h1_titulo">
                    Inicio · Eventos Chile
                </h1>

                {/* Botón de menú para pantallas móviles */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navegacionPrincipal"
                    aria-controls="navegacionPrincipal"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Links de navegación que se colapsan en móvil */}
                <nav className="collapse navbar-collapse justify-content-end" id="navegacionPrincipal">
                    <ul className="navbar-nav gap-2">
                        <li className="nav-item">
                            <Link className="nav-link px-3 py-2 rounded-pill" to="/">
                                Inicio
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="nav-link px-3 py-2 rounded-pill" to="/eventos">
                                Eventos
                            </Link>
                        </li>

                        {/* Si no hay sesión activa, muestro el botón de login */}
                        {!isLoggedIn() ? (
                            <li className="nav-item">
                                <Link className="nav-link px-3 py-2 rounded-pill" to="/auth">
                                    Iniciar sesión
                                </Link>
                            </li>
                        ) : (
                            // Si hay sesión, muestro opciones según el rol del usuario
                            <>
                                {/* Solo admin ve el panel de gestión */}
                                {user?.isAdmin && (
                                    <li className="nav-item">
                                        <Link className="nav-link px-3 py-2 rounded-pill" to="/admin">
                                            Gestión Admin
                                        </Link>
                                    </li>
                                )}

                                <li className="nav-item">
                                    <Link className="nav-link px-3 py-2 rounded-pill" to="/perfil">
                                        Mi Perfil
                                    </Link>
                                </li>

                                {/* Botón de cerrar sesión con confirmación */}
                                <li className="nav-item">
                                    <button
                                        className="nav-link px-3 py-2 rounded-pill btn btn-link text-white"
                                        onClick={handleLogout}
                                        style={{
                                            textDecoration: 'none',
                                            border: 'none',
                                            background: 'transparent'
                                        }}
                                    >
                                        Cerrar sesión
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
