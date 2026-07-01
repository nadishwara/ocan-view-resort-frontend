import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const SPRING_URL = process.env.SPRING_BACKEND_URL || "http://localhost:8080";

        console.log("🔄 Proxying to:", `${SPRING_URL}/api/auth/login`);
        console.log("📤 Request body:", body);

        const res = await fetch(`${SPRING_URL}/api/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body),
        });

        console.log("📡 Spring response status:", res.status);

        // Read as text first to debug
        const text = await res.text();
        console.log("📝 Spring raw response:", text);

        if (!text) {
            return NextResponse.json(
                { message: "Backend returned empty response" },
                { status: 502 }
            );
        }

        const data = JSON.parse(text);
        return NextResponse.json(data, { status: res.status });

    } catch (err) {
        console.error("❌ Proxy error:", err);
        return NextResponse.json(
            { message: "Failed to connect to backend" },
            { status: 502 }
        );
    }
}