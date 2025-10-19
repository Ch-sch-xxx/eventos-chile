import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Utilidad para renderizar componentes con AuthContext
export function renderWithAuth(ui, options) {
    return render(ui, {
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

// Mock mejorado de localStorage
export const mockLocalStorage = {
    store: {},
    getItem: vi.fn((key) => mockLocalStorage.store[key]),
    setItem: vi.fn((key, value) => {
        mockLocalStorage.store[key] = value;
    }),
    removeItem: vi.fn((key) => {
        delete mockLocalStorage.store[key];
    }),
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