import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/analysis', '/top-performers', '/profile']
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuth = authRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/analysis/:path*',
    '/top-performers/:path*',
    '/profile/:path*',
    '/login',
    '/signup',
  ],
}