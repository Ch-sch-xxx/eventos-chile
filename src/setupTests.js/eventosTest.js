import { describe, it, expect, beforeEach, vi } from "vitest";
import {obtenerEventos,guardarEventos,crearEvento,editarEvento,eliminarEvento,obtenerEventosPorUsuario,contarEventosUsuario,contarTotalUsuarios,obtenerMisEventos} from "../eventosStorage";


  const eventosIniciales = [
    { id: "1", titulo: "Evento 1", creadoPor: "admin@chile.cl" },
    { id: "2", titulo: "Evento 2", creadoPor: "usuario@chile.cl" },
  ];

  localStorage.setItem("eventos-chile", JSON.stringify(eventosIniciales));
  localStorage.setItem("usuarios-chile", JSON.stringify([
    { email: "admin@chile.cl" },
    { email: "usuario@chile.cl" }
  ]))

  global.STORAGE_KEY = "eventos-chile";
  global.eventosIniciales = eventosIniciales;
});
