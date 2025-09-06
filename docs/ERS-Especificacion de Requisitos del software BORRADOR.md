Proyecto: Plataforma de Eventos Chile  
Version: 0.1  
Fecha: \[8 de septiembre 2025\]

## **1\. Introducción**

## **1.1 Propósito**

El presente documento define los requisitos del sistema web “Eventos Chile”, cuyo objetivo es permitir la creación, gestión y participación en eventos.

## **1.2 Ámbito del Sistema**

Eventos Chile es un sitio independiente para administrar eventos presenciales, streaming y consumo de entradas vía QR. Incluye:

* Registro y autenticación de usuarios (administradores y asistentes).  
* Dashboard administrativo para CRUD de eventos.  
* Vista pública para explorar eventos y unirse.  
    
  \*\*No cubre procesamiento real de pagos ni streaming integrado.

## **1.3 Definiciones, Acronimos y Abreviaciones**

* ERS: Especificación de Requisitos de Software  
* Admin: Usuario con rol de administrador  
* Evento: Objeto con título, descripción, fecha, lugar, tipo  
* QR: Código de respuesta rápida para control de acceso

## **1.4 Referencias**

* IEEE 830 – Especificación de Requisitos Software  
* Rúbrica DSY1104 etapa 1

## **1.5 Visión General**

El documento sigue estándar IEEE 830 con:

1. Introducción  
2. Descripción general  
3. Requisitos específicos (RF/RNF)

## **2\. Descripción General**

## **2.1 Perspectiva del Producto**

Aplicación web independiente, no integrada con otros sistemas. Publicada en GitHub Pages.

## **2.2 Funciones del Producto**

* Autenticación y gestión de roles  
* CRUD de eventos por admin  
* Exploración de eventos público/privado(público con verificación)  
* Confirmación de asistencia

## **2.3 Características de los Usuarios**

* Administrador: Usuarios con conocimiento básico de PC, gestionan eventos.  
* usuario(Público/privado): Usuarios finales sin conocimientos técnicos, exploran, se unen a eventos y crean eventos

## **2.4 Restricciones**

* Uso de HTML5, CSS3 y JS vanilla  
* Bootstrap 5 para estilos  
* Sin servidor backend en EP1 (interacciones simuladas/basicas)

## **2.5 Suposiciones y Dependencias**

* Los usuarios disponen de navegador moderno  
* No requiere base de datos real (localStorage o JS simulado en entregas futuras)

## **2.6 Requisitos Futuros**

* Implementar persistencia con Supabase (ideal)  
* Automatizar workflows con n8n (bajo revisión)  
* Integrar pagos online (opcional)

## **3\. Requisitos Específicos**

## **3.1 Requisitos comunes de las interfaces**

## **3.1.1 Interfaces de usuario**

* Páginas web semánticas con menú superior y áreas de contenido.

## **3.1.2 Interfaces de software**

* Conexión futura con API de Supabase (más adelante).

## **3.2 Requisitos funcionales (RF)**

| Código | Nombre | Descripción | Actores | Criterios de Aceptación |
| :---- | :---- | :---- | :---- | :---- |
| RF.1 | Registro y Login | Formulario para autenticar usuarios según su rol | Admin, Asistente | Email válido, pass 4–10 chars, redirige a dashboard según rol |
| RF.2 | Crear Evento | Formulario con Título, Descripción, Fecha, Lugar, Tipo de Evento (Presencial/Streaming/Consumo) | Admin | Campos obligatorios, select tipo activo, botón “Guardar” |
| RF.3 | Listar Eventos | Mostrar tabla o tarjetas con eventos existentes | Admin | Título, fecha y acciones Editar/Eliminar visibles |
| RF.4 | Explorar Eventos | Mostrar tarjetas de eventos en eventos.html | Asistente | Imagen, título, fecha, lugar y botón “Asistir al Evento” |
| RF.5 | Confirmar Asistencia | Acción “Asistir” cambia estado en front y pide login si no autenticado | Asistente | Alert \+ redirige a auth.html |
| RF.6 | Perfil de Usuario | Vista para ver y editar datos personales | Admin, Asistente | Campos Nombre, Email, Región y Comuna con select dinámico |

## **3.3 Requisitos no funcionales (RNF)**

| Código | Nombre | Descripción | Criterios de Aceptación |
| :---- | :---- | :---- | :---- |
| RNF.1 | HTML5 Semántico | Uso de \<header\>, \<nav\>, \<main\>, \<section\>, \<footer\> | Todas las páginas incluyen etiquetas semánticas correctas |
| RNF.2 | CSS Externo y Responsive | Bootstrap 5 \+ styles.css, diseño adaptable | Uso de variables CSS, grid responsive, media queries para móvil |
| RNF.3 | Validaciones Frontend | HTML5 (required, pattern) y JS básico | Mensajes de error claros, inputs bloquean envío si inválidos |
| RNF.4 | Navegación Coherente | Enlaces entre vistas | Todos los botones y enlaces dirigen a la página correcta |
| RNF.5 | Documentación y Versionado | GitHub con commits descriptivos y README actualizado | README incluye paleta de colores y despliegue GH Pages |

