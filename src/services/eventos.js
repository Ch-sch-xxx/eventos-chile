// Manejo de eventos usando localStorage como base de datos local
// Incluye operaciones CRUD completas (crear, leer, editar, eliminar)

// Importo la imagen desde assets para que Vite resuelva la URL final en build y preview
import eventoIMG from '../assets/eventosIMG.png';

// Importo la función para generar IDs desde el archivo de validaciones
import { generateEventId } from './eventosValidation';

// Clave para guardar los eventos en el navegador
const STORAGE_KEY = 'eventos-chile';

// Lista de eventos de ejemplo que carga cuando no hay nada guardado
// NUEVO: Ahora incluyen campo asistentes para sistema de confirmación
const eventosIniciales = [
    {
        titulo: "Festival de Música Urbana",
        fecha: "2025-09-30",
        lugar: "Estadio Nacional, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Un festival con los mejores exponentes de la música urbana nacional e internacional.",
        capacidad: 150,
        precio: 25000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_1",
        asistentes: [
            { id: "ast_1_1", nombre: "Carlos Muñoz", email: "carlos.munoz@email.cl", rut: "18.234.567-8", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-15T10:30:00.000Z" },
            { id: "ast_1_2", nombre: "María González", email: "maria.gonzalez@email.cl", rut: "19.876.543-2", tipoAsistente: "invitado", fechaConfirmacion: "2025-09-16T14:20:00.000Z" },
            { id: "ast_1_3", nombre: "Pedro Sanchez", email: "pedro.sanchez@email.cl", rut: "17.654.321-9", tipoAsistente: "manual", fechaConfirmacion: "2025-09-17T09:15:00.000Z" },
            { id: "ast_1_4", nombre: "Ana Torres", email: "ana.torres@email.cl", rut: "20.123.456-7", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-18T11:45:00.000Z" }
        ],
        totalAsistentes: 4
    },
    {
        titulo: "Conferencia de IA",
        fecha: "2025-10-05",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Expertos en inteligencia artificial presentan las últimas tendencias y avances.",
        capacidad: 200,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_2",
        asistentes: [
            { id: "ast_2_1", nombre: "Roberto Díaz", email: "roberto.diaz@email.cl", rut: "16.789.012-3", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-20T08:00:00.000Z" },
            { id: "ast_2_2", nombre: "Claudia Rojas", email: "claudia.rojas@email.cl", rut: "18.456.789-1", tipoAsistente: "invitado", fechaConfirmacion: "2025-09-21T13:30:00.000Z" },
            { id: "ast_2_3", nombre: "Jorge Valenzuela", email: "jorge.v@email.cl", rut: "19.234.567-5", tipoAsistente: "manual", fechaConfirmacion: "2025-09-22T16:00:00.000Z" }
        ],
        totalAsistentes: 3
    },
    {
        titulo: "Feria del Libro",
        fecha: "2025-10-12",
        lugar: "Centro Cultural La Moneda, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Encuentro cultural con editoriales, escritores y actividades literarias para toda la familia.",
        capacidad: 180,
        precio: 3000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_3",
        asistentes: [
            { id: "ast_3_1", nombre: "Daniela Silva", email: "daniela.silva@email.cl", rut: "17.890.123-4", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-23T10:00:00.000Z" },
            { id: "ast_3_2", nombre: "Luis Morales", email: "luis.morales@email.cl", rut: "18.345.678-9", tipoAsistente: "invitado", fechaConfirmacion: "2025-09-24T12:15:00.000Z" },
            { id: "ast_3_3", nombre: "Patricia Núñez", email: "patricia.n@email.cl", rut: "19.567.890-1", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-25T15:30:00.000Z" },
            { id: "ast_3_4", nombre: "Andrés Pinto", email: "andres.pinto@email.cl", rut: "16.234.567-8", tipoAsistente: "manual", fechaConfirmacion: "2025-09-26T09:45:00.000Z" },
            { id: "ast_3_5", nombre: "Sofía Castillo", email: "sofia.castillo@email.cl", rut: "20.678.901-2", tipoAsistente: "invitado", fechaConfirmacion: "2025-09-27T11:00:00.000Z" }
        ],
        totalAsistentes: 5
    },
    {
        titulo: "Taller de Fotografía",
        fecha: "2025-10-18",
        lugar: "Museo de Arte Contemporáneo, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Taller práctico sobre técnicas de fotografía artística y uso de cámara.",
        capacidad: 50,
        precio: 10000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_4",
        asistentes: [
            { id: "ast_4_1", nombre: "Gabriela Fernández", email: "gabriela.f@email.cl", rut: "17.123.456-7", tipoAsistente: "registrado", fechaConfirmacion: "2025-09-28T08:30:00.000Z" },
            { id: "ast_4_2", nombre: "Miguel Herrera", email: "miguel.herrera@email.cl", rut: "18.789.012-3", tipoAsistente: "manual", fechaConfirmacion: "2025-09-29T14:00:00.000Z" }
        ],
        totalAsistentes: 2
    },
    {
        titulo: "Seminario de Emprendimiento",
        fecha: "2025-10-22",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Conferencias sobre innovación, startups y oportunidades de negocio.",
        capacidad: 120,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_5",
        asistentes: [
            { id: "ast_5_1", nombre: "Francisco Vega", email: "francisco.vega@email.cl", rut: "19.345.678-9", tipoAsistente: "invitado", fechaConfirmacion: "2025-09-30T10:15:00.000Z" },
            { id: "ast_5_2", nombre: "Valentina Reyes", email: "valentina.reyes@email.cl", rut: "16.890.123-4", tipoAsistente: "registrado", fechaConfirmacion: "2025-10-01T12:30:00.000Z" },
            { id: "ast_5_3", nombre: "Diego Campos", email: "diego.campos@email.cl", rut: "18.234.567-8", tipoAsistente: "manual", fechaConfirmacion: "2025-10-02T16:45:00.000Z" }
        ],
        totalAsistentes: 3
    },
    {
        titulo: "Concierto Sinfónico",
        fecha: "2025-10-25",
        lugar: "Teatro Municipal, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Una presentación especial de la Orquesta Filarmónica con repertorio clásico.",
        capacidad: 100,
        precio: 15000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_6",
        asistentes: [
            { id: "ast_6_1", nombre: "Isabella Mendoza", email: "isabella.m@email.cl", rut: "17.567.890-1", tipoAsistente: "registrado", fechaConfirmacion: "2025-10-03T09:00:00.000Z" },
            { id: "ast_6_2", nombre: "Sebastián Lagos", email: "sebastian.lagos@email.cl", rut: "19.678.901-2", tipoAsistente: "invitado", fechaConfirmacion: "2025-10-04T13:20:00.000Z" }
        ],
        totalAsistentes: 2
    },
    {
        titulo: "Hackathon Tech",
        fecha: "2025-11-02",
        lugar: "Universidad de Chile, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Competencia intensiva de programación y desarrollo de proyectos tecnológicos.",
        capacidad: 80,
        precio: 5000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_7",
        asistentes: [
            { id: "ast_7_1", nombre: "Camila Ortiz", email: "camila.ortiz@email.cl", rut: "16.123.456-7", tipoAsistente: "registrado", fechaConfirmacion: "2025-10-05T10:30:00.000Z" },
            { id: "ast_7_2", nombre: "Matías Contreras", email: "matias.c@email.cl", rut: "18.567.890-1", tipoAsistente: "manual", fechaConfirmacion: "2025-10-06T14:45:00.000Z" },
            { id: "ast_7_3", nombre: "Javiera Soto", email: "javiera.soto@email.cl", rut: "19.890.123-4", tipoAsistente: "invitado", fechaConfirmacion: "2025-10-07T11:15:00.000Z" }
        ],
        totalAsistentes: 3
    },
    {
        titulo: "Webinar de Finanzas",
        fecha: "2025-11-08",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Charla en línea sobre inversión, ahorro y estrategias financieras personales.",
        capacidad: 150,
        precio: 0,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_8",
        asistentes: [
            { id: "ast_8_1", nombre: "Ricardo Muñoz", email: "ricardo.munoz@email.cl", rut: "17.234.567-8", tipoAsistente: "registrado", fechaConfirmacion: "2025-10-08T08:00:00.000Z" },
            { id: "ast_8_2", nombre: "Fernanda Castro", email: "fernanda.castro@email.cl", rut: "18.678.901-2", tipoAsistente: "invitado", fechaConfirmacion: "2025-10-09T12:30:00.000Z" }
        ],
        totalAsistentes: 2
    },
    {
        titulo: "Festival de Cine",
        fecha: "2025-11-15",
        lugar: "Centro Cultural Gabriela Mistral, Santiago",
        tipo: "Presencial",
        imagen: eventoIMG,
        descripcion: "Proyecciones de películas nacionales e internacionales con paneles de discusión.",
        capacidad: 130,
        precio: 7000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_9",
        asistentes: [
            { id: "ast_9_1", nombre: "Tomás Figueroa", email: "tomas.figueroa@email.cl", rut: "19.123.456-7", tipoAsistente: "manual", fechaConfirmacion: "2025-10-10T10:00:00.000Z" },
            { id: "ast_9_2", nombre: "Macarena Bravo", email: "macarena.bravo@email.cl", rut: "16.456.789-0", tipoAsistente: "registrado", fechaConfirmacion: "2025-10-11T15:20:00.000Z" },
            { id: "ast_9_3", nombre: "Nicolás Paredes", email: "nicolas.paredes@email.cl", rut: "18.890.123-4", tipoAsistente: "invitado", fechaConfirmacion: "2025-10-12T09:45:00.000Z" }
        ],
        totalAsistentes: 3
    },
    {
        titulo: "Clase Magistral de Cocina",
        fecha: "2025-11-20",
        lugar: "Online",
        tipo: "Streaming",
        imagen: eventoIMG,
        descripcion: "Un chef reconocido enseña técnicas y recetas exclusivas paso a paso.",
        capacidad: 1000,
        precio: 8000,
        creadoPor: "admin@eventos.cl",
        fechaCreacion: "2025-09-01T12:00:00.000Z",
        id: "evt_inicial_10",
        asistentes: [],
        totalAsistentes: 0
    }
];

// Obtener eventos desde localStorage o cargar datos iniciales
export function obtenerEventos() {
    try {
        const eventosGuardados = localStorage.getItem(STORAGE_KEY);
        if (eventosGuardados) {
            const eventos = JSON.parse(eventosGuardados);
            // Migración: asegurar que todos los eventos tengan totalAsistentes sincronizado
            const eventosMigrados = eventos.map(evento => ({
                ...evento,
                asistentes: evento.asistentes || [],
                totalAsistentes: evento.asistentes?.length || 0
            }));
            // Guardar versión migrada si hubo cambios
            if (JSON.stringify(eventos) !== JSON.stringify(eventosMigrados)) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(eventosMigrados));
            }
            return eventosMigrados;
        }
        // Si no hay eventos, inicializar con datos de ejemplo
        guardarEventos(eventosIniciales);
        return eventosIniciales;
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return [];
    }
}

// Guardar eventos en localStorage de forma segura
export function guardarEventos(eventos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
        return true;
    } catch (error) {
        console.error('Error al guardar eventos:', error);
        return false;
    }
}

// Crear nuevo evento con validación de usuario
export function crearEvento(nuevoEvento, userEmail) {
    if (!userEmail?.trim()) {
        console.error('Error: Se requiere un usuario válido para crear eventos');
        return null;
    }

    // Generar metadatos del evento
    const eventoConMetadatos = {
        ...nuevoEvento,
        creadoPor: userEmail,
        fechaCreacion: new Date().toISOString(),
        id: generateEventId(), // Uso la función importada en vez de duplicar el código
        asistentes: [], // Inicializar array de asistentes vacío
        totalAsistentes: 0 // Contador de asistentes
    };

    try {
        const eventos = obtenerEventos();
        eventos.push(eventoConMetadatos);

        if (guardarEventos(eventos)) {
            console.log(`✅ Evento "${nuevoEvento.titulo}" creado por ${userEmail}`);
            return eventoConMetadatos;
        }
        return null;
    } catch (error) {
        console.error('Error al crear evento:', error);
        return null;
    }
}

// Obtener lista completa de eventos
export function listarEventos() {
    return obtenerEventos() || [];
}

// Obtener eventos públicos (igual que listarEventos por ahora)
export function listarEventosPublicos() {
    return listarEventos();
}

/**
 * Editar un evento con validación de permisos
 * @param {number} indice - Índice del evento en el array
 * @param {Object} eventoEditado - Nuevos datos del evento
 * @param {string} userEmail - Email del usuario que edita
 * @param {boolean} isAdmin - Si el usuario es administrador
 * @returns {boolean} - true si se editó correctamente
 */
export function editarEvento(indice, eventoEditado, userEmail, isAdmin) {
    try {
        const eventos = obtenerEventos();

        // Validar índice y obtener evento original
        if (indice < 0 || indice >= eventos.length) {
            console.error('Error: Índice de evento inválido');
            return false;
        }

        const eventoOriginal = eventos[indice];

        // Validar permisos
        if (!isAdmin && eventoOriginal.creadoPor !== userEmail) {
            console.error('Error: Sin permisos para editar este evento');
            return false;
        }

        // Conservar metadatos originales Y asistentes
        const eventoActualizado = {
            ...eventoEditado,
            id: eventoOriginal.id,
            creadoPor: eventoOriginal.creadoPor,
            fechaCreacion: eventoOriginal.fechaCreacion,
            asistentes: eventoOriginal.asistentes || [],
            totalAsistentes: eventoOriginal.asistentes?.length || 0,
            fechaActualizacion: new Date().toISOString(),
            actualizadoPor: userEmail
        };

        eventos[indice] = eventoActualizado;
        const resultado = guardarEventos(eventos);
        if (resultado) {
            console.log(`✅ Evento "${eventoActualizado.titulo}" actualizado correctamente`);
        }
        return resultado;
    } catch (error) {
        console.error('Error al editar evento:', error);
        return false;
    }
}


/**
 * Eliminar un evento con validación de permisos
 * @param {number} indice - Índice del evento a eliminar
 * @param {string} userEmail - Email del usuario que elimina
 * @param {boolean} isAdmin - Si el usuario es administrador
 * @returns {boolean} - true si se eliminó correctamente
 */
export function eliminarEvento(indice, userEmail, isAdmin) {
    try {
        const eventos = obtenerEventos();

        // Validar índice
        if (indice < 0 || indice >= eventos.length) {
            console.error('Error: Índice de evento inválido');
            return false;
        }

        const evento = eventos[indice];

        // Validar permisos
        if (!isAdmin && evento.creadoPor !== userEmail) {
            console.error('Error: Sin permisos para eliminar este evento');
            return false;
        }

        // Eliminar y guardar
        eventos.splice(indice, 1);
        const resultado = guardarEventos(eventos);

        if (resultado) {
            console.log(`✅ Evento "${evento.titulo}" eliminado correctamente`);
        }
        return resultado;
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        return false;
    }
}

/**
 * Obtener eventos de un usuario específico
 * @param {string} email - Email del usuario
 * @returns {Array} - Lista de eventos del usuario
 */
export function obtenerEventosPorUsuario(email) {
    if (!email?.trim()) return [];

    try {
        const eventos = obtenerEventos();
        return eventos.filter(evento => evento.creadoPor === email);
    } catch (error) {
        console.error('Error al obtener eventos del usuario:', error);
        return [];
    }
}

/**
 * Cuento cuántos eventos tiene un usuario
 */
export function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

/**
 * Contar el total de usuarios registrados en el sistema
 * @returns {number} - Número total de usuarios
 */
export function contarTotalUsuarios() {
    try {
        const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
        return Array.isArray(usuarios) ? usuarios.length : 0;
    } catch (error) {
        console.error('Error al contar usuarios:', error);
        return 0;
    }
}


// Traigo eventos según el tipo de usuario: admin ve todo, usuario normal solo los suyos
export function obtenerMisEventos(userEmail, isAdmin) {
    if (isAdmin) {
        return obtenerEventos();
    } else {
        return obtenerEventosPorUsuario(userEmail);
    }
}

