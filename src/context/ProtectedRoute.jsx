// HOC para proteger rutas que requieren autenticación
// Redirige a /auth si no hay sesión activa

import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * Componente que protege rutas privadas
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componente hijo a renderizar si hay sesión
 * @param {boolean} props.requireAdmin - Si la ruta requiere rol de admin (opcional)
 */
function ProtectedRoute({ children, requireAdmin = false }) {
    const { isLoggedIn, isAdmin } = useAuth();

    // Si no hay sesión, redirigir a login
    if (!isLoggedIn()) {
        return <Navigate to="/auth" replace />;
    }

    // Si la ruta requiere admin y el usuario no lo es, redirigir a eventos
    if (requireAdmin && !isAdmin()) {
        alert('No tienes permisos de administrador');
        return <Navigate to="/eventos" replace />;
    }

    // Si todo está ok, renderizar el componente hijo
    return children;
}

export default ProtectedRoute;
