// Servicio para manejar asistencia a eventos
// Un usuario puede confirmar que asistirá a un evento
// Puede ser usuario logueado o invitado sin cuenta

const EVENTOS_KEY = 'eventos-chile';
const USUARIOS_KEY = 'usuarios-chile';

/**
 * Función helper para contar asistentes de un evento
 * Esta es la ÚNICA fuente de verdad para el conteo
 * @param {Object} evento - Objeto del evento
 * @returns {number} - Número de asistentes
 */
export function contarAsistentes(evento) {
    if (!evento) return 0;
    return evento.asistentes?.length || 0;
}

/**
 * Función helper para sincronizar el campo totalAsistentes con el array
 * SIEMPRE usar después de modificar el array de asistentes
 * @param {Object} evento - Objeto del evento a sincronizar
 */
function sincronizarTotalAsistentes(evento) {
    if (evento) {
        evento.totalAsistentes = contarAsistentes(evento);
    }
}

/**
 * Función simulada para enviar correo de confirmación a invitados
 * En producción real, llamaría a una API de email (SendGrid, Mailgun, etc.)
 */
export function enviarCorreoConfirmacion(datosAsistente, datosEvento) {
    // Simula envío de correo (en producción sería una API)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 ENVIANDO CORREO DE CONFIRMACIÓN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Destinatario:', datosAsistente.email);
    console.log('Evento:', datosEvento.titulo);

    // Crear contenido del "correo" con formato mejorado
    const mensajeCorreo = `
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📧 CONFIRMACIÓN DE ASISTENCIA
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Hola ${datosAsistente.nombre},

    ✅ Tu asistencia ha sido confirmada exitosamente.

    📋 DETALLES DEL EVENTO:
    • Título: ${datosEvento.titulo}
    • Fecha: ${datosEvento.fecha}
    • Hora: ${datosEvento.hora || 'Por confirmar'}
    • Lugar: ${datosEvento.lugar}
    • Dirección: ${datosEvento.direccion || datosEvento.lugar}
    • Categoría: ${datosEvento.tipo || datosEvento.categoria}
    ${datosEvento.descripcion ? `• Descripción: ${datosEvento.descripcion}` : ''}
    ${datosEvento.precio ? `• Precio: ${datosEvento.precio}` : '• Entrada: Gratis'}

    👤 TUS DATOS DE CONFIRMACIÓN:
    • Nombre: ${datosAsistente.nombre}
    • Email: ${datosAsistente.email}
    • RUT: ${datosAsistente.rut}
    • Tipo de asistencia: ${datosAsistente.tipoAsistente === 'registrado' ? 'Usuario registrado' : datosAsistente.tipoAsistente === 'invitado' ? 'Invitado' : 'Agregado manualmente'}
    • Fecha de confirmación: ${new Date(datosAsistente.fechaConfirmacion).toLocaleString('es-CL')}

    📌 INFORMACIÓN IMPORTANTE:
    • Cupos totales: ${datosEvento.capacidad || 'Ilimitados'}
    • Asistentes actuales: ${contarAsistentes(datosEvento)}
    ${datosEvento.requisitos ? `• Requisitos: ${datosEvento.requisitos}` : ''}

    🎫 COMPROBANTE:
    Guarda este correo como comprobante de tu asistencia.
    Presentarlo en la entrada del evento (digital o impreso).

    ❓ DUDAS O CONSULTAS:
    Contacta con el organizador:
    • Email: eventoschile@gmail.com
    • Evento creado por: ${datosEvento.creadoPor || 'Eventos Chile'}

    ¡Nos vemos pronto! 🎉

    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    Equipo Eventos Chile 🇨🇱
    www.eventoschile.cl
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    // Mostrar el "correo" en consola (en producción sería enviado por email)
    console.log('%c' + mensajeCorreo, 'color: #6C63FF; font-weight: bold;');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Correo enviado exitosamente');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // En producción, aquí harías:
    // await fetch('https://api.sendgrid.com/v3/mail/send', {
    //     method: 'POST',
    //     headers: {
    //         'Authorization': `Bearer ${SENDGRID_API_KEY}`,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         from: { email: 'noreply@eventoschile.cl', name: 'Eventos Chile' },
    //         to: [{ email: datosAsistente.email, name: datosAsistente.nombre }],
    //         subject: `✅ Confirmación de asistencia - ${datosEvento.titulo}`,
    //         text: mensajeCorreo,
    //         html: mensajeCorreoHTML
    //     })
    // });

    // Retornar éxito
    return {
        success: true,
        mensaje: 'Correo de confirmación enviado exitosamente'
    };
}

/**
 * Registrar asistencia de usuario logueado
 * Guarda en el evento Y en el perfil del usuario
 */
export function registrarAsistenciaLogueado(eventoId, userData) {
    try {
        // 1. Obtener eventos del localStorage
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const eventoIndex = eventos.findIndex(e => e.id === eventoId);

        if (eventoIndex === -1) {
            return { success: false, error: 'Evento no encontrado' };
        }

        const evento = eventos[eventoIndex];

        // Inicializar array de asistentes si no existe
        if (!evento.asistentes) evento.asistentes = [];

        // Verificar si ya está registrado (por email)
        const yaRegistrado = evento.asistentes.find(a => a.email === userData.email);
        if (yaRegistrado) {
            return { success: false, error: 'Ya estás registrado en este evento' };
        }

        // Verificar capacidad disponible
        if (evento.asistentes.length >= evento.capacidad) {
            return { success: false, error: 'Evento lleno - sin cupos disponibles' };
        }

        // Crear objeto del asistente
        const nuevoAsistente = {
            id: `ast_${Date.now()}`,
            nombre: userData.name,
            email: userData.email,
            rut: userData.rut || 'No proporcionado',
            tipoAsistente: 'registrado', // Usuario con cuenta
            fechaConfirmacion: new Date().toISOString()
        };

        // Agregar asistente al evento
        evento.asistentes.push(nuevoAsistente);
        sincronizarTotalAsistentes(evento); // Sincronizar conteo
        eventos[eventoIndex] = evento;

        localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));

        // 2. Agregar evento al perfil del usuario
        const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
        const usuarioIndex = usuarios.findIndex(u => u.email === userData.email);

        if (usuarioIndex !== -1) {
            // Inicializar array si no existe
            if (!usuarios[usuarioIndex].eventosAsistir) {
                usuarios[usuarioIndex].eventosAsistir = [];
            }

            // Agregar evento al perfil
            usuarios[usuarioIndex].eventosAsistir.push({
                eventoId: eventoId,
                eventoTitulo: evento.titulo,
                fechaConfirmacion: new Date().toISOString()
            });

            localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
        }

        return {
            success: true,
            mensaje: '¡Asistencia confirmada! Verás el evento en tu perfil.'
        };

    } catch (error) {
        console.error('Error al registrar asistencia:', error);
        return { success: false, error: 'Error al registrar asistencia' };
    }
}

/**
 * Registrar asistencia de invitado (sin cuenta)
 * Solo guarda en el evento, no tiene perfil
 */
export function registrarAsistenciaInvitado(eventoId, invitadoData) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const eventoIndex = eventos.findIndex(e => e.id === eventoId);

        if (eventoIndex === -1) {
            return { success: false, error: 'Evento no encontrado' };
        }

        const evento = eventos[eventoIndex];

        // Inicializar array si no existe
        if (!evento.asistentes) evento.asistentes = [];

        // Verificar capacidad
        if (evento.asistentes.length >= evento.capacidad) {
            return { success: false, error: 'Evento lleno - sin cupos disponibles' };
        }

        // Verificar si email ya registrado
        const yaRegistrado = evento.asistentes.find(a => a.email === invitadoData.email);
        if (yaRegistrado) {
            return { success: false, error: 'Este email ya está registrado en el evento' };
        }

        // Crear objeto del invitado
        const nuevoInvitado = {
            id: `ast_${Date.now()}`,
            nombre: invitadoData.nombre,
            email: invitadoData.email,
            rut: invitadoData.rut,
            tipoAsistente: 'invitado', // Sin cuenta
            fechaConfirmacion: new Date().toISOString()
        };

        // Agregar al evento
        evento.asistentes.push(nuevoInvitado);
        sincronizarTotalAsistentes(evento); // Sincronizar conteo
        eventos[eventoIndex] = evento;

        localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));

        // Enviar correo de confirmación al invitado
        enviarCorreoConfirmacion(nuevoInvitado, evento);

        return {
            success: true,
            mensaje: '¡Asistencia confirmada! Recibirás información en tu email.'
        };

    } catch (error) {
        console.error('Error al registrar invitado:', error);
        return { success: false, error: 'Error al registrar' };
    }
}

/**
 * Obtener lista de asistentes de un evento
 * Útil para que el creador vea quién va a su evento
 */
export function obtenerAsistentes(eventoId) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const evento = eventos.find(e => e.id === eventoId);

        return evento?.asistentes || [];
    } catch (error) {
        console.error('Error al obtener asistentes:', error);
        return [];
    }
}

/**
 * Obtener eventos a los que asistirá un usuario
 * Muestra la info completa del evento en el perfil
 */
export function obtenerEventosUsuario(userEmail) {
    try {
        const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
        const usuario = usuarios.find(u => u.email === userEmail);

        if (!usuario || !usuario.eventosAsistir) return [];

        // Traer info completa de cada evento
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');

        return usuario.eventosAsistir.map(ea => {
            const evento = eventos.find(e => e.id === ea.eventoId);
            return {
                ...evento,
                fechaConfirmacion: ea.fechaConfirmacion
            };
        }).filter(e => e !== undefined); // Filtrar eventos eliminados

    } catch (error) {
        console.error('Error al obtener eventos del usuario:', error);
        return [];
    }
}

/**
 * Eliminar un asistente de un evento
 * Solo admin o creador del evento puede eliminar
 */
export function eliminarAsistente(eventoId, asistenteId) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const eventoIndex = eventos.findIndex(e => e.id === eventoId);

        if (eventoIndex === -1) {
            return { success: false, error: 'Evento no encontrado' };
        }

        const evento = eventos[eventoIndex];

        if (!evento.asistentes || evento.asistentes.length === 0) {
            return { success: false, error: 'No hay asistentes en este evento' };
        }

        // Encontrar y eliminar asistente
        const asistenteIndex = evento.asistentes.findIndex(a => a.id === asistenteId);

        if (asistenteIndex === -1) {
            return { success: false, error: 'Asistente no encontrado' };
        }

        const asistenteEliminado = evento.asistentes[asistenteIndex];

        // Eliminar del array
        evento.asistentes.splice(asistenteIndex, 1);
        sincronizarTotalAsistentes(evento); // Sincronizar conteo
        eventos[eventoIndex] = evento;

        localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));

        // Si era usuario registrado, eliminar del perfil también
        if (asistenteEliminado.tipoAsistente === 'registrado') {
            const usuarios = JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
            const usuarioIndex = usuarios.findIndex(u => u.email === asistenteEliminado.email);

            if (usuarioIndex !== -1 && usuarios[usuarioIndex].eventosAsistir) {
                usuarios[usuarioIndex].eventosAsistir = usuarios[usuarioIndex].eventosAsistir.filter(
                    ea => ea.eventoId !== eventoId
                );
                localStorage.setItem(USUARIOS_KEY, JSON.stringify(usuarios));
            }
        }

        return {
            success: true,
            mensaje: 'Asistente eliminado correctamente'
        };

    } catch (error) {
        console.error('Error al eliminar asistente:', error);
        return { success: false, error: 'Error al eliminar asistente' };
    }
}

/**
 * Agregar asistente manualmente (solo admin/creador)
 * Similar a invitado pero con más control
 */
export function agregarAsistenteManual(eventoId, datosAsistente) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const eventoIndex = eventos.findIndex(e => e.id === eventoId);

        if (eventoIndex === -1) {
            return { success: false, error: 'Evento no encontrado' };
        }

        const evento = eventos[eventoIndex];

        // Inicializar array si no existe
        if (!evento.asistentes) evento.asistentes = [];

        // Verificar capacidad
        if (evento.asistentes.length >= evento.capacidad) {
            return { success: false, error: 'Evento lleno - sin cupos disponibles' };
        }

        // Verificar si email ya registrado
        const yaRegistrado = evento.asistentes.find(a => a.email === datosAsistente.email);
        if (yaRegistrado) {
            return { success: false, error: 'Este email ya está registrado en el evento' };
        }

        // Crear objeto del asistente manual
        const nuevoAsistente = {
            id: `ast_${Date.now()}`,
            nombre: datosAsistente.nombre,
            email: datosAsistente.email,
            rut: datosAsistente.rut || 'No proporcionado',
            tipoAsistente: 'manual', // Agregado manualmente por admin
            fechaConfirmacion: new Date().toISOString()
        };

        // Agregar al evento
        evento.asistentes.push(nuevoAsistente);
        sincronizarTotalAsistentes(evento); // Sincronizar conteo
        eventos[eventoIndex] = evento;

        localStorage.setItem(EVENTOS_KEY, JSON.stringify(eventos));

        // Enviar correo de confirmación
        enviarCorreoConfirmacion(nuevoAsistente, evento);

        return {
            success: true,
            mensaje: 'Asistente agregado exitosamente y correo enviado'
        };

    } catch (error) {
        console.error('Error al agregar asistente manual:', error);
        return { success: false, error: 'Error al agregar asistente' };
    }
}

/**
 * Obtener lista de asistentes de un evento
 * @param {string} eventoId - ID del evento
 * @returns {Array} - Lista de asistentes con sus datos
 */
export function obtenerAsistentesPorEvento(eventoId) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const evento = eventos.find(e => e.id === eventoId);

        if (!evento) return [];

        return evento.asistentes || [];

    } catch (error) {
        console.error('Error al obtener asistentes:', error);
        return [];
    }
}

/**
 * Obtener estadísticas de asistencia de un evento
 */
export function obtenerEstadisticasEvento(eventoId) {
    try {
        const eventos = JSON.parse(localStorage.getItem(EVENTOS_KEY) || '[]');
        const evento = eventos.find(e => e.id === eventoId);

        if (!evento) return null;

        const asistentes = evento.asistentes || [];
        const totalAsistentes = contarAsistentes(evento); // Usar función helper

        const estadisticas = {
            total: totalAsistentes,
            capacidad: evento.capacidad,
            disponibles: evento.capacidad - totalAsistentes,
            porcentajeLlenado: evento.capacidad > 0 ? ((totalAsistentes / evento.capacidad) * 100).toFixed(1) : '0.0',
            registrados: asistentes.filter(a => a.tipoAsistente === 'registrado').length,
            invitados: asistentes.filter(a => a.tipoAsistente === 'invitado').length,
            manuales: asistentes.filter(a => a.tipoAsistente === 'manual').length
        };

        return estadisticas;

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
    }
}
