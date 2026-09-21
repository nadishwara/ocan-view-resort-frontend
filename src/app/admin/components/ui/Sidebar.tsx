"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    BedDouble,
    Users,
    LogOut,
    Calendar,
    Bell,
    Settings,
    HelpCircle,
    Menu,
    X,
} from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const [adminName] = useState("Admin");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <aside
            className={`h-full border-r border-gray-200 dark:border-border bg-white dark:bg-card p-5 flex flex-col justify-between shrink-0 transition-all duration-300 relative ${
                isCollapsed ? "w-20" : "w-64"
            }`}
        >
            <div className="space-y-6">
                {/* Header Section: Logo & Animated Menu Toggle Icon */}
                <div className={`flex items-center gap-3 font-display text-xl font-bold text-primary ${isCollapsed ? "justify-center" : "justify-between"}`}>
                    
                    {/* Collapsed/Expanded Animation සහිත Hamburger Menu Icon එක */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary text-gold transition-transform duration-300 ease-in-out transform active:scale-95 shrink-0 outline-none"
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <div className={`transition-all duration-300 ease-in-out transform ${isCollapsed ? "rotate-180 scale-110" : "rotate-0 scale-100"}`}>
                            {isCollapsed ? (
                                <Menu className="h-6 w-6 text-gold" />
                            ) : (
                                <X className="h-6 w-6 text-gold" />
                            )}
                        </div>
                    </button>

                    {/* Logo Title */}
                    {!isCollapsed && (
                        <span className="truncate transition-opacity duration-300 opacity-100">
                            OceanView Admin
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <SidebarItem
                        icon={<LayoutDashboard className="h-4 w-4 shrink-0" />}
                        label="Dashboard"
                        href="/admin/dashboard"
                        isCollapsed={isCollapsed}
                        active={true}
                    />
                    <SidebarItem
                        icon={<BedDouble className="h-4 w-4 shrink-0" />}
                        label="Manage Rooms"
                        href="/admin/rooms"
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={<Calendar className="h-4 w-4 shrink-0" />}
                        label="Bookings"
                        href="/admin/bookings"
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={<Users className="h-4 w-4 shrink-0" />}
                        label="Hotel Guests"
                        href="/admin/guests"
                        isCollapsed={isCollapsed}
                    />
                </nav>

                {/* Bottom Navigation */}
                <div className="border-t border-gray-200 dark:border-border pt-4">
                    <SidebarItem
                        icon={<Bell className="h-4 w-4 shrink-0" />}
                        label="Notifications"
                        isCollapsed={isCollapsed}
                        badge="3"
                    />
                    <SidebarItem
                        icon={<Settings className="h-4 w-4 shrink-0" />}
                        label="Settings"
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={<HelpCircle className="h-4 w-4 shrink-0" />}
                        label="Help & Support"
                        isCollapsed={isCollapsed}
                    />
                </div>
            </div>

            {/* User Profile & Logout */}
            <div className="space-y-2">
                <div className={`border-t border-gray-200 dark:border-border pt-4 ${isCollapsed ? "text-center" : ""}`}>
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                        <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold shrink-0">
                            {adminName.charAt(0)}
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-foreground truncate">
                                    {adminName}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition ${
                        isCollapsed ? "justify-center" : ""
                    }`}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!isCollapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
}

// Sidebar Item Component
function SidebarItem({
    icon,
    label,
    href,
    isCollapsed,
    active = false,
    badge,
}: {
    icon: React.ReactNode;
    label: string;
    href?: string;
    isCollapsed: boolean;
    active?: boolean;
    badge?: string;
}) {
    const content = (
        <div
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition relative ${
                active
                    ? "bg-gold/10 text-gold"
                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
            } ${isCollapsed ? "justify-center" : ""}`}
        >
            {icon}
            {!isCollapsed && <span className="flex-1">{label}</span>}
            {!isCollapsed && badge && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {badge}
                </span>
            )}
            {isCollapsed && badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {badge}
                </span>
            )}
        </div>
    );

    if (href) {
        return (
            <a href={href} className={`block relative ${isCollapsed ? "text-center" : ""}`}>
                {content}
            </a>
        );
    }

    return <button className={`w-full relative ${isCollapsed ? "text-center" : ""}`}>{content}</button>;
}