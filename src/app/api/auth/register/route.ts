import { NextRequest, NextResponse } from 'next/server';

const SPRING_URL = process.env.SPRING_BACKEND_URL || process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || 'http://localhost:8080';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        console.log('🔄 Proxying register to:', `${SPRING_URL}/api/auth/register`);
        
        const response = await fetch(`${SPRING_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
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