import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    actualizarUsuario,
    buscarUsuarioPorEmail,
    crearUsuario,
    eliminarUsuario,
    obtenerUsuarios,
    validarUsuario,
} from '../../services/usuarios';

describe('Servicio de Usuarios', () => {
    const USERS_KEY = 'usuarios-chile';

    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Crear Usuario', () => {
        it('debería crear un nuevo usuario con datos válidos', () => {
            const nuevoUsuario = {
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            };

            const resultado = crearUsuario(nuevoUsuario);

            expect(resultado.success).toBe(true);

            // Verificar que se guardó en localStorage
            const usuarios = JSON.parse(localStorage.getItem(USERS_KEY));
            expect(usuarios).toHaveLength(1);
            expect(usuarios[0].email).toBe('juan@test.com');
            expect(usuarios[0].nombre).toBe('Juan Pérez');
        });

        it('no debería permitir crear usuario con email duplicado', () => {
            const usuario1 = {
                nombre: 'Juan Pérez',
                email: 'test@test.com',
                rut: '12345678-5',
                password: 'password123'
            };

            const usuario2 = {
                nombre: 'María González',
                email: 'test@test.com', // Email duplicado
                rut: '98765432-1',
                password: 'password456'
            };

            crearUsuario(usuario1);
            const resultado = crearUsuario(usuario2);

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('email ya está registrado');
        });

        it('no debería permitir crear usuario con RUT duplicado', () => {
            const usuario1 = {
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            };

            const usuario2 = {
                nombre: 'María González',
                email: 'maria@test.com',
                rut: '12345678-5', // RUT duplicado
                password: 'password456'
            };

            crearUsuario(usuario1);
            const resultado = crearUsuario(usuario2);

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('RUT ya está registrado');
        });

        it('debería hashear la contraseña al crear usuario', () => {
            const nuevoUsuario = {
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            };

            crearUsuario(nuevoUsuario);

            const usuarios = JSON.parse(localStorage.getItem(USERS_KEY));
            // La contraseña hasheada NO debe ser igual a la original
            expect(usuarios[0].password).not.toBe('password123');
            // Debe ser un hash de longitud fija
            expect(usuarios[0].password).toHaveLength(64);
        });

        it('debería agregar fecha de creación al usuario', () => {
            const nuevoUsuario = {
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            };

            crearUsuario(nuevoUsuario);

            const usuarios = JSON.parse(localStorage.getItem(USERS_KEY));
            expect(usuarios[0].fechaCreacion).toBeDefined();
        });
    });

    describe('Validar Usuario (Login)', () => {
        beforeEach(() => {
            // Crear un usuario de prueba para login
            crearUsuario({
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            });
        });

        it('debería validar correctamente credenciales válidas', () => {
            const resultado = validarUsuario('juan@test.com', 'password123');

            expect(resultado.success).toBe(true);
            expect(resultado.user).toBeDefined();
            expect(resultado.user.email).toBe('juan@test.com');
        });

        it('no debería validar con contraseña incorrecta', () => {
            const resultado = validarUsuario('juan@test.com', 'passwordIncorrecta');

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('incorrectos');
        });

        it('no debería validar con email inexistente', () => {
            const resultado = validarUsuario('noexiste@test.com', 'password123');

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('incorrectos');
        });

        it('no debería incluir la contraseña en la respuesta exitosa', () => {
            const resultado = validarUsuario('juan@test.com', 'password123');

            expect(resultado.success).toBe(true);
            expect(resultado.user.password).toBeUndefined();
        });
    });

    describe('Obtener Usuarios', () => {
        it('debería retornar array vacío si no hay usuarios', () => {
            const usuarios = obtenerUsuarios();

            expect(usuarios).toEqual([]);
        });

        it('debería retornar todos los usuarios registrados', () => {
            crearUsuario({
                nombre: 'Usuario 1',
                email: 'user1@test.com',
                rut: '12345678-5',
                password: 'pass1'
            });
            crearUsuario({
                nombre: 'Usuario 2',
                email: 'user2@test.com',
                rut: '98765432-1',
                password: 'pass2'
            });

            const usuarios = obtenerUsuarios();

            expect(usuarios).toHaveLength(2);
        });
    });

    describe('Buscar Usuario por Email', () => {
        beforeEach(() => {
            crearUsuario({
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            });
        });

        it('debería encontrar usuario existente', () => {
            const usuario = buscarUsuarioPorEmail('juan@test.com');

            expect(usuario).toBeDefined();
            expect(usuario.nombre).toBe('Juan Pérez');
        });

        it('debería retornar null para usuario inexistente', () => {
            const usuario = buscarUsuarioPorEmail('noexiste@test.com');

            expect(usuario).toBeNull();
        });

        it('no debería incluir la contraseña en el resultado', () => {
            const usuario = buscarUsuarioPorEmail('juan@test.com');

            expect(usuario.password).toBeUndefined();
        });
    });

    describe('Actualizar Usuario', () => {
        beforeEach(() => {
            crearUsuario({
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            });
        });

        it('debería actualizar nombre de usuario', () => {
            const resultado = actualizarUsuario('juan@test.com', {
                nombre: 'Juan Carlos Pérez'
            });

            expect(resultado.success).toBe(true);

            const usuario = buscarUsuarioPorEmail('juan@test.com');
            expect(usuario.nombre).toBe('Juan Carlos Pérez');
        });

        it('no debería permitir actualizar a un email ya existente', () => {
            // Crear segundo usuario
            crearUsuario({
                nombre: 'María González',
                email: 'maria@test.com',
                rut: '98765432-1',
                password: 'password456'
            });

            // Intentar cambiar email de juan a uno existente
            const resultado = actualizarUsuario('juan@test.com', {
                email: 'maria@test.com'
            });

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('email ya está en uso');
        });

        it('no debería permitir actualizar usuario inexistente', () => {
            const resultado = actualizarUsuario('noexiste@test.com', {
                nombre: 'Nuevo Nombre'
            });

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('no encontrado');
        });
    });

    describe('Eliminar Usuario', () => {
        beforeEach(() => {
            crearUsuario({
                nombre: 'Juan Pérez',
                email: 'juan@test.com',
                rut: '12345678-5',
                password: 'password123'
            });
        });

        it('debería eliminar un usuario existente', () => {
            const resultado = eliminarUsuario('juan@test.com');

            expect(resultado.success).toBe(true);

            const usuarios = obtenerUsuarios();
            expect(usuarios).toHaveLength(0);
        });

        it('no debería fallar al eliminar usuario inexistente', () => {
            const resultado = eliminarUsuario('noexiste@test.com');

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('no encontrado');
        });
    });

    describe('Validación de RUT Chileno', () => {
        it('debería aceptar RUT válido con guión', () => {
            const resultado = crearUsuario({
                nombre: 'Test User',
                email: 'test@test.com',
                rut: '11111111-1',
                password: 'password123'
            });

            expect(resultado.success).toBe(true);
        });

        it('debería rechazar RUT con formato inválido', () => {
            const resultado = crearUsuario({
                nombre: 'Test User',
                email: 'test@test.com',
                rut: '12345678', // Sin guión ni DV
                password: 'password123'
            });

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('RUT');
        });

        it('debería rechazar RUT con dígito verificador incorrecto', () => {
            const resultado = crearUsuario({
                nombre: 'Test User',
                email: 'test@test.com',
                rut: '12345678-9', // DV incorrecto
                password: 'password123'
            });

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('válido');
        });
    });
});
