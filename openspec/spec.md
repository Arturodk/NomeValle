# Nomenclaturas del Valle — Main Specification

**Versión:** 1.0  
**Última actualización:** 2026-05-06  
**Fase Actual:** Phase 4 — Admin Panel

---

## Visión General

**Nomenclaturas del Valle** es una tienda e-commerce especializada en placas metálicas, números en bronce y aluminio para viviendas y edificios en Colombia. Fabricados artesanalmente en el Valle del Cauca, con envío a toda la región.

### Propuesta de Valor
- Productos artesanales de alta calidad (metálico, bronce, aluminio)
- Compra online con pago seguro vía Wompi (tarjeta, PSE, Nequi)
- Atención directa por WhatsApp para pedidos personalizados
- Envío a todo el Valle del Cauca en 3-5 días hábiles

---

## Stack Técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Estilos | CSS Modules + CSS custom properties (variables) |
| Base de datos | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email/password) |
| Almacenamiento | Supabase Storage (bucket: product-images) |
| Pagos | Wompi (widget embebido) |
| Íconos | lucide-react |

---

## Materiales del Catálogo

| Material | Descripción |
|----------|------------|
| `metalico` | Resistente y versátil. Ideal para todo tipo de fachada |
| `bronce` | Elegancia clásica con acabados dorados naturales |
| `aluminio` | Moderno y ligero. Resistente a la corrosión |

---

## Roles de Usuario

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| `customer` | Cliente registrado | Catálogo, carrito, pedidos propios, perfil |
| `admin` | Administrador | Todo lo anterior + panel admin (productos, pedidos, stock) |

---

## Páginas del Sistema

| Ruta | Componente | Auth requerido |
|------|-----------|---------------|
| `/` | Home | No |
| `/productos` | Catálogo con filtros | No |
| `/productos/[id]` | Detalle de producto | No |
| `/carrito` | Carrito de compras | No (datos en localStorage) |
| `/pago` | Checkout con datos de envío | Sí (customer) |
| `/pago/confirmacion` | Confirmación de pedido | Sí (customer) |
| `/cuenta` | Perfil del usuario | Sí (customer) |
| `/cuenta/pedidos` | Historial de pedidos | Sí (customer) |
| `/auth/login` | Login | No (redirige si ya está auth) |
| `/auth/registro` | Registro | No (redirige si ya está auth) |
| `/contacto` | Formulario de contacto | No |
| `/admin` | Dashboard admin | Sí (admin) |

---

## Esquema de Base de Datos

5 tablas principales en Supabase PostgreSQL:

- **profiles** — extiende Supabase Auth con `full_name`, `phone`, `address`, `role`
- **products** — catálogo (`name`, `material`, `price`, `stock`, `is_active`)
- **product_images** — imágenes por producto (`url`, `is_primary`, `sort_order`)
- **orders** — pedidos (`user_id`, `status`, `total`, datos de envío, `wompi_transaction_id`)
- **order_items** — ítems del pedido (`product_id`, `quantity`, `unit_price`, `subtotal`)

> Detalle completo: `05_BaseDatos_Nomenclaturas_del_Valle.txt`

---

## Estados de un Pedido

```
pendiente → pagado → enviado → entregado
             ↓
           cancelado
```

---

## Fases del Proyecto

| Fase | Descripción | Estado |
|------|-------------|--------|
| Phase 1 — Foundation | UI completa con mock data, cart context, layouts | ✅ Completado |
| Phase 2 — Supabase Integration | DB real, auth, RLS, queries desde Next.js | ✅ Completado |
| Phase 3 — Wompi Payments | Integración real de pagos con Wompi | 🔄 En pruebas |
| Phase 4 — Admin Panel | CRUD completo de productos, gestión de pedidos | 🔄 En progreso |

> **Nota:** La Fase 3 requiere pruebas manuales con credenciales de Sandbox/Producción para validar el flujo completo de pago y retorno.

---

## Cambios Pendientes (Delta Specs)

*(Ninguno — inicio de Phase 2)*

---

## Historial de Versiones

| Versión | Fecha | Cambio |
|---------|-------|--------|
| v1.0 | 2026-05-06 | Spec inicial. Phase 1 completado. Inicio de Phase 2 (Supabase). |
