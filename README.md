# Proyecto Semestral: Plataforma Eventos Chile

## Descripción
Plataforma web para gestionar eventos en Chile, que permite la creación, organización y confirmación de asistencia a eventos presenciales, streaming y acceso mediante QR. Borrador funcional para la Primera Etapa (EP1) de la asignatura Desarrollo FullStack 2.

## Estructura del proyecto

**Raíz del repositorio**
- `index.html`
- `eventos.html`
- `auth.html`
- `administrador.html`

**Carpeta CSS**
- `css/style_inicio.css`
- `css/style_eventos.css`
- `css/style_auth_admin.css`
- `css/style_administrador.css`
- `css/responsividadGeneral.css`

**Carpeta JS**
- `js/auth.js`
- `js/administrador.js`
- `js/eventos_interaccion.js`

**Carpeta Imágenes**
- `imagenes/eventosIMG.png`
- `imagenes/ICONOperfil.png`

**Carpeta Docs**
- `docs/ERS-borrador.md`

## Tecnologías utilizadas
- HTML5 semántico
- CSS3 (variables, media queries, animaciones)
- JavaScript vanilla
- GitHub Pages (despliegue estático)

## Funcionalidades principales (EP1)
- **Inicio:** sección hero con texto animado por CSS
- **Eventos:** tarjetas responsivas y botón “Asistir”
- **Auth:** formularios toggleables de login/registro con validaciones
- **Admin:** panel con navegación lateral para crear y listar eventos
- Responsividad mobile-first mediante CSS global
- Navegación coherente entre páginas

## Ejecución local
1. Clona el repositorio:
- git clone https://github.com/Ch-sch-xxx/eventos-chile.git
2. Abrir los archivos `.html` directamente en un navegador moderno.
3. No requiere servidor ni configuración adicional para la visualización básica.

## Despliegue

El sitio está desplegado en GitHub Pages, accesible en:  
[https://ch-sch-xxx.github.io/eventos-chile/index.html](https://ch-sch-xxx.github.io/eventos-chile/index.html)

## Estructura del código

- `index.html` con estructura semántica y animación de texto CSS
- `eventos.html` muestra tarjetas de eventos con botón para confirmar asistencia (redirige a login)
- `auth.html` contiene login y registro con validaciones y toggle entre formularios
- `administrador.html` panel con barra lateral y área de contenido para crear y listar eventos
- CSS específicos por página, más un CSS global para responsividad en dispositivos
- Archivos JS para control de formularios y navegación dinámica sin backend real

## Consideraciones

- No hay backend ni base de datos en esta etapa, las funcionalidades son simuladas o estáticas.
- El código está preparado para integración futura con bases o APIs.
- Respeta estrictamente la rúbrica de la asignatura para asegurar cumplimiento de criterios.

## Créditos

Desarrollado por:
- Chris Sch
- Joaquín Shz

Para la asignatura Desarrollo FullStack 2 - Duoc UC

---

**Última actualización:** 08 de septiembre 2025
