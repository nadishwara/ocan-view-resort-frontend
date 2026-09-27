export interface AuthPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

export interface LoginResponse {
    token: string;
    roles?: string[];
    role?: string;
    isAdmin?: boolean;
}

export interface DecodedToken {
    sub: string;
    name?: string;
    roles?: string[] | string;
    authorities?: Array<string | { authority?: string }>;
    role?: string | string[];
    exp: number;
    iat: number;
    [key: string]: unknown;
}

export interface AuthError extends Error {
    status?: number;
}