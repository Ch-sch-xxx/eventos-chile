import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
    cancelarAsistencia,
    confirmarAsistencia,
    contarAsistentes,
    enviarCorreoConfirmacion,
    obtenerAsistentesPorEvento,
} from '../../services/asistencia';
import { crearEvento } from '../../services/eventos';

describe('Servicio de Asistencia', () => {
    const EVENTOS_KEY = 'eventos-chile';
    let eventoIdTest;

    beforeEach(() => {
        // Limpiar localStorage antes de cada test
        localStorage.clear();

        // Crear un evento de prueba
        const nuevoEvento = {
            titulo: 'Evento Test Asistencia',
            descripcion: 'Evento para probar asistencia',
            fecha: '2025-12-31',
            hora: '20:00',
            lugar: 'Santiago Centro',
            tipo: 'Concierto',
            capacidad: 100,
            imagen: 'test.jpg',
            creador: 'test@test.com'
        };

        const resultado = crearEvento(nuevoEvento);
        eventoIdTest = resultado.id;
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Confirmar Asistencia', () => {
        it('debería permitir a un usuario registrado confirmar asistencia', () => {
            const datosAsistente = {
                tipo: 'registrado',
                email: 'usuario@test.com',
                nombre: 'Usuario Test'
            };

            const resultado = confirmarAsistencia(eventoIdTest, datosAsistente);

            expect(resultado.success).toBe(true);
            expect(resultado.mensaje).toContain('confirmada');

            // Verificar que se agregó al array de asistentes
            const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY));
            const evento = eventos.find(e => e.id === eventoIdTest);
            expect(evento.asistentes).toHaveLength(1);
            expect(evento.asistentes[0].email).toBe('usuario@test.com');
        });

        it('debería permitir a un invitado confirmar asistencia', () => {
            const datosInvitado = {
                tipo: 'invitado',
                email: 'invitado@test.com',
                nombre: 'Invitado Test',
                telefono: '+56912345678'
            };

            const resultado = confirmarAsistencia(eventoIdTest, datosInvitado);

            expect(resultado.success).toBe(true);

            const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY));
            const evento = eventos.find(e => e.id === eventoIdTest);
            expect(evento.asistentes[0].tipo).toBe('invitado');
            expect(evento.asistentes[0].telefono).toBe('+56912345678');
        });

        it('no debería permitir confirmar asistencia duplicada', () => {
            const datosAsistente = {
                tipo: 'registrado',
                email: 'usuario@test.com',
                nombre: 'Usuario Test'
            };

            // Primera confirmación
            confirmarAsistencia(eventoIdTest, datosAsistente);

            // Intento de confirmación duplicada
            const resultado = confirmarAsistencia(eventoIdTest, datosAsistente);

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('Ya confirmaste');
        });

        it('no debería permitir confirmar si el evento está lleno', () => {
            // Crear evento con capacidad 1
            const eventoLimitado = {
                titulo: 'Evento Limitado',
                descripcion: 'Evento con capacidad limitada',
                fecha: '2025-12-31',
                hora: '20:00',
                lugar: 'Santiago Centro',
                tipo: 'Concierto',
                capacidad: 1,
                imagen: 'test.jpg',
                creador: 'test@test.com'
            };
            const resultadoEvento = crearEvento(eventoLimitado);
            const eventoLimitadoId = resultadoEvento.id;

            // Primera asistencia (llena el evento)
            confirmarAsistencia(eventoLimitadoId, {
                tipo: 'registrado',
                email: 'usuario1@test.com',
                nombre: 'Usuario 1'
            });

            // Intento de segunda asistencia
            const resultado = confirmarAsistencia(eventoLimitadoId, {
                tipo: 'registrado',
                email: 'usuario2@test.com',
                nombre: 'Usuario 2'
            });

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('completo');
        });

        it('debería validar datos de asistente obligatorios', () => {
            const datosIncompletos = {
                tipo: 'registrado',
                email: 'usuario@test.com'
                // Falta nombre
            };

            const resultado = confirmarAsistencia(eventoIdTest, datosIncompletos);

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('requeridos');
        });
    });

    describe('Cancelar Asistencia', () => {
        it('debería permitir a un usuario cancelar su asistencia', () => {
            // Primero confirmar asistencia
            const datosAsistente = {
                tipo: 'registrado',
                email: 'usuario@test.com',
                nombre: 'Usuario Test'
            };
            confirmarAsistencia(eventoIdTest, datosAsistente);

            // Luego cancelar
            const resultado = cancelarAsistencia(eventoIdTest, 'usuario@test.com');

            expect(resultado.success).toBe(true);

            // Verificar que se eliminó del array
            const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY));
            const evento = eventos.find(e => e.id === eventoIdTest);
            expect(evento.asistentes).toHaveLength(0);
        });

        it('no debería permitir cancelar si no confirmó previamente', () => {
            const resultado = cancelarAsistencia(eventoIdTest, 'noexiste@test.com');

            expect(resultado.success).toBe(false);
            expect(resultado.error).toContain('No confirmaste');
        });
    });

    describe('Conteo de Asistentes', () => {
        it('debería contar correctamente los asistentes', () => {
            // Agregar 3 asistentes
            confirmarAsistencia(eventoIdTest, {
                tipo: 'registrado',
                email: 'usuario1@test.com',
                nombre: 'Usuario 1'
            });
            confirmarAsistencia(eventoIdTest, {
                tipo: 'registrado',
                email: 'usuario2@test.com',
                nombre: 'Usuario 2'
            });
            confirmarAsistencia(eventoIdTest, {
                tipo: 'invitado',
                email: 'invitado1@test.com',
                nombre: 'Invitado 1'
            });

            const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY));
            const evento = eventos.find(e => e.id === eventoIdTest);

            const total = contarAsistentes(evento);
            expect(total).toBe(3);
        });

        it('debería retornar 0 si no hay asistentes', () => {
            const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY));
            const evento = eventos.find(e => e.id === eventoIdTest);

            const total = contarAsistentes(evento);
            expect(total).toBe(0);
        });
    });

    describe('Obtener Asistentes por Evento', () => {
        it('debería retornar la lista de asistentes de un evento', () => {
            // Agregar asistentes
            confirmarAsistencia(eventoIdTest, {
                tipo: 'registrado',
                email: 'usuario1@test.com',
                nombre: 'Usuario 1'
            });
            confirmarAsistencia(eventoIdTest, {
                tipo: 'invitado',
                email: 'invitado1@test.com',
                nombre: 'Invitado 1'
            });

            const asistentes = obtenerAsistentesPorEvento(eventoIdTest);

            expect(asistentes).toHaveLength(2);
            expect(asistentes[0].email).toBe('usuario1@test.com');
            expect(asistentes[1].tipo).toBe('invitado');
        });

        it('debería retornar array vacío si el evento no existe', () => {
            const asistentes = obtenerAsistentesPorEvento('evento-inexistente');

            expect(asistentes).toEqual([]);
        });
    });

    describe('Envío de Correos', () => {
        it('debería simular envío de correo de confirmación', () => {
            const datosAsistente = {
                nombre: 'Usuario Test',
                email: 'usuario@test.com'
            };
            const datosEvento = {
                titulo: 'Evento Test',
                fecha: '2025-12-31',
                hora: '20:00',
                lugar: 'Santiago Centro'
            };

            // No debe lanzar error
            expect(() => {
                enviarCorreoConfirmacion(datosAsistente, datosEvento);
            }).not.toThrow();
        });
    });
});
