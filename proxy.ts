import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

const protectedRoutes = ['/todos']
const authRoutes = ['/login', '/signup']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req })

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Redirect authenticated users from auth routes to todos
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/todos', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/todos/:path*', '/login', '/signup'],
}
