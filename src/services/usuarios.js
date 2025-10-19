// Servicio de gestión de usuarios

import { hashPassword } from '../utils/validation';

const USERS_KEY = 'usuarios-eventos-chile';

/**
 * Obtiene todos los usuarios almacenados
 */
export function obtenerUsuarios() {
    try {
        const usuarios = localStorage.getItem(USERS_KEY);
        return usuarios ? JSON.parse(usuarios) : [];
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

/**
 * Guarda la lista de usuarios
 */
export function guardarUsuarios(usuarios) {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
        return true;
    } catch (error) {
        console.error('Error al guardar usuarios:', error);
        return false;
    }
}

/**
 * Crea un nuevo usuario
 * @returns {Object} { success: boolean, error?: string }
 */
export function crearUsuario(userData) {
    try {
        const usuarios = obtenerUsuarios();

        // Verificar si el email ya existe
        if (usuarios.find(user => user.email === userData.email)) {
            return {
                success: false,
                error: 'Este email ya está registrado'
            };
        }

        // Verificar si el RUT ya existe
        if (usuarios.find(user => user.rut === userData.rut)) {
            return {
                success: false,
                error: 'Este RUT ya está registrado'
            };
        }

        // Hashear contraseña
        const hashedUser = {
            ...userData,
            password: hashPassword(userData.password),
            fechaRegistro: new Date().toISOString()
        };

        usuarios.push(hashedUser);

        if (guardarUsuarios(usuarios)) {
            // Devolver usuario sin contraseña
            const { password, ...userWithoutPassword } = hashedUser;
            return {
                success: true,
                user: userWithoutPassword
            };
        }

        return {
            success: false,
            error: 'Error al guardar el usuario'
        };

    } catch (error) {
        console.error('Error al crear usuario:', error);
        return {
            success: false,
            error: 'Error interno al crear usuario'
        };
    }
}

/**
 * Valida credenciales de usuario
 * @returns {Object} { success: boolean, user?: Object, error?: string }
 */
export function validarUsuario(email, password) {
    try {
        const usuarios = obtenerUsuarios();
        const hashedPassword = hashPassword(password);

        const usuario = usuarios.find(user =>
            user.email === email &&
            user.password === hashedPassword
        );

        if (!usuario) {
            return {
                success: false,
                error: 'Credenciales inválidas'
            };
        }

        // Devolver usuario sin contraseña
        const { password: _, ...userWithoutPassword } = usuario;
        return {
            success: true,
            user: userWithoutPassword
        };

    } catch (error) {
        console.error('Error al validar usuario:', error);
        return {
            success: false,
            error: 'Error interno al validar usuario'
        };
    }
}
