"use client";

import { X, Lock, User, Chrome, LogIn, UserPlus, ArrowRight, AlertCircle, User as UserIcon } from "lucide-react";
import { AuthPopupProps } from "@/app/types/auth";
import { useAuthForm } from "@/app/hooks/useAuthForm";

export default function AuthPopup({ isOpen, onClose }: AuthPopupProps) {
    const {
        isLogin,
        setIsLogin,
        username,
        setUsername,
        password,
        setPassword,
        name,
        setName,
        isAdminRegistration,
        setIsAdminRegistration,
        error,
        isLoading,
        handleSubmit,
        handleGoogleSignUp,
    } = useAuthForm(isOpen, onClose);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

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

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Tab Controls */}
                <div className="flex bg-gray-100 rounded-full p-1 mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${isLogin ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <LogIn className="w-4 h-4" />
                        Log in
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        disabled={isLoading}
                        className={`flex-1 py-2 text-sm font-medium rounded-full transition flex items-center justify-center gap-2 ${!isLogin ? "bg-white text-gray-900 shadow-md" : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        Register
                    </button>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
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

                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span>or</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-full hover:bg-gray-100 hover:border-[#D4AF37] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Chrome className="w-5 h-5 text-[#D4AF37]" />
                        <span>Sign up with Google</span>
                    </button>

                    <p className="text-center text-sm text-gray-600 mt-2">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            disabled={isLoading}
                            className="text-gradient-gold font-medium ml-1 hover:opacity-80 transition cursor-pointer"
                        >
                            {isLogin ? "Create one" : "Sign in"}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}