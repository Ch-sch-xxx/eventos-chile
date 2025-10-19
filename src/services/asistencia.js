// Servicio para manejar asistencia a eventos
// Un usuario puede confirmar que asistirá a un evento
// Puede ser usuario logueado o invitado sin cuenta

const EVENTOS_KEY = 'eventos-chile';
const USUARIOS_KEY = 'usuarios-chile';

/**
 * Función simulada para enviar correo de confirmación a invitados
 * En producción real, llamaría a una API de email (SendGrid, Mailgun, etc.)
 */
export function enviarCorreoConfirmacion(datosAsistente, datosEvento) {
    // Simula envío de correo (en producción sería una API)
    console.log('📧 Enviando correo de confirmación...');
    console.log('Destinatario:', datosAsistente.email);
    console.log('Evento:', datosEvento.titulo);

    // Crear contenido del "correo"
    const mensajeCorreo = `
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📧 CONFIRMACIÓN DE ASISTENCIA
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    Hola ${datosAsistente.nombre},

    ✅ Tu asistencia ha sido confirmada exitosamente.

    📋 DETALLES DEL EVENTO:
    • Título: ${datosEvento.titulo}
    • Fecha: ${datosEvento.fecha}
    • Lugar: ${datosEvento.lugar}
    • Categoría: ${datosEvento.categoria}

    👤 TUS DATOS:
    • Nombre: ${datosAsistente.nombre}
    • Email: ${datosAsistente.email}
    • RUT: ${datosAsistente.rut}

    🎫 Guarda este correo como comprobante de tu asistencia.

    Nos vemos pronto,
    Equipo Eventos Chile 🇨🇱
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    // Mostrar el "correo" en consola (en producción sería enviado por email)
    console.log(mensajeCorreo);

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
        evento.totalAsistentes = evento.asistentes.length;
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
        evento.totalAsistentes = evento.asistentes.length;
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
