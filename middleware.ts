import { auth } from './app/api/auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = ['/dashboard', '/api/food', '/api/history', '/api/profile', '/api/recommendations'];

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    // Redirect to sign in
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
