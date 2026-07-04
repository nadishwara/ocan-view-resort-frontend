// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.replace('Bearer ', '');

  // පරිශීලකයා සිටින පිටුව
  const currentPath = request.nextUrl.pathname;

  // Admin routes වලට ප්‍රවේශය පාලනය කිරීම
  const isAdminRoute = currentPath.startsWith('/admin');
  const isAuthRoute = currentPath.startsWith('/auth'); // Login/Register pages

  // Admin route එකට ප්‍රවේශ වීමට token එක අවශ්‍යයි
  if (isAdminRoute && !token) {
    // ඔවුන්ව Home page එකට යවා ?login=true එකතු කරයි
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('login', 'true');
    return NextResponse.redirect(url);
  }

  // ඔබට අවශ්‍ය නම් login page එකට යාම වළක්වා, authenticated users යළි හරවන්න
  if (isAuthRoute && token) {
    // Dashboard එකට redirect කරන්න
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};