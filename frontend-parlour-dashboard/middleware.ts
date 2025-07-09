import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/attendance'];
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookies or check if we need to redirect to login
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      // No token found, redirect to login
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Basic token validation (you might want to add more robust validation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        // Token expired, redirect to login
        const loginUrl = new URL('/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('token');
        return response;
      }

      // Check role-based access for admin/superadmin routes
      if (pathname.includes('/dashboard/admin') && payload.role !== 'admin' && payload.role !== 'superadmin') {
        const unauthorizedUrl = new URL('/login', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }

      if (pathname.includes('/dashboard/superadmin') && payload.role !== 'superadmin') {
        const unauthorizedUrl = new URL('/login', request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }

    } catch (error) {
      // Invalid token, redirect to login
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('token');
      return response;
    }
  }

  // For root route, if user is authenticated, redirect to appropriate dashboard
  if (pathname === '/') {
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Check if token is not expired
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          if (payload.role === 'admin' || payload.role === 'superadmin') {
            const dashboardUrl = new URL(`/dashboard/${payload.role}`, request.url);
            return NextResponse.redirect(dashboardUrl);
          }
        }
      } catch (error) {
        // Invalid token, continue to show home page
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
