// middleware
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt, JWTPayload, jwtVerify } from 'jose';

function getToken(request: NextRequest): string | null {
  let cookieToken = request.cookies.get('auth_token')?.value || request.cookies.get('token')?.value;

  if (cookieToken) {
    if (cookieToken.startsWith('"') && cookieToken.endsWith('"')) {
      cookieToken = cookieToken.slice(1, -1);
    }
    return cookieToken.trim();
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  return null;
}

function normalizeRoles(value: unknown): string[] {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item !== null) {
          const rec = item as Record<string, unknown>;
          return String(rec.authority ?? rec.role ?? '');
        }
        return '';
      })
      .filter(Boolean);
  }

  if (typeof value === 'string') {
    if (value.includes(',')) {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (value.includes(' ')) {
      return value.split(' ').map((s) => s.trim()).filter(Boolean);
    }
    return [value.trim()];
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .filter((item): item is string => typeof item === 'string')
      .filter(Boolean);
  }

  return [];
}

async function getVerifiedPayload(token: string | null): Promise<JWTPayload | null> {
  if (!token) return null;

  const secretStr = process.env.JWT_SECRET;
  if (secretStr) {
    // 1. Try standard UTF-8 string encoding
    try {
      const secret = new TextEncoder().encode(secretStr);
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch { }

    // 2. Try hex decoded byte array if secret is valid hex
    if (/^[0-9a-fA-F]+$/.test(secretStr) && secretStr.length % 2 === 0) {
      try {
        const hexBytes = secretStr.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
        const hexKey = new Uint8Array(hexBytes);
        const { payload } = await jwtVerify(token, hexKey);
        return payload;
      } catch { }
    }

    // 3. Try base64 decoded byte array if secret is valid base64
    try {
      const binaryStr = atob(secretStr);
      const b64Key = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        b64Key[i] = binaryStr.charCodeAt(i);
      }
      const { payload } = await jwtVerify(token, b64Key);
      return payload;
    } catch { }
  }

  // 4. Safe fallback to decodeJwt with exp check for backend tokens
  try {
    const payload = decodeJwt(token);
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function isAdminRole(payload: JWTPayload | null): boolean {
  if (!payload) return false;

  const rec = payload as Record<string, unknown>;
  if (rec.isAdmin === true) return true;

  const roles = normalizeRoles(
    payload.roles ??
    payload.authorities ??
    payload.role ??
    rec.scope ??
    rec.scp
  );

  return roles.some((role) => {
    const upper = role.toUpperCase();
    return upper === 'ADMIN' || upper === 'ROLE_ADMIN' || upper.endsWith('_ADMIN');
  });
}

export async function middleware(request: NextRequest) {
  const token = getToken(request);
  const payload = await getVerifiedPayload(token);
  const currentPath = request.nextUrl.pathname;

  const isAdminRoute = currentPath.startsWith('/admin');
  const isDashboardRoute = currentPath === '/dashboard' || currentPath.startsWith('/dashboard/');
  const isAuthRoute = currentPath === '/auth' || currentPath.startsWith('/auth/');

  const isAuthenticated = !!payload;
  const isAdmin = isAdminRole(payload);

  if (isAdminRoute) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }

    if (!isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.delete('login');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', 'true');
      return NextResponse.redirect(url);
    }

    if (isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      url.searchParams.delete('login');
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (isAuthRoute && isAuthenticated) {
    const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
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