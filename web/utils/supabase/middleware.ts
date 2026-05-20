import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión del usuario — NO añadir lógica entre aquí y getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas que requieren autenticación
  const protectedRoutes = ['/pago', '/cuenta']
  const adminRoutes = ['/admin']

  const pathname = request.nextUrl.pathname

  // Proteger rutas de cliente
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  if (isProtected && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  // Proteger rutas de admin — requiere verificar el rol en la DB
  const isAdmin = adminRoutes.some(route => pathname.startsWith(route))
  if (isAdmin) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      url.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(url)
    }
    // Verificar rol admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir usuarios ya logueados que visiten login/registro
  const authRoutes = ['/auth/login', '/auth/registro']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/cuenta'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
