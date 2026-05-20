## 1. Infraestructura y Autorización

- [x] 1.1 Crear Route Group `(admin)` con `app/(admin)/admin/layout.tsx` que incluya sidebar y header del panel
- [x] 1.2 Implementar verificación de `role === 'admin'` en el layout del admin usando Server Component (`getUser()` + query a `profiles`)
- [x] 1.3 Actualizar `middleware.ts` para redirigir `/admin/**` a `/auth/login` si no hay sesión activa
- [x] 1.4 Añadir políticas RLS en Supabase para rol admin: `SELECT/INSERT/UPDATE/DELETE` en `products`, `product_images`, `orders`
- [x] 1.5 Verificar que la política de Storage para `product-images` permite upload desde Server Actions con `service_role`

## 2. Dashboard `/admin`

- [x] 2.1 Crear `app/(admin)/admin/page.tsx` con layout de tarjetas de métricas
- [x] 2.2 Implementar query: total de pedidos del día, pedidos pendientes, ingresos del día
- [x] 2.3 Implementar query: productos con stock < 5 unidades
- [x] 2.4 Implementar query: últimos 5 pedidos con estado, cliente y total
- [x] 2.5 Crear componente `AdminMetricCard` con número destacado y etiqueta
- [x] 2.6 Crear componente `AdminRecentOrders` con tabla de pedidos recientes

## 3. Gestión de Productos — Listado

- [x] 3.1 Crear `app/(admin)/admin/productos/page.tsx` con tabla paginada de productos
- [x] 3.2 Implementar query paginada (limit 20, offset) de todos los productos incluyendo inactivos
- [x] 3.3 Añadir columnas: nombre, material, precio, stock, estado (activo/inactivo)
- [x] 3.4 Añadir botones de acción: "Editar", "Archivar/Reactivar"
- [x] 3.5 Implementar Server Action `toggleProductStatus(id, is_active)` para archivar/reactivar

## 4. Gestión de Productos — Formulario Crear/Editar

- [x] 4.1 Crear `app/(admin)/admin/productos/nuevo/page.tsx`
- [x] 4.2 Crear `app/(admin)/admin/productos/[id]/editar/page.tsx`
- [x] 4.3 Crear componente `ProductForm` reutilizable (Server Action-based o API Route)
- [x] 4.4 Añadir campos: nombre, descripción, material, precio, stock, dimensiones, tiempo de entrega
- [x] 4.5 Añadir integración con Supabase Storage para subir imágenes (múltiples)
- [x] 4.6 Implementar Server Action `upsertProduct(data)` para guardar en base de datos
- [x] 4.7 Manejar estado de carga y validación de formulario en Server Action: subir a `product-images/{productId}/{filename}`, insertar en `product_images`
- [ ] 4.7 Implementar eliminación de imagen: borrar de Storage + eliminar registro de `product_images`
- [ ] 4.8 Implementar selección de imagen principal (`is_primary = true`, resto `false`)
- [ ] 4.9 Añadir validación de formulario client-side (campos requeridos: nombre, precio, al menos una imagen)

## 5. Gestión de Pedidos — Listado

- [x] 5.1 Crear `app/(admin)/admin/pedidos/page.tsx` con tabla paginada de todos los pedidos
- [x] 5.2 Implementar query: todos los pedidos con JOIN a `profiles` para nombre del cliente
- [x] 5.3 Añadir columnas: ID (últimos 8 chars), cliente, total, estado, fecha
- [x] 5.4 Implementar filtro por estado (select con opciones: todos, pendiente, pagado, enviado, entregado, cancelado)

## 6. Gestión de Pedidos — Detalle y Estado

- [x] 6.1 Crear `app/(admin)/admin/pedidos/[id]/page.tsx` con vista detalle del pedido
- [x] 6.2 Implementar query: pedido + `order_items` con JOIN a `products` para nombres
- [x] 6.3 Mostrar: datos del cliente, dirección de envío, ítems, subtotales y total
- [x] 6.4 Implementar selector de estado con transiciones válidas: `pendiente→pagado`, `pagado→enviado`, `enviado→entregado`, `pagado→cancelado`
- [x] 6.5 Implementar Server Action `updateOrderStatus(id, newStatus)` con validación de transición
- [x] 6.6 Manejar caso de pedido no encontrado con redirect al listado

## 7. Componentes Compartidos del Panel Admin

- [x] 7.1 Crear `AdminSidebar` con navegación: Dashboard, Productos, Pedidos
- [x] 7.2 Crear `AdminHeader` con nombre del usuario y botón de cierre de sesión
- [x] 7.3 Crear estilos CSS Module para el layout admin (`admin.module.css`)
- [x] 7.4 Crear componente `AdminTable` reutilizable con soporte de paginación
- [x] 7.5 Crear componente `StatusBadge` para mostrar estados con colores diferenciados

## 8. Pruebas y Validación

- [ ] 8.1 Verificar que un usuario `customer` no puede acceder a ninguna ruta `/admin`
- [ ] 8.2 Verificar que las políticas RLS bloquean escritura directa desde cliente no-admin
- [ ] 8.3 Probar flujo completo: crear producto → verificar que aparece en catálogo público
- [ ] 8.4 Probar flujo completo: archivar producto → verificar que desaparece del catálogo
- [ ] 8.5 Probar flujo completo: cambiar estado de pedido y verificar persistencia
- [ ] 8.6 Probar upload de imagen y verificar que aparece correctamente en el producto
