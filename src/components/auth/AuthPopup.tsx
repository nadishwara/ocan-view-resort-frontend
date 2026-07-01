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

interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

interface LoginResponse {
    token: string;
}

interface DecodedToken {
    sub: string;
    roles: string[];
    exp: number;
    iat: number;
}

interface AuthError {
    message: string;
    status?: number;
}

export default function AuthPopup({ isOpen, onClose, onOpen }: AuthPopupProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const isMounted = useRef(true);

    // Use Next.js API route instead of direct Spring Boot call
    const API_URL = "/api"; // This will use Next.js API routes

    // Cleanup on unmount
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

    // Prevent body scroll when popup is open
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

    // Decode JWT token
    const decodeToken = (token: string): DecodedToken | null => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Failed to decode token:", error);
            return null;
        }
    };

   // Update the handleLogin function to show more specific errors
const handleLogin = async (username: string, password: string): Promise<LoginResponse> => {
    console.log("🔄 Attempting login to:", `/api/auth/login`);
    
    try {
        const response = await fetch(`/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        console.log("📡 Login Response Status:", response.status);
        console.log("📡 Login Response Headers:", Object.fromEntries(response.headers));

        // Try to get response text first for debugging
        const responseText = await response.text();
        console.log("📝 Raw response:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            console.error("❌ Failed to parse JSON:", responseText);
            throw new Error(`Invalid response from server: ${responseText.substring(0, 100)}`);
        }

        if (!response.ok) {
            const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
            console.error("❌ Login failed:", errorMessage);
            const error: AuthError = new Error(errorMessage);
            error.status = response.status;
            throw error;
        }

        if (!data.token) {
            console.error("❌ No token in response:", data);
            throw new Error("Invalid response from server - no token received");
        }

        console.log("✅ Login successful, token received");
        return data;
        
    } catch (error: unknown) {
        console.error("❌ Login fetch error:", error);
        // Re-throw with better message
        if (error instanceof Error) {
            if (error.message.includes("Failed to fetch")) {
                throw new Error(`Cannot connect to server. Make sure Next.js is running on port 3000 and backend is running on ${process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || 'http://localhost:8080'}`);
            }
            throw error;
        }
        throw new Error("Unknown error occurred during login");
    }
};

    // Register function using Next.js API route
    const handleRegister = async (name: string, username: string, password: string): Promise<LoginResponse> => {
        console.log("🔄 Attempting registration to:", `${API_URL}/auth/register`);
        
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ name, username, password }),
            });

            console.log("📡 Register Response Status:", response.status);

            if (!response.ok) {
                let errorMessage = "Registration failed";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.error || "Registration failed";
                } catch {
                    const text = await response.text();
                    if (text) {
                        try {
                            const parsed = JSON.parse(text);
                            errorMessage = parsed.message || text;
                        } catch {
                            errorMessage = text || "Registration failed";
                        }
                    }
                }
                const error: AuthError = new Error(errorMessage);
                error.status = response.status;
                throw error;
            }

            const data = await response.json();
            console.log("✅ Registration successful");
            return data;
        } catch (error) {
            console.error("❌ Registration fetch error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMounted.current) return;
        
        setError("");
        setIsLoading(true);

        try {
            let data: LoginResponse;
            
            if (isLogin) {
                // Login flow
                data = await handleLogin(username, password);
                
                // Store token
                localStorage.setItem("token", data.token);
                
                // Decode token to get roles
                const decoded = decodeToken(data.token);
                console.log("🔓 Decoded token:", decoded);
                
                if (decoded && isMounted.current) {
                    localStorage.setItem("user", JSON.stringify({
                        username: decoded.sub,
                        roles: decoded.roles || []
                    }));
                }
                
                // Get user role
                const roles = decoded?.roles || [];
                const userRole = roles.length > 0 ? roles[0] : "ROLE_USER";
                console.log("👤 User role:", userRole);
                
                // Close popup first
                if (isMounted.current) {
                    onClose();
                }
                
                // Redirect based on role
                if (userRole === "ROLE_ADMIN" || userRole === "ADMIN") {
                    router.push("/admin/dashboard");
                } else {
                    router.push("/dashboard");
                }
                
            } else {
                // Register flow
                try {
                    data = await handleRegister(name, username, password);
                    
                    // Auto login after registration
                    const loginData = await handleLogin(username, password);
                    localStorage.setItem("token", loginData.token);
                    
                    const decoded = decodeToken(loginData.token);
                    if (decoded && isMounted.current) {
                        localStorage.setItem("user", JSON.stringify({
                            username: decoded.sub,
                            roles: decoded.roles || []
                        }));
                    }
                    
                    const roles = decoded?.roles || [];
                    const userRole = roles.length > 0 ? roles[0] : "ROLE_USER";
                    
                    if (isMounted.current) {
                        onClose();
                    }
                    
                    if (userRole === "ROLE_ADMIN" || userRole === "ADMIN") {
                        router.push("/admin/dashboard");
                    } else {
                        router.push("/dashboard");
                    }
                } catch (registerError: unknown) {
                    const err = registerError as AuthError;
                    // If registration endpoint doesn't exist, show error
                    if (err.message.includes("404") || err.status === 404) {
                        if (isMounted.current) {
                            setError("Registration is not available. Please contact administrator.");
                        }
                    } else {
                        throw registerError;
                    }
                }
            }
            
        } catch (err: unknown) {
            console.error("❌ Auth error:", err);
            
            const error = err as AuthError;
            let errorMessage = "Something went wrong. Please try again.";
            
            if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
                errorMessage = "Cannot connect to server. Please check your internet connection and make sure the backend is running.";
            } else if (error.message.includes("401") || error.message.includes("Unauthorized") || error.status === 401) {
                errorMessage = "Invalid username or password. Please try again.";
            } else if (error.message.includes("403") || error.message.includes("Forbidden") || error.status === 403) {
                errorMessage = "Access denied. Please check your credentials.";
            } else if (error.message.includes("404") && !isLogin) {
                errorMessage = "Registration endpoint not found. Please contact administrator.";
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
        // Redirect to Google OAuth endpoint (if configured)
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
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
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