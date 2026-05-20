# Diseño: Integración de Checkout e Historial

## Arquitectura de Datos
- **Frontend:** React 19 / Next.js 16.
- **Backend:** Supabase (PostgreSQL).
- **Tablas involucradas:** `profiles`, `orders`, `order_items`, `products`.

## Componentes a Modificar

### 1. `app/pago/page.tsx`
- Convertir a Client Component (si no lo es).
- Usar `useEffect` para cargar datos del perfil.
- Implementar lógica de guardado en Supabase dentro de `handleSubmit`.

### 2. `app/cuenta/pedidos/page.tsx`
- Implementar fetching de datos usando el cliente de Supabase.
- Mapear los resultados de la consulta a la UI existente.

## Flujo de Trabajo
1.  **Carga de datos de perfil:** `supabase.from('profiles').select('*').eq('id', user.id).single()`.
2.  **Inserción de pedido:**
    ```javascript
    const { data: order } = await supabase.from('orders').insert({ ... }).select();
    const { error: itemsError } = await supabase.from('order_items').insert(items.map(i => ({ order_id: order.id, ... })));
    ```
3.  **Consulta de historial:**
    ```javascript
    const { data: orders } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false });
    ```
