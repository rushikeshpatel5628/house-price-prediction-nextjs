import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // extracting url path for matching
  const path = request.nextUrl.pathname
  // for public path
  const isPublicPath = path === '/login' || path === '/signup' 

  // extracting token
  const token = request.cookies.get('token')?.value || ''

  // redirecting authorized users to path '/'
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  // redirecting unauthorized users to path '/login'
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // If token is missing and trying to access a protected API route, return 401 Unauthorized
  if (path.startsWith('/api/predictions') && !token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/', '/predictions/:path*', '/login', '/signup', '/api/predictions/:path*'],
}

// export { auth as middleware } from "./auth"