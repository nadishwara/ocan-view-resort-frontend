import { AuthError, LoginResponse } from "../types/auth";
import { TokenService } from "./tokenService";

const API_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL;

export class AuthService {
    private static async handleResponse<T>(response: Response): Promise<T> {
        const responseText = await response.text();

        let data: any;
        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch {
            throw new Error(`Invalid response format from server: ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
            const errorMessage = data.message || data.error || `HTTP Error ${response.status}`;
            const error = new Error(errorMessage) as AuthError;
            error.status = response.status;
            throw error;
        }

        return data as T;
    }

    static async login(
        username: string,
        password: string,
        reCaptchaToken?: string | null
    ): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ username, password, reCaptchaToken }),
        });

        const data = await this.handleResponse<LoginResponse>(response);

        if (!data.token) {
            throw new Error("Authentication failed - No token received from server.");
        }

        return data;
    }

    static async register(
        name: string,
        username: string,
        password: string,
        role: "ADMIN" | "USER" = "USER",
        recaptchaToken?: string | null
    ): Promise<LoginResponse> {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ name, username, password, role, recaptchaToken }),
        });

        return await this.handleResponse<LoginResponse>(response);
    }

    static logout(): void {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");

            // Clear auth cookies on all paths
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0;";
            document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0;";

            window.dispatchEvent(new Event("auth-change"));
        }
    }

    static getToken(): string | null {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
            if (token) return token;

            // Fallback: check document.cookie
            const match = document.cookie.match(/(?:^|;\s*)(?:auth_token|token)=([^;]+)/);
            if (match) {
                return decodeURIComponent(match[1]);
            }
        }
        return null;
    }

    static isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const decoded = TokenService.decode(token);
        if (!decoded) return false;

        if (decoded.exp) {
            return Date.now() < decoded.exp * 1000;
        }
        return true;
    }
}

// Standalone function exports for backward compatibility
export const loginUser = AuthService.login.bind(AuthService);
export const registerUser = AuthService.register.bind(AuthService);
export const logoutUser = AuthService.logout.bind(AuthService);
export const getToken = AuthService.getToken.bind(AuthService);
export const isAuthenticated = AuthService.isAuthenticated.bind(AuthService);