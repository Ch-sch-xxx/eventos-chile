import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  obtenerEventos, 
  guardarEventos, 
  crearEvento, 
  listarEventos,
  listarEventosPublicos,
  editarEvento,
  eliminarEvento,
  obtenerEventosPorUsuario,
  contarEventosUsuario,
  contarTotalUsuarios,
  obtenerMisEventos 
} from "./services/eventos";

describe("eventos.test.js", () => {
  
  beforeEach(() => {
    
    const eventosIniciales = [
      { id: "1", titulo: "Charla de ciberseguridad", creadoPor: "admin@gmail.com" },
      { id: "2", titulo: "Evento", creadoPor: "usuario@gmail.com" },
    ];

    
    
    const usuariosIniciales = [
      { email: "admin@gmail.com" },
      { email: "usuario@gmail.com" }
    ];

    localStorage.setItem("eventos-chile", JSON.stringify(eventosIniciales));
    localStorage.setItem("usuarios-chile", JSON.stringify(usuariosIniciales));
  });

  
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("debería guardar nuevos eventos", () => {
    const nuevos = [{ titulo: "Nuevo evento chile" }];
    guardarEventos(nuevos);
    const guardado = JSON.parse(localStorage.getItem("eventos-chile"));
    expect(guardado[0].titulo).toBe("Nuevo evento chile");
  });

  it("debería contar los eventos de un usuario", () => {
    const total = contarEventosUsuario("usuario@gmail.com"); 
    expect(total).toBe(1); 
  });

  it("devolver todos los eventos si es admin", () => {
    const todos = obtenerMisEventos("admin@gmail.com", true);
    expect(todos.length).toBeGreaterThan(1);
  });
  it("contar el total de usuarios registrados", () => {
    const totalUsuarios = contarTotalUsuarios();
    expect(totalUsuarios).toBe(2);
  });

    it("no permitir crear evento sin usuario", () => {
    const res = crearEvento({ titulo: "Evento sin usuario" }, null);
    expect(res).toBe(false);
  });
});