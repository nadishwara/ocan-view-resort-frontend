import { NextRequest, NextResponse } from 'next/server';
import { hasAdminRegistration, reserveAdminRegistration } from '@/lib/admin-registration-store';

const SPRING_URL = process.env.SPRING_BACKEND_URL;

function normalizeRole(body: Record<string, unknown> & { roles?: unknown[] }): 'ADMIN' | 'USER' {
    const roles = Array.isArray(body.roles) ? body.roles : [];
    const rawRole = String(body.role ?? roles[0] ?? body.userRole ?? '').trim().toUpperCase();

    if (rawRole === 'ADMIN' || body.isAdmin === true) {
        return 'ADMIN';
    }

    return 'USER';
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const normalizedRole = normalizeRole(body ?? {});
        const registrationBody = {
            ...body,
            role: normalizedRole,
        };

        if (normalizedRole === 'ADMIN') {
            const adminAlreadyExists = await hasAdminRegistration();
            if (adminAlreadyExists) {
                return NextResponse.json(
                    { message: 'An admin already exists. Cannot register another admin.' },
                    { status: 409 }
                );
            }
        }

        console.log('🔄 Proxying register to:', `${SPRING_URL}/api/auth/register`);

        const response = await fetch(`${SPRING_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(registrationBody),
        });

        const text = await response.text();
        let data: any;

        try {
            data = text ? JSON.parse(text) : null;
        } catch (parseError) {
            console.warn('⚠️ Register proxy received non-JSON response:', text);
            data = { message: text || 'Unexpected backend response' };
        }

        if (!response.ok) {
            console.log('❌ Register proxy error:', response.status, data);
            return NextResponse.json(
                { message: data?.message || data?.error || 'Registration failed' },
                { status: response.status }
            );
        }

        if (normalizedRole === 'ADMIN') {
            const reserved = await reserveAdminRegistration();
            if (!reserved) {
                return NextResponse.json(
                    { message: 'An admin already exists. Cannot register another admin.' },
                    { status: 409 }
                );
            }
        }

        console.log('✅ Register proxy success');
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ Register proxy error:', error);
        return NextResponse.json(
            { message: `Cannot connect to backend server at ${SPRING_URL}` },
            { status: 502 }
        );
    }
}