"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
    X,
    Mail,
    Lock,
    User,
    Chrome,
    LogIn,
    UserPlus,
    ArrowRight,
    AlertCircle,
    User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

// ============ TYPES ============
interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

interface LoginResponse {
    token: string;
    roles?: string[];
    role?: string;
    isAdmin?: boolean;
}

interface DecodedToken {
    sub: string;
    roles?: string[] | string;
    authorities?: Array<string | { authority?: string }>;
    role?: string | string[];
    exp: number;
    iat: number;
    [key: string]: any;
}

interface AuthError extends Error {
    status?: number;
}

interface ApiErrorResponse {
    message?: string;
    error?: string;
}

// ============ TOKEN SERVICE ============
class TokenService {
    static decode(token: string): DecodedToken | null {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    }

    static normalizeRoleValue(role: unknown): string[] {
        if (!role) return [];
        if (Array.isArray(role)) {
            return role.flatMap((item) => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item && 'authority' in item) {
                    return String((item as any).authority);
                }
                return [] as string[];
            });
        }

        if (typeof role === 'string') {
            return [role];
        }

        if (typeof role === 'object' && role) {
            return Object.values(role).filter((value): value is string => typeof value === 'string');
        }

        return [];
    }

    static getRolesFromToken(token: string): string[] {
        const decoded = this.decode(token);
        if (!decoded) return [];

        const rawRoles = decoded.roles ?? decoded.authorities ?? decoded.role;
        return this.normalizeRoleValue(rawRoles).map((role) => role.toString().toUpperCase());
    }

    static isAdmin(token: string): boolean {
        const roles = this.getRolesFromToken(token);
        return roles.some((role) => role === 'ROLE_ADMIN' || role === 'ADMIN' || role.endsWith('_ADMIN'));
    }
}

// ============ AUTH SERVICE ============
class AuthService {
    private static async handleResponse(response: Response): Promise<any> {
        const responseText = await response.text();
        
        let data: any;
        try {
            data = JSON.parse(responseText);
        } catch {
            throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
            const errorMessage = data.message || data.error || `HTTP ${response.status}`;
            const error = new Error(errorMessage) as AuthError;
            error.status = response.status;
            throw error;
        }

        return data;
    }

    static async login(username: string, password: string): Promise<LoginResponse> {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await this.handleResponse(response);

        if (!data.token) {
            throw new Error("Invalid response - no token received");
        }

        return data;
    }

    static async register(name: string, username: string, password: string, role: "ADMIN" | "USER" = "USER"): Promise<LoginResponse> {
        const response = await fetch(`/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ name, username, password, role }),
        });

        return await this.handleResponse(response);
    }
}

// ============ MAIN COMPONENT ============
export default function AuthPopup({ isOpen, onClose, onOpen }: AuthPopupProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isAdminRegistration, setIsAdminRegistration] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const isMounted = useRef(true);

    // Cleanup
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Reset error when switching tabs
    const resetError = useCallback(() => {
        if (isMounted.current) {
            setError("");
        }
    }, []);

    useEffect(() => {
        resetError();
    }, [isLogin, resetError]);

    const handleAuthSuccess = useCallback((token: string, loginData?: LoginResponse) => {
        const decoded = TokenService.decode(token);
        const isAdminFromResponse = loginData?.isAdmin === true ||
            TokenService.normalizeRoleValue(loginData?.roles ?? loginData?.role).some((role) =>
                ['ROLE_ADMIN', 'ADMIN'].includes(role.toUpperCase())
            );
        const isAdminFromToken = TokenService.isAdmin(token);
        const isAdmin = isAdminFromResponse || isAdminFromToken;

        if (decoded && isMounted.current) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                username: decoded.sub,
                roles: TokenService.getRolesFromToken(token)
            }));
        }

        if (isMounted.current) {
            onClose();
        }

        // Redirect based on role
        router.replace(isAdmin ? "/admin/dashboard" : "/dashboard");
    }, [onClose, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMounted.current) return;
        
        setError("");
        setIsLoading(true);

        try {
            if (isLogin) {
                // Login flow
                const data = await AuthService.login(username, password);
                handleAuthSuccess(data.token, data);
            } else {
                // Register flow
                try {
                    const registrationRole = isAdminRegistration ? "ADMIN" : "USER";
                    await AuthService.register(name, username, password, registrationRole);
                    
                    // Auto login after registration
                    const loginData = await AuthService.login(username, password);
                    handleAuthSuccess(loginData.token, loginData);
                } catch (registerError) {
                    const err = registerError as AuthError;
                    if (err.status === 404) {
                        if (isMounted.current) {
                            setError("Registration is not available. Please contact administrator.");
                        }
                    } else {
                        throw registerError;
                    }
                }
            }
        } catch (err) {
            const error = err as AuthError;
            let errorMessage = "Something went wrong. Please try again.";
            
            if (error.message.includes("Failed to fetch")) {
                errorMessage = "Cannot connect to server. Please check your internet connection.";
            } else if (error.status === 401) {
                errorMessage = "Invalid username or password. Please try again.";
            } else if (error.status === 403) {
                errorMessage = "Access denied. Please check your credentials.";
            } else {
                errorMessage = error.message || "Something went wrong. Please try again.";
            }
            
            if (isMounted.current) {
                setError(errorMessage);
            }
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    };

    const handleGoogleSignUp = () => {
        const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || "http://localhost:8080";
        window.location.href = `${SPRING_API_URL}/oauth2/authorization/google`;
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative border border-gray-200 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        {isLogin ? "Sign in to continue" : "Join us today"}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${
                            isLogin
                                ? "bg-white text-gray-900 shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <LogIn className="w-4 h-4" />
                        Log in
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${
                            !isLogin
                                ? "bg-white text-gray-900 shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Register
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name field - only for registration */}
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Full name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                                    required={!isLogin}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={isAdminRegistration}
                                onChange={(e) => setIsAdminRegistration(e.target.checked)}
                                disabled={isLoading}
                                className="h-4 w-4 rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                            <span>Register as admin</span>
                        </label>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-ocean text-white font-semibold py-2.5 rounded-full hover:opacity-90 transition shadow-lg shadow-ocean/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {isLogin ? "Signing in..." : "Creating account..."}
                            </>
                        ) : (
                            <>
                                {isLogin ? "Sign in" : "Create account"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span>or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    {/* Google Sign Up Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-full hover:bg-gray-100 hover:border-[#D4AF37] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Chrome className="w-5 h-5 text-[#D4AF37]" />
                        <span>Sign up with Google</span>
                    </button>

                    {/* Toggle between Login/Register */}
                    <p className="text-center text-sm text-gray-600 mt-2">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={isLoading}
                            className="text-gradient-gold font-medium ml-1 hover:opacity-80 transition"
                        >
                            {isLogin ? "Create one" : "Sign in"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}