import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test } from 'vitest';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Componente de prueba que usa el contexto de autenticación
const TestComponent = () => {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <div data-testid="user-status">
                {user ? `Logged in as: ${user.email}` : 'Not logged in'}
            </div>
            <button onClick={() => login('test@example.com', 'password')}>
                Login
            </button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test('provee el estado inicial de autenticación', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText('Not logged in')).toBeInTheDocument();
    });

    test('maneja el proceso de login correctamente', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        const user = userEvent.setup();
        const loginButton = screen.getByText('Login');
        await user.click(loginButton);

        await waitFor(() => {
            expect(screen.getByText(/Logged in as: test@example.com/)).toBeInTheDocument();
        });
    });

    test('maneja el proceso de logout correctamente', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        const user = userEvent.setup();

        // Primero hacemos login
        const loginButton = screen.getByText('Login');
        await user.click(loginButton);

        // Luego hacemos logout
        const logoutButton = screen.getByText('Logout');
        await user.click(logoutButton);

        await waitFor(() => {
            expect(screen.getByText('Not logged in')).toBeInTheDocument();
        });
    });
});
