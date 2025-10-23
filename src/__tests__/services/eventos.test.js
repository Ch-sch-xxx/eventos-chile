import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    contarEventosUsuario,
    contarTotalUsuarios,
    crearEvento,
    guardarEventos,
    obtenerEventos,
    obtenerMisEventos
} from "../../services/eventos";
import { generateEventId, validateEvento } from "../../services/eventosValidation";

describe("Servicios de Eventos - Core", () => {
  // Setup inicial con datos de prueba
  beforeEach(() => {
    const eventosIniciales = [
      {
        id: "evt_test_1",
        titulo: "Charla de ciberseguridad",
        fecha: "2025-12-31",
        lugar: "Online",
        tipo: "Streaming",
        descripcion: "Charla sobre seguridad informática",
        capacidad: 100,
        precio: 0,
        creadoPor: "admin@gmail.com",
        fechaCreacion: new Date().toISOString()
      },
      {
        id: "evt_test_2",
        titulo: "Evento Musical",
        fecha: "2025-12-25",
        lugar: "Teatro Municipal",
        tipo: "Presencial",
        descripcion: "Concierto de música clásica",
        capacidad: 200,
        precio: 5000,
        creadoPor: "usuario@gmail.com",
        fechaCreacion: new Date().toISOString()
      }
    ];

    const usuariosIniciales = [
      { email: "admin@gmail.com" },
      { email: "usuario@gmail.com" }
    ];

    // Configuración del localStorage
    localStorage.setItem("eventos-chile", JSON.stringify(eventosIniciales));
    localStorage.setItem("usuarios-chile", JSON.stringify(usuariosIniciales));
  });

  // Limpieza después de cada test
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // Tests de CRUD básico
  describe("Operaciones CRUD", () => {
    it("debería guardar nuevos eventos", () => {
      const nuevos = [{ titulo: "Nuevo evento chile" }];
      guardarEventos(nuevos);
      const guardado = JSON.parse(localStorage.getItem("eventos-chile"));
      expect(guardado[0].titulo).toBe("Nuevo evento chile");
    });

    it("debería obtener todos los eventos", () => {
      const eventos = obtenerEventos();
      expect(eventos).toHaveLength(2);
      expect(eventos[0].titulo).toBe("Charla de ciberseguridad");
    });

    it("debería crear un nuevo evento", () => {
      const nuevoEvento = {
        titulo: "Evento de prueba",
        fecha: "2025-12-31",
        lugar: "Lugar de prueba",
        tipo: "Presencial",
        descripcion: "Descripción de prueba",
        capacidad: 100,
        precio: 1000
      };

      const eventoCreado = crearEvento(nuevoEvento, "test@test.com");
      expect(eventoCreado.id).toBeDefined();
      expect(eventoCreado.creadoPor).toBe("test@test.com");
    });
  });

  // Tests de permisos y roles
  describe("Permisos y Control de Acceso", () => {
    it("debería contar los eventos de un usuario", () => {
      const total = contarEventosUsuario("usuario@gmail.com");
      expect(total).toBe(1);
    });

    it("debería devolver todos los eventos si es admin", () => {
      const todos = obtenerMisEventos("admin@gmail.com", true);
      expect(todos.length).toBeGreaterThan(1);
    });

    it("no debería permitir crear evento sin usuario", () => {
      const res = crearEvento({ titulo: "Evento sin usuario" }, null);
      expect(res).toBe(false);
    });
  });

  // Tests de validación
  describe("Validaciones", () => {
    it("debería validar campos requeridos", () => {
      const eventoInvalido = { titulo: "" };
      const { isValid, errors } = validateEvento(eventoInvalido);
      expect(isValid).toBe(false);
      expect(errors.titulo).toBeDefined();
    });

    it("debería validar tipos de datos", () => {
      const eventoInvalido = {
        titulo: "Test",
        capacidad: "no es número",
        precio: -100
      };
      const { isValid, errors } = validateEvento(eventoInvalido);
      expect(isValid).toBe(false);
      expect(errors.capacidad).toBeDefined();
      expect(errors.precio).toBeDefined();
    });
  });

  // Tests de utilidades
  describe("Utilidades", () => {
    it("debería generar IDs únicos", () => {
      const id1 = generateEventId();
      const id2 = generateEventId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^evt_\d+_[a-z0-9]+$/);
    });

    it("debería contar el total de usuarios registrados", () => {
      const totalUsuarios = contarTotalUsuarios();
      expect(totalUsuarios).toBe(2);
    });
  });
});
