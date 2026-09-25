"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./components/Sidebar";

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userName, setUserName] = useState("John Doe");

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                if (parsed.name) {
                    setUserName(parsed.name);
                } else if (parsed.username) {
                    setUserName(parsed.username);
                }
            }
        } catch {
            // Ignore parse errors and fallback to default
        }
    }, []);

    return (
        // fixed inset-0 z-[100] ensures the User Dashboard occupies the full viewport
        // and completely isolates from the public Navbar, ChatBot, and Footer.
        <div className="fixed inset-0 z-[100] flex bg-gray-50 dark:bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <Sidebar
                userName={userName}
                memberSince="January 2024"
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Dashboard Top Header */}
                <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border px-6 py-4 shrink-0">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                            User Dashboard
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                Welcome, {userName}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content - Renders the actual dashboard sub-route pages */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

                {/* Dashboard Bottom Footer */}
                <footer className="bg-white dark:bg-card border-t border-gray-200 dark:border-border px-6 py-4 shrink-0">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-muted-foreground">
                        <span>© 2026 OceanView Resort. All rights reserved.</span>
                        <span>User Portal v1.0.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}