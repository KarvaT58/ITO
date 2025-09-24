import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Verificar se estamos no Vercel e se é uma requisição de API
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas que precisam de autenticação
  const protectedRoutes = ['/dashboard', '/contacts', '/settings', '/chat', '/groups', '/campaigns', '/reports', '/team', '/n8n', '/internal-chat', '/help']
  
  // Verificar se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  
  console.log('Middleware - Rota:', req.nextUrl.pathname, 'Protegida:', isProtectedRoute, 'Sessão:', !!session)
  console.log('Middleware - Ambiente:', process.env.NODE_ENV)
  console.log('Middleware - Cookies:', req.cookies.getAll().map(c => c.name))
  
  // Verificação especial para Vercel - se não há cookies de sessão, permitir acesso temporariamente
  const hasSupabaseCookies = req.cookies.getAll().some(c => c.name.includes('supabase'))
  const isVercel = process.env.VERCEL === '1'
  
  if (isVercel && !hasSupabaseCookies && isProtectedRoute) {
    console.log('Vercel detectado sem cookies Supabase - permitindo acesso temporário')
    return response
  }

  if (isProtectedRoute && !session) {
    console.log('Redirecionando para login - usuário não autenticado')
    console.log('URL atual:', req.url)
    console.log('Headers:', Object.fromEntries(req.headers.entries()))
    
    // Redirecionar para login se não estiver autenticado
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Se estiver na página de login e já estiver autenticado, redirecionar para dashboard
  if (req.nextUrl.pathname === '/login' && session) {
    console.log('Usuário autenticado em /login, redirecionando para dashboard')
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Se estiver sendo redirecionado do dashboard para login, aguardar um pouco
  if (req.nextUrl.pathname === '/login' && req.nextUrl.searchParams.get('redirectedFrom') === '/dashboard') {
    console.log('Redirecionamento do dashboard detectado, aguardando...')
    // Não fazer nada, deixar o processo de login continuar
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
