import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Aplica el middleware a todas las rutas EXCEPTO:
     * - archivos estáticos (_next/static, _next/image, favicon.ico, imágenes públicas)
     * Ajusta el matcher según necesidades del proyecto.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
