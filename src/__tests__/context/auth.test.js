import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { authTestData, mockLocalStorage } from './test-utils';

describe('AuthContext', () => {
    beforeEach(() => {
        // Configurar mock de localStorage
        global.localStorage = mockLocalStorage;
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('debería iniciar sin usuario autenticado', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it('debería autenticar un usuario correctamente', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(async () => {
            await result.current.login(authTestData.regularUser.email);
        });

        expect(result.current.user).toBeDefined();
        expect(result.current.isAuthenticated).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('debería cerrar sesión correctamente', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        // Primero login
        await act(async () => {
            await result.current.login(authTestData.regularUser.email);
        });

        // Luego logout
        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('debería detectar rol de admin correctamente', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(async () => {
            await result.current.login(authTestData.adminUser.email);
        });

        expect(result.current.isAdmin).toBe(true);
    });

    it('debería mantener la sesión después de recargar', () => {
        // Simular datos en localStorage
        localStorage.setItem('user-logged', 'admin');
        localStorage.setItem('user-email', authTestData.adminUser.email);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.isAdmin).toBe(true);
    });

    it('debería manejar errores de autenticación', async () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        });

        await act(async () => {
            await result.current.login('');  // Email inválido
        });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });
});
