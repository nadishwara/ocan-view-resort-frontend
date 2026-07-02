import { NextRequest, NextResponse } from 'next/server';

const SPRING_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || 'http://localhost:8080';

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

        const data = await response.json();

        if (!response.ok) {
            console.log('❌ Register proxy error:', response.status, data);
            return NextResponse.json(
                { message: data.message || 'Registration failed' },
                { status: response.status }
            );
        }

        console.log('✅ Register proxy success');
        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ Register proxy error:', error);
        return NextResponse.json(
            { message: 'Cannot connect to backend server' },
            { status: 500 }
        );
    }
}