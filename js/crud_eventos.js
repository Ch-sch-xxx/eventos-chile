// guardamos todos los eventos como una bd, pero esta es local,
// o sea, cargan en el navegador y no en el servidor
// y no se guardan en la nube, son datos temporales

// obtener eventos desde localStorage
function obtenerEventos() {
    const eventos = localStorage.getItem('eventos-chile');
    if (eventos) {
        return JSON.parse(eventos); // Convierte string a array
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
                    precio: 25000
                },
                {
                    titulo: "Conferencia de IA",
                    fecha: "2025-10-05",
                    lugar: "Online",
                    tipo: "Streaming",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Expertos en inteligencia artificial presentan las últimas tendencias y avances.",
                    capacidad: 5000,
                    precio: 0
                },
                {
                    titulo: "Feria del Libro",
                    fecha: "2025-10-12",
                    lugar: "Centro Cultural La Moneda, Santiago",
                    tipo: "Presencial",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Encuentro cultural con editoriales, escritores y actividades literarias para toda la familia.",
                    capacidad: 8000,
                    precio: 3000
                },
                {
                    titulo: "Taller de Fotografía",
                    fecha: "2025-10-18",
                    lugar: "Museo de Arte Contemporáneo, Santiago",
                    tipo: "Presencial",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Taller práctico sobre técnicas de fotografía artística y uso de cámara.",
                    capacidad: 150,
                    precio: 10000
                },
                {
                    titulo: "Seminario de Emprendimiento",
                    fecha: "2025-10-22",
                    lugar: "Online",
                    tipo: "Streaming",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Conferencias sobre innovación, startups y oportunidades de negocio.",
                    capacidad: 3000,
                    precio: 0
                },
                {
                    titulo: "Concierto Sinfónico",
                    fecha: "2025-10-25",
                    lugar: "Teatro Municipal, Santiago",
                    tipo: "Presencial",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Una presentación especial de la Orquesta Filarmónica con repertorio clásico.",
                    capacidad: 1800,
                    precio: 15000
                },
                {
                    titulo: "Hackathon Tech",
                    fecha: "2025-11-02",
                    lugar: "Universidad de Chile, Santiago",
                    tipo: "Presencial",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Competencia intensiva de programación y desarrollo de proyectos tecnológicos.",
                    capacidad: 600,
                    precio: 5000
                },
                {
                    titulo: "Webinar de Finanzas",
                    fecha: "2025-11-08",
                    lugar: "Online",
                    tipo: "Streaming",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Charla en línea sobre inversión, ahorro y estrategias financieras personales.",
                    capacidad: 2000,
                    precio: 0
                },
                {
                    titulo: "Festival de Cine",
                    fecha: "2025-11-15",
                    lugar: "Centro Cultural Gabriela Mistral, Santiago",
                    tipo: "Presencial",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Proyecciones de películas nacionales e internacionales con paneles de discusión.",
                    capacidad: 2500,
                    precio: 7000
                },
                {
                    titulo: "Clase Magistral de Cocina",
                    fecha: "2025-11-20",
                    lugar: "Online",
                    tipo: "Streaming",
                    imagen: "imagenes/eventosIMG.png",
                    descripcion: "Un chef reconocido enseña técnicas y recetas exclusivas paso a paso.",
                    capacidad: 1000,
                    precio: 8000
                }
            ]
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

    // Agregar metadatos del autor
    nuevoEvento.creadoPor = userEmail;
    nuevoEvento.fechaCreacion = new Date().toISOString();
    nuevoEvento.id = 'evt_' + Date.now(); //  único

    eventos.push(nuevoEvento);
    guardarEventos(eventos);
    console.log('Evento creado por:', userEmail, '| Título:', nuevoEvento.titulo);
    return true;
}

// LISTAR
function listarEventos() {
    return obtenerEventos();
}

// EDITAR evento (solo si es el creador o admin)
function editarEvento(indice, eventoEditado) {
    const userEmail = localStorage.getItem('user-email');
    const userLogged = localStorage.getItem('user-logged');
    const eventos = obtenerEventos();

    if (indice >= 0 && indice < eventos.length) {
        const eventoOriginal = eventos[indice];

        // Verificar permisos
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

        // Verificar permisos
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


// funciones para filtrar eventos
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