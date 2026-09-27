import { DecodedToken } from "../types/auth";

export class TokenService {
    static decode(token: string): DecodedToken | null {
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const padLength = (4 - (base64.length % 4)) % 4;
            const padded = base64 + '='.repeat(padLength);
            try {
                const jsonPayload = decodeURIComponent(
                    atob(padded)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                );
                return JSON.parse(jsonPayload);
            } catch {
                return JSON.parse(atob(padded));
            }
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
                if (typeof item === 'object' && item !== null) {
                    const rec = item as Record<string, unknown>;
                    return String(rec.authority ?? rec.role ?? '');
                }
                return [] as string[];
            }).filter(Boolean);
        }

        if (typeof role === 'string') {
            if (role.includes(',')) {
                return role.split(',').map(r => r.trim()).filter(Boolean);
            }
            if (role.includes(' ')) {
                return role.split(' ').map(r => r.trim()).filter(Boolean);
            }
            return [role.trim()];
        }

        if (typeof role === 'object' && role) {
            return Object.values(role).filter((value): value is string => typeof value === 'string');
        }

        return [];
    }

    static getRolesFromToken(token: string): string[] {
        const decoded = this.decode(token);
        if (!decoded) return [];

        const record = decoded as Record<string, unknown>;
        const rawRoles = decoded.roles ?? decoded.authorities ?? decoded.role ?? record.scope ?? record.scp;
        return this.normalizeRoleValue(rawRoles).map((role) => role.toString().toUpperCase());
    }

    static isAdmin(token: string): boolean {
        const decoded = this.decode(token);
        if (!decoded) return false;

        const record = decoded as Record<string, unknown>;
        if (record.isAdmin === true) return true;

        const roles = this.getRolesFromToken(token);
        return roles.some((role) => role === 'ROLE_ADMIN' || role === 'ADMIN' || role.endsWith('_ADMIN'));
    }
}