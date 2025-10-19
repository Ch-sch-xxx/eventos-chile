// Manejo global de autenticación:
// guardo y verifico la sesión del usuario en toda la app
import { createContext, useContext, useEffect, useState } from 'react';

// Claves para guardar datos de sesión en localStorage
const USER_LOGGED_KEY = 'user-logged';
const USER_EMAIL_KEY = 'user-email';

// Creo el contexto para compartir datos de autenticación entre componentes
const AuthContext = createContext(null);

// Proveedor que envuelve la app y comparte el estado de autenticación
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // Al cargar la app, reviso si hay una sesión guardada en localStorage
    useEffect(() => {
        const logged = localStorage.getItem(USER_LOGGED_KEY);
        const email = localStorage.getItem(USER_EMAIL_KEY);
        const expiry = localStorage.getItem('session-expiry');

        // Verifico si hay datos de sesión
        if (logged && email) {
            // Si hay fecha de expiración, la valido
            if (expiry) {
                const now = new Date().getTime();
                const expiryTime = parseInt(expiry);

                // Si la sesión expiró, hago logout automático
                if (now >= expiryTime) {
                    console.log('⚠️ Sesión expirada, cerrando sesión automáticamente');
                    logout();
                    return;
                }
            }

            // Si todo está bien, cargo la sesión
            setUser({
                email,
                logged,
                isAdmin: logged === 'admin'
            });
        }
    }, []);

    // Inicio sesión guardando email y rol del usuario
    const login = (email, role = 'user') => {
        const now = new Date().getTime();
        const expiresIn = 24 * 60 * 60 * 1000; // 24 horas

        localStorage.setItem(USER_LOGGED_KEY, role);
        localStorage.setItem(USER_EMAIL_KEY, email);
        localStorage.setItem('session-expiry', now + expiresIn);

        setUser({
            email,
            logged: role,
            isAdmin: role === 'admin',
            expiresAt: now + expiresIn
        });
    };

    // Cierro sesión limpiando localStorage y estado
    const logout = () => {
        localStorage.removeItem(USER_LOGGED_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
        localStorage.removeItem('session-expiry'); // También limpio la fecha de expiración
        setUser(null);
    };

    // Verifico si el usuario actual es admin
    const isAdmin = () => {
        return user?.logged === 'admin';
    };

    // Verifico si hay alguien logueado
    const isLoggedIn = () => {
        return user !== null;
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAdmin,
            isLoggedIn
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook personalizado para usar el contexto de autenticación en cualquier componente
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}
