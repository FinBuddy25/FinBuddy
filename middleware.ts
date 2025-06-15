import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // First, update the Supabase auth session
  const response = await updateSession(request)

  // If the updateSession function returned a redirect, return it
  if (response instanceof NextResponse && response.headers.has('location')) {
    return response
  }

  // Add security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  return response
}

export const config = {
  matcher: [
    // Match all request paths except for static assets and Next.js internals
    '/((?!_next/static|_next/image|_next/data|favicon.ico).*)',
  ],
}
