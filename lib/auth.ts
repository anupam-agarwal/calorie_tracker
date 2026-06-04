import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get current user session
 */
export async function getCurrentSession() {
  const session = await getServerSession();
  return session;
}

/**
 * Verify user is authenticated
 */
export async function requireAuth(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    return null;
  }

  return session.user;
}

/**
 * Get user ID from session
 */
export async function getUserId(): Promise<string | null> {
  const session = await getCurrentSession();
  return session?.user?.id || null;
}

/**
 * Middleware to check authentication for API routes
 */
export async function authMiddleware(request: NextRequest) {
  const user = await requireAuth(request);

  if (!user) {
    return new NextResponse(
      JSON.stringify({
        status: 'error',
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return null; // Authorized, continue
}
