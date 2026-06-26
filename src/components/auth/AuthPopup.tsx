"use client";

import { useState, useEffect } from "react";
import {
    X,
    Mail,
    Lock,
    User,
    Chrome,
    LogIn,
    UserPlus,
    ArrowRight,
} from "lucide-react";

interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export default function AuthPopup({ isOpen, onClose, onOpen }: AuthPopupProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            console.log("Login:", { email, password });
            alert("✅ Login successful!");
        } else {
            console.log("Register:", { name, email, password });
            // Replace with actual registration logic
            alert("✅ Registration successful!");
        }
        onClose();
    };

    const handleGoogleSignUp = () => {
        console.log("Google sign-up clicked");
        // Replace with actual Google OAuth logic
        alert("🌟 Google sign-up flow (demo)");
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

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${isLogin
                                ? "bg-white text-gray-900 shadow-md"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <LogIn className="w-4 h-4" />
                        Log in
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${!isLogin
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
                                    placeholder="Mila Chen"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="mila@example.com"
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition"
                                required
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
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-ocean text-white font-semibold py-2.5 rounded-full hover:opacity-90 transition shadow-lg shadow-ocean/30 flex items-center justify-center gap-2"
                    >
                        {isLogin ? "Sign in" : "Create account"}
                        <ArrowRight className="w-4 h-4" />
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
                        className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-full hover:bg-gray-100 hover:border-[#D4AF37] transition"
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
