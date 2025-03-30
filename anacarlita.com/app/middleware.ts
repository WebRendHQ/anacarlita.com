import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// Define an array of paths that should be protected (require authentication)
const protectedPaths = [
  '/profile',
  '/rentals/create',
  '/rentals/edit',
  '/dashboard',
  '/bookings',
];

// Define paths that should only be accessible to logged out users
const authPaths = [
  '/login',
  '/register',
  '/forgot-password',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check for a session cookie
  const sessionCookie = request.cookies.get('session-token')?.value;
  const isAuthenticated = !!sessionCookie;
  
  // If protected path and not authenticated, redirect to login
  if (
    protectedPaths.some(protectedPath => 
      path === protectedPath || path.startsWith(`${protectedPath}/`)
    ) && 
    !isAuthenticated
  ) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  // If auth path and already authenticated, redirect to profile
  if (
    authPaths.some(authPath => 
      path === authPath || path.startsWith(`${authPath}/`)
    ) && 
    isAuthenticated
  ) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }
  
  // Otherwise continue
  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 