import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parámetros por URL o fallbacks
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'Nomenclaturas del Valle';
      
    const price = searchParams.get('price');
    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111111',
            color: 'white',
          }}
        >
          {/* Fondo si hay imagen */}
          {image && (
            <img
              src={image}
              alt="Fondo"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4, // Oscurecer la imagen para que resalte el texto
              }}
            />
          )}

          {/* Contenido centrado */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                fontSize: '70px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#ffffff',
                textShadow: '0 4px 10px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </h1>
            
            {price && (
              <div
                style={{
                  fontSize: '45px',
                  color: '#ffffff',
                  marginTop: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  padding: '15px 40px',
                  borderRadius: '100px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                }}
              >
                ${parseInt(price).toLocaleString('es-CO')}
              </div>
            )}
            
            <div
              style={{
                marginTop: '80px',
                fontSize: '30px',
                color: '#cbd5e1',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                fontWeight: '600',
              }}
            >
              Nomenclaturas del Valle
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(`Error generando la imagen OG: ${e.message}`);
    return new Response(`Fallo al generar la imagen`, { status: 500 });
  }
}
