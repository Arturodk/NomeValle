# 🏠 NomeValle — Estado del Proyecto

Este documento detalla el estado actual del proyecto **Nomenclaturas del Valle**, qué componentes ya están implementados y funcionales, y cuáles son las tareas pendientes críticas antes de poder lanzar a producción.

---

## 🎯 ¿Qué es NomeValle?

Un e-commerce moderno enfocado en la venta de placas de nomenclatura personalizadas (números de casa) fabricadas en el Valle del Cauca, Colombia. Soporta materiales metálicos, bronce y aluminio.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 16 + React 19 + TypeScript |
| **Estilos** | CSS Modules + variables CSS globales |
| **Animaciones** | GSAP con ScrollTrigger (con soporte responsive y timelines cinematográficos) |
| **Backend/DB** | Supabase (PostgreSQL + Auth + Storage + RLS) |
| **Pagos** | Wompi (Pasarela de pagos colombiana — Widget Checkout) |
| **Íconos** | Lucide React |

---

## ✅ Lo que YA está construido y funcional

### 🏪 Tienda (Frontend Público)
- **Home (`/`)**: Hero animado cinemático con GSAP, grilla de materiales interactiva, listado de productos destacados, trust badges (seguridad, envío) y botón flotante de WhatsApp.
- **Catálogo (`/productos`)**: Listado general de productos filtrables por material, cargando dinámicamente desde Supabase.
- **Detalle de Producto (`/productos/[id]`)**: Vista individual que incluye fotos, información técnica y personalización.
- **Carrito (`/carrito`)**: Sumatoria de items, control de cantidades, soporte para personalización de textos e integración con `localStorage` para persistencia.
- **Checkout/Pago (`/pago`)**: Formulario completo de envío y contacto (conectado con el perfil de usuario de Supabase) e inicialización del Widget de Checkout de Wompi.
- **Confirmación (`/pago/confirmacion`)**: Página receptora post-pago.
- **Contacto (`/contacto`)**: Formulario básico para atención al cliente.
- **Autenticación (`/auth/login` y `/auth/registro`)**: Manejo de inicio de sesión y registro integrado nativamente con Supabase Auth.
- **Mi Cuenta (`/cuenta` y `/cuenta/pedidos`)**: Panel del cliente donde puede ver su información y el historial de pedidos realizados.

### 🔧 Panel de Administración (`/admin/*`)
- **Dashboard (`/admin`)**: Métricas clave en tiempo real (ingresos del día, pedidos hoy, alertas de stock bajo y estado de servidores).
- **Gestión de Productos (`/admin/productos`)**: CRUD completo de productos con formulario avanzado para carga de imágenes, precios, stock y visibilidad.
- **Gestión de Pedidos (`/admin/pedidos`)**: Visualización detallada de pedidos y sus estados de procesamiento.
- **Seguridad y Acceso Estricto (Middleware)**: Middleware de seguridad robusto (`web/middleware.ts`) que bloquea peticiones a `/admin` o `/admin/*` validando el rol de administrador del perfil de Supabase directamente en el servidor. Redirección segura para usuarios no autorizados.

### 🗄️ Base de Datos & Backend (Supabase)
- **Base de datos (PostgreSQL)** con 5 tablas principales: `profiles`, `products`, `product_images`, `orders` y `order_items`.
- **Triggers automáticos**:
  - Descuento automático de stock cuando se agrega un item a un pedido.
  - Restauración automática de stock si un pedido cambia a estado `'cancelado'`.
  - Sincronización automática al registrar un usuario en Auth para crear su perfil en la tabla pública `profiles`.
- **Seguridad (RLS)**: Row Level Security activado en todas las tablas con políticas de lectura/escritura basadas en roles (`customer` y `admin`).
- **Función de seguridad**: `public.is_admin()` para control estricto de accesos.
- **Integración Webhook Wompi (`/api/wompi/webhook`)**: Endpoint funcional y seguro que valida firmas de integridad SHA256 criptográficamente y procesa las actualizaciones automáticas de pedidos al recibir la confirmación de pago de Wompi.
- **Correos Electrónicos Transaccionales (Resend)**: Envío automático de correos tras confirmación de pago. Incluye plantilla premium de confirmación de compra para el cliente (con detalle de productos, personalización y dirección de envío) y alerta operativa para el administrador (con datos del cliente y productos a fabricar). Integrado de forma asíncrona no bloqueante en el webhook de Wompi.

---

## 🚨 Lo que FALTA o requiere atención (Roadmap a Lanzamiento)

### 🔴 Crítico (Bloquea el despliegue seguro)
1. **Configuración de credenciales de producción**:
   - Actualmente `.env.local` usa credenciales de prueba para Wompi (`pub_test_XXXXXXXXXXXX`) y Supabase. Se requiere intercambiar por las llaves reales de producción cuando se haga el despliegue.

### 🟡 Importante (Mejoras de UX y Operaciones)
2. **Carga de imágenes reales de catálogo**:
   - Reemplazar imágenes dummy de prueba por fotos reales de las nomenclaturas en Supabase Storage.

### 🟢 Opcional (Fase 2)
4. **Búsqueda e historial avanzado**: barra de búsqueda en el catálogo de productos.
5. **Monitoreo & Analytics**: Google Analytics o Mixpanel para entender el tráfico y conversiones.

---

*Estado del reporte: Actualizado al 20 de Mayo de 2026 — Correos transaccionales con Resend completados y validados.*
