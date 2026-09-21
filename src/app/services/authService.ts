const API_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL;

interface LoginResponse {
    token: string;
    email: string;
    roles: string[];
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "USER";
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
    }

    return response.json();
}

export async function registerUser(name: string, email: string, password: string, role: "ADMIN" | "USER" = "USER"): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    return response.json();
}

export async function logoutUser(): Promise<void> {
    localStorage.removeItem("token");
    // Optional: Call logout API if needed
    // await fetch(`${API_URL}/auth/logout`, { method: "POST" });
}

export function getToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
}

export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    try {
        // Check if token is expired
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiry = payload.exp * 1000;
        return Date.now() < expiry;
    } catch {
        return false;
    }
}