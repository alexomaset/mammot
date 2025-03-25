import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Skip login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Only apply to admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Check for auth cookie presence
  const token = request.cookies.get('admin_token')?.value;

  if (token) {
    // Token exists, allow access
    // The actual verification will happen in the API routes
    return NextResponse.next();
  }

  // No token, redirect to login page
  const url = new URL('/admin/login', request.url);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
}; 