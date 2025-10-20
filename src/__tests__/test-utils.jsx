// Importamos las herramientas necesarias para testing
import { render } from '@testing-library/react'; // Para renderizar componentes en tests
import { BrowserRouter } from 'react-router-dom'; // Para simular navegación
import { vi } from 'vitest'; // Para crear mocks
import { AuthProvider } from '../context/AuthContext'; // Nuestro contexto de autenticación

/**
 * Función auxiliar para renderizar componentes con el contexto de autenticación
 * Es útil porque muchos componentes necesitan acceso al AuthContext
 *
 * @param {JSX.Element} ui - El componente a renderizar
 * @param {Object} options - Opciones adicionales de renderizado
 * @returns {Object} - El resultado de render() con todos los queries
 */
export function renderWithAuth(ui, options = {}) {
    return render(ui, {
        // Envolvemos el componente con los providers necesarios
        wrapper: ({ children }) => (
            <AuthProvider>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </AuthProvider>
        ),
        ...options,
    });
}

/**
 * Mock de localStorage para tests
 * Simula el comportamiento del localStorage del navegador
 * Usa vi.fn() para poder rastrear las llamadas a estos métodos
 */
export const mockLocalStorage = {
    // Almacenamiento en memoria para los tests
    store: {},

    // Simula obtener un item
    getItem: vi.fn((key) => mockLocalStorage.store[key]),

    // Simula guardar un item
    setItem: vi.fn((key, value) => {
        mockLocalStorage.store[key] = value;
    }),

    // Simula eliminar un item
    removeItem: vi.fn((key) => {
        delete mockLocalStorage.store[key];
    }),

    // Simula limpiar todo el storage
    clear: vi.fn(() => {
        mockLocalStorage.store = {};
    })
};

// Datos de prueba para auth
export const authTestData = {
    adminUser: {
        email: 'admin@eventos.cl',
        role: 'admin'
    },
    regularUser: {
        email: 'user@eventos.cl',
        role: 'user'
    }
};
