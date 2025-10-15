// guardamos todos los eventos como una bd, pero esta es local,
// o sea, cargan en el navegador y no en el servidor
// y no se guardan en la nube, son datos temporales(es mejor eliminar los datos del navegador(conEstaPagina) para volver a probar)

// obtener eventos desde localStorage
function obtenerEventos() {
    const eventos = localStorage.getItem('eventos-chile');
    if (eventos) {
        return JSON.parse(eventos); // Convierte texto a objeto JSON
    } else {
        // Si no hay eventos, creamos algunos
        const eventosIniciales = [
            {
                titulo: "Festival de Música Urbana",
                fecha: "2025-09-30",
                lugar: "Estadio Nacional, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Un festival con los mejores exponentes de la música urbana nacional e internacional.",
                capacidad: 45000,
                precio: 25000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_1"
            },
            {
                titulo: "Conferencia de IA",
                fecha: "2025-10-05",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Expertos en inteligencia artificial presentan las últimas tendencias y avances.",
                capacidad: 5000,
                precio: 0,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_2"
            },
            {
                titulo: "Feria del Libro",
                fecha: "2025-10-12",
                lugar: "Centro Cultural La Moneda, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Encuentro cultural con editoriales, escritores y actividades literarias para toda la familia.",
                capacidad: 8000,
                precio: 3000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_3"
            },
            {
                titulo: "Taller de Fotografía",
                fecha: "2025-10-18",
                lugar: "Museo de Arte Contemporáneo, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Taller práctico sobre técnicas de fotografía artística y uso de cámara.",
                capacidad: 150,
                precio: 10000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_4"
            },
            {
                titulo: "Seminario de Emprendimiento",
                fecha: "2025-10-22",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Conferencias sobre innovación, startups y oportunidades de negocio.",
                capacidad: 3000,
                precio: 0,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_5"
            },
            {
                titulo: "Concierto Sinfónico",
                fecha: "2025-10-25",
                lugar: "Teatro Municipal, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Una presentación especial de la Orquesta Filarmónica con repertorio clásico.",
                capacidad: 1800,
                precio: 15000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_6"
            },
            {
                titulo: "Hackathon Tech",
                fecha: "2025-11-02",
                lugar: "Universidad de Chile, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Competencia intensiva de programación y desarrollo de proyectos tecnológicos.",
                capacidad: 600,
                precio: 5000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_7"
            },
            {
                titulo: "Webinar de Finanzas",
                fecha: "2025-11-08",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Charla en línea sobre inversión, ahorro y estrategias financieras personales.",
                capacidad: 2000,
                precio: 0,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_8"
            },
            {
                titulo: "Festival de Cine",
                fecha: "2025-11-15",
                lugar: "Centro Cultural Gabriela Mistral, Santiago",
                tipo: "Presencial",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Proyecciones de películas nacionales e internacionales con paneles de discusión.",
                capacidad: 2500,
                precio: 7000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_9"
            },
            {
                titulo: "Clase Magistral de Cocina",
                fecha: "2025-11-20",
                lugar: "Online",
                tipo: "Streaming",
                imagen: "imagenes/eventosIMG.png",
                descripcion: "Un chef reconocido enseña técnicas y recetas exclusivas paso a paso.",
                capacidad: 1000,
                precio: 8000,
                creadoPor: "admin@eventos.cl",
                fechaCreacion: "2025-09-01T12:00:00.000Z",
                id: "evt_inicial_10"
            }
        ];

        localStorage.setItem('eventos-chile', JSON.stringify(eventosIniciales));
        return eventosIniciales;
    }
}

// guardar eventos en localStorage
function guardarEventos(eventos) {
    localStorage.setItem('eventos-chile', JSON.stringify(eventos));
}

// CREAR nuevo evento CON AUTOR
function crearEvento(nuevoEvento) {
    const userEmail = localStorage.getItem('user-email');
    const eventos = obtenerEventos();

    // Verificar usuario logueado
    if (!userEmail) {
        console.error('No hay usuario logueado');
        return false;
    }

    nuevoEvento.creadoPor = userEmail;
    nuevoEvento.fechaCreacion = new Date().toISOString();
    nuevoEvento.id = 'evt_' + Date.now(); // único

    eventos.push(nuevoEvento);
    guardarEventos(eventos);
    console.log('Evento creado por:', userEmail, '| Título:', nuevoEvento.titulo);
    return true;
}

// LISTAR todos los eventos
function listarEventos() {
    return obtenerEventos();
}

function listarEventosPublicos() {
    return obtenerEventos();
}

// EDITAR evento (solo si es el creador o admin)
function editarEvento(indice, eventoEditado) {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const eventoOriginal = eventos[indice];

        // Verificar permisos: admin puede editar todo, usuario solo sus eventos
        if (userLogged !== 'admin' && eventoOriginal.creadoPor !== userEmail) {
            console.error('Sin permisos para editar este evento');
            return false;
        }

        // Mantener metadatos originales y agregar actualización
        eventoEditado.creadoPor = eventoOriginal.creadoPor;
        eventoEditado.fechaCreacion = eventoOriginal.fechaCreacion;
        eventoEditado.id = eventoOriginal.id;
        eventoEditado.fechaActualizacion = new Date().toISOString();
        eventoEditado.actualizadoPor = userEmail;

        eventos[indice] = eventoEditado;
        guardarEventos(eventos);
        console.log('Evento editado:', eventoEditado.titulo);
        return true;
    }
    return false;
}

// ELIMINAR evento (solo si es el creador o admin)
function eliminarEvento(indice) {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const evento = eventos[indice];

        // Verificar permisos: admin puede eliminar todo, usuario solo sus eventos
        if (userLogged !== 'admin' && evento.creadoPor !== userEmail) {
            console.error('Sin permisos para eliminar este evento');
            return false;
        }

        const eventoEliminado = eventos.splice(indice, 1)[0];
        guardarEventos(eventos);
        console.log('Evento eliminado:', eventoEliminado.titulo);
        return true;
    }
    return false;
}

// FUNCIONES filtrar eventos
function obtenerEventosPorUsuario(email) {
    const eventos = obtenerEventos();
    return eventos.filter(evento => evento.creadoPor === email);
}

function contarEventosUsuario(email) {
    return obtenerEventosPorUsuario(email).length;
}

function contarTotalUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios-chile') || '[]');
    return usuarios.length;
}

// FUNCIONES gestor personal
function obtenerMisEventos() {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');

    if (userLogged === 'admin') {
        // Admin ve todos los eventos
        return obtenerEventos();
    } else {
        // Usuario normal ve solo sus eventos
        return obtenerEventosPorUsuario(userEmail);
    }
}
