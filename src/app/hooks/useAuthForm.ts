import { useState, useEffect, useCallback, useRef } from "react";
import { AuthService } from "../services/authService";
import { TokenService } from "../services/tokenService";
import { AuthError, LoginResponse } from "../types/auth";

export function useAuthForm(isOpen: boolean, onClose: () => void) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isAdminRegistration, setIsAdminRegistration] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);

    // Lifecycle cleanup
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // Close on ESC Key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    // Body scroll lock
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

    // Clear error on mode switch
    const resetError = useCallback(() => {
        if (isMounted.current) setError("");
    }, []);

    useEffect(() => {
        resetError();
    }, [isLogin, resetError]);

    const handleAuthSuccess = useCallback((token: string, loginData?: LoginResponse) => {
        const decoded = TokenService.decode(token);
        const isAdminFromResponse = loginData?.isAdmin === true;
        const isAdminFromToken = TokenService.isAdmin(token);
        const isAdmin = isAdminFromResponse || isAdminFromToken;

        if (decoded && isMounted.current) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                username: decoded.sub,
                name: decoded.name || decoded.sub,
                roles: TokenService.getRolesFromToken(token),
                role: isAdmin ? "ADMIN" : "USER"
            }));
        }

        if (isMounted.current) {
            onClose(); // Closes modal without page redirect
        }
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMounted.current) return;

        setError("");
        setIsLoading(true);

        try {
            if (isLogin) {
                const data = await AuthService.login(username, password);
                handleAuthSuccess(data.token, data);
            } else {
                try {
                    const registrationRole = isAdminRegistration ? "ADMIN" : "USER";
                    await AuthService.register(name, username, password, registrationRole);

                    const loginData = await AuthService.login(username, password);
                    handleAuthSuccess(loginData.token, loginData);
                } catch (registerError) {
                    const err = registerError as AuthError;
                    if (err.status === 404 && isMounted.current) {
                        setError("Registration is not available. Please contact administrator.");
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

            if (isMounted.current) setError(errorMessage);
        } finally {
            if (isMounted.current) setIsLoading(false);
        }
    };

    const handleGoogleSignUp = () => {
        const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL || "http://localhost:8080";
        window.location.href = `${SPRING_API_URL}/oauth2/authorization/google`;
    };

    return {
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
    };
}