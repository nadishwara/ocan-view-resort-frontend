import { DecodedToken } from "../types/auth";

export class TokenService {
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