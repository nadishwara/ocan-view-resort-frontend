import { useState, useEffect, useCallback, useRef } from "react";
import { AuthService } from "../services/authService";
import { TokenService } from "../services/tokenService";
import { AuthError, LoginResponse } from "../types/auth";
import { useReCaptchaToken } from "./useReCaptchaToken";

export function useAuthForm(isOpen: boolean, onClose: () => void) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isAdminRegistration, setIsAdminRegistration] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isMounted = useRef(true);
    const { getRecaptchaToken } = useReCaptchaToken();

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

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
        const rolesFromToken = TokenService.getRolesFromToken(token);

        if (isMounted.current) {
            const usernameVal = decoded?.sub || username;
            const nameVal = (decoded as any)?.name || decoded?.sub || name || username;
            const finalRoles = rolesFromToken.length > 0 ? rolesFromToken : (isAdmin ? ["ROLE_ADMIN"] : ["ROLE_USER"]);

            // 1. Save to LocalStorage
            localStorage.setItem("token", token);
            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify({
                username: usernameVal,
                name: nameVal,
                roles: finalRoles,
                role: isAdmin ? "ADMIN" : "USER"
            }));

            // 2. Set Cookies for Middleware and Server Components (immediate cross-route sync)
            const maxAgeDays = 7 * 86400; // 7 days
            const expires = new Date(Date.now() + 7 * 86400 * 1000).toUTCString();
            const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
            const secureFlag = isSecure ? "; Secure" : "";

            document.cookie = `token=${token}; path=/; max-age=${maxAgeDays}; expires=${expires}; SameSite=Lax${secureFlag}`;
            document.cookie = `auth_token=${token}; path=/; max-age=${maxAgeDays}; expires=${expires}; SameSite=Lax${secureFlag}`;

            // 3. Clean ?login=true query param from URL
            if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                if (url.searchParams.has("login")) {
                    url.searchParams.delete("login");
                    const cleanUrl = url.pathname + (url.search ? url.search : "");
                    window.history.replaceState({}, "", cleanUrl);
                }
            }

            // 4. Notify app of authentication change
            window.dispatchEvent(new Event("auth-change"));

            // 5. Close auth popup without navigating away
            onClose();
        }
    }, [name, onClose, username]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isMounted.current) return;

        setError("");
        setIsLoading(true);

        try {
            const actionName = isLogin ? "user_login" : "user_register";
            const recaptchaToken = await getRecaptchaToken(actionName);
            if (!recaptchaToken) {
                if (isMounted.current) {
                    setError("Security verification failed. Please refresh and try again.");
                    setIsLoading(false);
                }
                return;
            }
            if (isLogin) {
                const data = await AuthService.login(username, password, recaptchaToken);
                handleAuthSuccess(data.token, data);
            } else {
                try {
                    const registrationRole = isAdminRegistration ? "ADMIN" : "USER";
                    await AuthService.register(name, username, password, registrationRole, recaptchaToken);

                    const autoLoginToken = await getRecaptchaToken("user_login_after_register");
                    const loginData = await AuthService.login(username, password, autoLoginToken || undefined);
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

            if (error.message?.includes("Failed to fetch")) {
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
        const SPRING_API_URL = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL;
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