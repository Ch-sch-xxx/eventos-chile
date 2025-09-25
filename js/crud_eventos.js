// Lógica de eventos
// manejando datos de eventos con localStorage
// Así tanto el admin como la página de eventos usan la misma info

// Recupera eventos desde almacenamiento local, o inicia vacío si no hay
function cargarEventos() {
    return JSON.parse(localStorage.getItem('eventosChile')) || [
        // Datos iniciales para que no esté vacío(estructura por aca)
        {
            titulo: "Evento de Prueba",
            fecha: "2025-09-10",
            lugar: "Santiago",
            tipo: "Presencial",
            imagen: "imagenes/eventosIMG.png"
        }
    ];
}

// Guardar eventos en localStorage
function guardarEventos(eventos) {
    localStorage.setItem('eventosChile', JSON.stringify(eventos));
}

// Crear evento
function crearEvento(objEvento) {
    let eventos = cargarEventos();
    // Agregamos imagen por defecto si no tiene
    if (!objEvento.imagen) {
        objEvento.imagen = "imagenes/eventosIMG.png";
    }
    eventos.push(objEvento);
    guardarEventos(eventos);
}

// Editar evento (por índice)
function editarEvento(idx, objNuevo) {
    let eventos = cargarEventos();
    if (eventos[idx]) {
        eventos[idx] = objNuevo;
        guardarEventos(eventos);
    }
}

// Eliminar evento
function eliminarEvento(idx) {
    let eventos = cargarEventos();
    eventos.splice(idx, 1);
    guardarEventos(eventos);
}

// Devuelve todos los eventos
function listarEventos() {
    return cargarEventos();
}
