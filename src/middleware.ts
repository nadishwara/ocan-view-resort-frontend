// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

function getToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get('authorization');
  return authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
}

function normalizeRoles(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : typeof item === 'object' && item !== null ? String((item as Record<string, unknown>).authority ?? '') : ''))
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    return [value];
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .filter((item): item is string => typeof item === 'string')
      .filter(Boolean);
  }

  return [];
}

function isAdminRole(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = decodeJwt(token);
    const roles = normalizeRoles(payload.roles ?? payload.authorities ?? payload.role);
    return roles.some((role) => role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'ROLE_ADMIN' || role.toUpperCase().endsWith('_ADMIN'));
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const token = getToken(request);
  const currentPath = request.nextUrl.pathname;

  const isAdminRoute = currentPath.startsWith('/admin');
  const isDashboardRoute = currentPath === '/dashboard' || currentPath.startsWith('/dashboard/');
  const isAuthRoute = currentPath === '/auth' || currentPath.startsWith('/auth/');

  if (isAdminRoute) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }

    if (!isAdminRole(token)) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }

    if (isAdminRole(token)) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isAuthRoute && token) {
    const redirectPath = isAdminRole(token) ? '/admin/dashboard' : '/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
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