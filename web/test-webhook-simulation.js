const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// 1. Cargar variables de entorno de .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: No se encontró el archivo .env.local en la carpeta web.');
  process.exit(1);
}

const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return acc;
  const [key, ...val] = trimmed.split('=');
  if (key) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY; // Si existe
const eventsSecret = env.WOMPI_EVENTS_SECRET || 'test_events_XXXXXXXXXXXX';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Faltan variables de Supabase en .env.local.');
  process.exit(1);
}

// Inicializar cliente de Supabase (usamos service key si está, sino anon key)
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function runTest() {
  console.log('🤖 Iniciando Simulación de Webhook de Wompi...\n');

  // 2. Buscar un pedido "pendiente" existente para la prueba, o crear uno temporal
  let testOrderId;
  let isTempOrder = false;

  console.log('🔍 Buscando pedido pendiente en la base de datos...');
  const { data: existingOrders, error: findError } = await supabase
    .from('orders')
    .select('id')
    .eq('status', 'pendiente')
    .limit(1);

  if (findError) {
    console.error('❌ Error buscando pedidos:', findError.message);
    process.exit(1);
  }

  if (existingOrders && existingOrders.length > 0) {
    testOrderId = existingOrders[0].id;
    console.log(`✅ Usando pedido pendiente existente: ${testOrderId}`);
  } else {
    // Si no hay pedidos pendientes, creamos uno de prueba
    console.log('ℹ️ No se encontraron pedidos pendientes. Creando un pedido temporal para la prueba...');
    
    // Necesitamos un ID de producto para insertar un item de prueba si fuera necesario,
    // pero para probar el webhook de orders basta con insertar en orders directamente.
    const { data: newOrder, error: insertError } = await supabase
      .from('orders')
      .insert({
        status: 'pendiente',
        total: 85000,
        shipping_name: 'Simulación Webhook',
        shipping_phone: '3000000000',
        shipping_address: 'Calle de Prueba 123'
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('❌ Error al crear pedido temporal:', insertError.message);
      console.log('⚠️ NOTA: Si RLS está activo y no tienes la SUPABASE_SERVICE_ROLE_KEY en .env.local, la inserción anónima fallará.');
      process.exit(1);
    }

    testOrderId = newOrder.id;
    isTempOrder = true;
    console.log(`✅ Pedido temporal creado: ${testOrderId}`);
  }

  // 3. Generar la firma criptográfica válida
  const transactionId = `tx-${Math.random().toString(36).substring(2, 10)}`;
  const status = 'APPROVED';
  const amountInCents = 8500000; // 85,000 COP en centavos
  const timestamp = Math.floor(Date.now() / 1000);

  // Concatenación según firma Wompi: valores de propiedades + timestamp + eventsSecret
  const concatenatedString = `${transactionId}${status}${amountInCents}${timestamp}${eventsSecret}`;
  const validChecksum = crypto
    .createHash('sha256')
    .update(concatenatedString)
    .digest('hex');

  // Payload completo simulando el formato de Wompi
  const createPayload = (checksum) => ({
    event: 'transaction.updated',
    data: {
      transaction: {
        id: transactionId,
        reference: testOrderId,
        status: status,
        amount_in_cents: amountInCents,
        currency: 'COP',
        payment_method_type: 'CARD'
      }
    },
    timestamp: timestamp,
    signature: {
      properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      checksum: checksum
    }
  });

  const localWebhookUrl = 'http://localhost:3000/api/wompi/webhook';

  console.log(`\n🚀 Enviando petición al Webhook con FIRMA CORRECTA...`);
  try {
    const response = await fetch(localWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload(validChecksum))
    });

    const result = await response.json();
    console.log(`Status HTTP: ${response.status}`);
    console.log('Respuesta del Webhook:', JSON.stringify(result, null, 2));

    if (response.status === 200) {
      console.log('🎉 Petición procesada por el endpoint.');
      
      // Verificar si el estado del pedido en la base de datos realmente cambió
      console.log('🔄 Consultando base de datos para confirmar actualización...');
      const { data: updatedOrder, error: checkError } = await supabase
        .from('orders')
        .select('status, wompi_transaction_id')
        .eq('id', testOrderId)
        .single();

      if (checkError) {
        console.error('❌ Error al consultar pedido actualizado:', checkError.message);
      } else {
        console.log(`Estado actual del pedido en DB: "${updatedOrder.status}"`);
        console.log(`ID Transacción Wompi en DB: "${updatedOrder.wompi_transaction_id}"`);
        if (updatedOrder.status === 'pagado') {
          console.log('✅ EXCELENTE: ¡El pedido se actualizó a "pagado" correctamente!');
        } else {
          console.log('❌ ERROR: El endpoint respondió 200, pero el estado del pedido NO cambió en Supabase.');
          console.log('💡 Razón probable: El endpoint usa la clave anónima (Anon Key) en lugar de Service Role Key y las políticas RLS bloquearon la actualización sin reportar error HTTP (Next.js interceptó el error).');
        }
      }
    } else {
      console.log('❌ ERROR: El webhook rechazó la petición válida.');
    }
  } catch (err) {
    console.error('❌ Error de conexión con el servidor local:', err.message);
    console.log('💡 Recuerda que debes tener el servidor Next.js corriendo localmente (npm run dev) en el puerto 3000 para realizar esta prueba.');
  }

  console.log(`\n🚀 Enviando petición al Webhook con FIRMA INCORRECTA (Ataque/Simulación)...`);
  try {
    const response = await fetch(localWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createPayload('checksum_falso_y_malicioso'))
    });

    const result = await response.json();
    console.log(`Status HTTP: ${response.status} (Esperado: 401)`);
    console.log('Respuesta del Webhook:', JSON.stringify(result, null, 2));
    
    if (response.status === 401) {
      console.log('✅ EXCELENTE: El webhook rechazó correctamente la firma fraudulenta.');
    } else {
      console.log('❌ ALERTA DE SEGURIDAD: El webhook aceptó una firma incorrecta o respondió con un código inesperado.');
    }
  } catch (err) {
    console.error('❌ Error de conexión:', err.message);
  }

  // 4. Limpieza
  if (isTempOrder) {
    console.log(`\n🧹 Eliminando pedido temporal de prueba (${testOrderId})...`);
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', testOrderId);

    if (deleteError) {
      console.error('❌ Error al eliminar pedido temporal:', deleteError.message);
    } else {
      console.log('✅ Base de datos limpia.');
    }
  }

  console.log('\n🏁 Pruebas terminadas.');
}

runTest();
