# Instrucciones para Agentes AI - Eventos Chile

Este documento proporciona una guía esencial para trabajar con el código base de Eventos Chile, una aplicación React que gestiona eventos culturales y de entretenimiento.

## Arquitectura y Estructura

- **Frontend React + Vite**: Aplicación SPA con HMR y ESLint
- **Gestión de Estado**: Utiliza React Context para autenticación (`src/context/AuthContext.jsx`)
- **Persistencia Local**: localStorage como base de datos simulada (`src/services/eventos.js`)
- **Rutas Protegidas**: Implementadas en `src/context/ProtectedRoute.jsx`

### Componentes Principales
```
src/
  ├── components/     # Componentes reutilizables
  ├── context/       # Contextos globales (auth)
  ├── pages/         # Vistas principales
  ├── services/      # Lógica de negocio
  └── styles/        # CSS por componente
```

## Patrones y Convenciones

### Gestión de Datos
- Los eventos se almacenan en localStorage bajo la clave `eventos-chile`
- El servicio `eventos.js` maneja todas las operaciones CRUD
- Formato de ID de eventos: `evt_[timestamp]`

### Autenticación
- Roles: 'admin' y 'user'
- Datos de sesión en localStorage: `user-logged` y `user-email`
- Verificación de admin: `isAdmin: logged === 'admin'`

### Estilos
- CSS modular por componente en `src/styles/`
- Nombres de archivo coinciden con el componente relacionado

## Flujos de Desarrollo

### Configuración Inicial
```bash
npm install
npm run dev     # Desarrollo local
npm run build   # Compilación producción
npm run preview # Vista previa producción
```

### Nuevos Componentes
1. Crear archivo JSX en carpeta apropiada
2. Crear CSS correspondiente en `styles/`
3. Importar en página o componente padre

## Puntos de Integración
- Imágenes estáticas: Usar import directo para procesamiento Vite
- Autenticación: Usar hook `useAuth()` del AuthContext
- Rutas protegidas: Envolver en componente `ProtectedRoute`

## Referencias Clave
- Manejo de eventos: `src/services/eventos.js`
- Autenticación: `src/context/AuthContext.jsx`
- Componente ejemplo: `src/components/EventCard.jsx`
