
// Manejo global de autenticación:
// guardo y verifico la sesión del usuario en toda la app
import { createContext, useContext, useState, useEffect } from 'react';

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

        if (logged && email) {
            setUser({
                email,
                logged,
                isAdmin: logged === 'admin'
            });
        }
    }, []);

    // Inicio sesión guardando email y rol del usuario
    const login = (email, role = 'user') => {
        localStorage.setItem(USER_LOGGED_KEY, role);
        localStorage.setItem(USER_EMAIL_KEY, email);
        setUser({
            email,
            logged: role,
            isAdmin: role === 'admin'
        });
    };

    // Cierro sesión limpiando localStorage y estado
    const logout = () => {
        localStorage.removeItem(USER_LOGGED_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
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
