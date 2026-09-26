"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthService } from "@/app/services/authService";
import {
    LayoutDashboard,
    BedDouble,
    LogOut,
    User,
    Calendar,
    Sparkles,
    Home,
} from "lucide-react";

interface SidebarProps {
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    userName?: string;
    memberSince?: string;
}

export function Sidebar({
    activeTab: propActiveTab,
    setActiveTab,
    userName = "John Doe",
    memberSince = "January 2024",
}: SidebarProps) {
    const pathname = usePathname();

    const handleLogout = () => {
        AuthService.logout();
        window.location.href = "/";
    };

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/user/dashboard" },
        { id: "bookings", label: "My Bookings", icon: Calendar, href: "/user/dashboard/bookings" },
        { id: "rooms", label: "Rooms", icon: BedDouble, href: "/user/dashboard/rooms" },
        { id: "suggestions", label: "Suggestions", icon: Sparkles, href: "/user/dashboard/suggestions" },
        { id: "profile", label: "Profile", icon: User, href: "/user/dashboard/profile" },
    ];

    const getIsActive = (href: string) => {
        if (href === "/user/dashboard") {
            return pathname === "/user/dashboard" || pathname === "/user";
        }
        return pathname?.startsWith(href) ?? false;
    };

    return (
        <aside className="w-64 border-r border-gray-200 dark:border-border bg-white dark:bg-card p-5 flex flex-col justify-between shrink-0">
            <div className="space-y-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display text-xl font-bold text-primary hover:opacity-90 transition"
                >
                    <Home className="text-gold" /> OceanView
                </Link>

                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = getIsActive(item.href);
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onClick={() => setActiveTab?.(item.id)}
                                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-gold/10 text-gold font-semibold shadow-sm"
                                        : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" /> {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-2">
                <div className="px-3 py-2 text-sm border-t border-gray-200 dark:border-border pt-4">
                    <p className="font-medium text-gray-900 dark:text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">Member since {memberSince}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                >
                    <LogOut className="h-4 w-4 shrink-0" /> Logout
                </button>
            </div>
        </aside>
    );
}