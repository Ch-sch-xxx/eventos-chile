# Eventos Chile

**Plataforma web para gestión de eventos culturales y de entretenimiento en Chile**

[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.5-purple.svg)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-blueviolet.svg)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

##  Demo en Vivo

**URL:** https://ch-sch-xxx.github.io/eventos-chile/

---

## Descripción

Sistema completo de gestión de eventos con autenticación, CRUD, sistema de asistencia y panel administrativo. Desarrollado con React 18, Vite y Bootstrap 5, utilizando localStorage como persistencia de datos.

###  Funcionalidades Principales

- 🔐 **Autenticación completa** (registro/login con validación de RUT chileno)
- 📅 **CRUD de eventos** (crear, listar, editar, eliminar)
- ✅ **Sistema de asistencia** (usuarios registrados e invitados)
- 👤 **Perfiles de usuario** (eventos creados y asistencias confirmadas)
- 🛡️ **Panel Admin** (gestión completa con roles)
- 🎨 **UI moderna** (tarjetas 3D, carrusel infinito, responsive)
- ✔️ **Validaciones robustas** (RUT Módulo 11, emails, fechas)

---

##  Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Frontend** | React 18.2 + Vite 4.5 |
| **UI Framework** | Bootstrap 5.3 |
| **Routing** | React Router v6 |
| **Persistencia** | localStorage API |
| **Testing** | Vitest + Testing Library |
| **Deployment** | GitHub Pages |

---

##  Instalación

```bash
# Clonar repositorio
git clone https://github.com/Ch-sch-xxx/eventos-chile.git
cd eventos-chile

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
http://localhost:5173
```

---

##  Scripts Disponibles

```bash
npm run dev          # Servidor desarrollo (HMR)
npm run build        # Build producción
npm run preview      # Vista previa del build
npm test             # Ejecutar tests
npm run test:coverage # Cobertura de tests
npm run deploy       # Deploy a GitHub Pages
```

---

##  Estructura del Proyecto

```
src/
├── components/      # Componentes React reutilizables
│   ├── EventCard.jsx           # Tarjeta 3D con flip
│   ├── EventCarousel.jsx       # Carrusel infinito
│   ├── Navbar.jsx              # Navegación dinámica
│   ├── Footer.jsx              # Pie de página
│   ├── ModalAsistencia.jsx     # Modal confirmación
│   └── ...
├── pages/           # Vistas principales
│   ├── Home.jsx                # Landing page
│   ├── Eventos.jsx             # Catálogo de eventos
│   ├── Auth.jsx                # Login/Registro
│   ├── Admin.jsx               # Panel administración
│   └── Perfil.jsx              # Perfil de usuario
├── context/         # Estado global
│   ├── AuthContext.jsx         # Context de autenticación
│   └── ProtectedRoute.jsx      # Guardias de rutas
├── services/        # Lógica de negocio
│   ├── eventos.js              # CRUD eventos
│   ├── asistencia.js           # Gestión asistencias
│   ├── usuarios.js             # Gestión usuarios
│   └── eventosValidation.js    # Validaciones
├── utils/           # Utilidades
│   └── validation.js           # Validaciones (RUT, email, etc)
├── styles/          # CSS modular
└── __tests__/       # Tests unitarios e integración
```

---

##  Credenciales de Prueba

### Usuario Administrador
- **Email:** `admin@eventos.cl`
- **Contraseña:** `admin`

### Usuario Normal
- **Registrarse** en `/auth` con datos válidos

---

##  Características Destacadas

### 1. Tarjetas 3D con Efecto Parallax
Componente `EventCard` con efecto de seguimiento del mouse y animación de flip para mostrar detalles.

### 2. Carrusel Infinito
Auto-scroll suave con loop continuo sin saltos visuales (60 FPS).

### 3. Validación de RUT Chileno
Implementación del algoritmo Módulo 11 para validar RUTs nacionales.

### 4. Sistema de Asistencia Inteligente
- Usuario logueado: confirmación rápida
- Invitado: formulario completo con validaciones
- Admin: agregación manual de asistentes

### 5. Responsive Design
Breakpoints optimizados para mobile (320px), tablet (768px) y desktop (1024px+).

---

##  Testing

```bash
# Ejecutar todos los tests
npm test

# Ver cobertura
npm run test:coverage
```

**Cobertura actual:** 70% (objetivo alcanzado propuesto)
