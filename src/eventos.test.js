import { describe, it, expect, beforeEach, vi } from "vitest";
import { obtenerEventos, guardarEventos, crearEvento, listarEventos,listarEventosPublicos,editarEvento,eliminarEvento,obtenerEventosPorUsuario,contarEventosUsuario,contarTotalUsuarios,obtenerMisEventos } from "./services/eventos";


//Simulacion de eventos
  const eventosIniciales = [
    { id: "1", titulo: "Charla de ciberseguridad", creadoPor: "admin@gmail.cl" },
    { id: "2", titulo: "Evento", creadoPor: "usuario@gmail.cl" },
  ];

  localStorage.setItem("eventos-chile", JSON.stringify(eventosIniciales));
  localStorage.setItem("usuarios-chile", JSON.stringify([
    { email: "admin@gmail.cl" },
    { email: "usuario@gmail.cl" }
  ]))

  global.STORAGE_KEY = "eventos-chile";
  global.eventosIniciales = eventosIniciales;

   it("debería guardar nuevos eventos", () => {
    const nuevos = [{ titulo: "Nuevo evento chile" }];
    guardarEventos(nuevos);
    const guardado = JSON.parse(localStorage.getItem("eventos-chile"));
    expect(guardado[0].titulo).toBe("Nuevo evento chile");


    it("contar los eventos de un usuario", () => {
         const total = contarEventosUsuario("usuario@gmail.cl"); 
         expect(total).toBe(1); });
  })

