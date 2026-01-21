import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const protectedRoutes = ['/todos']
const authRoutes = ['/login', '/signup']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users from auth routes to todos
  if (isAuthRoute && session) {
    const todosUrl = new URL('/todos', req.url)
    return NextResponse.redirect(todosUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/todos/:path*', '/login', '/signup'],
}
