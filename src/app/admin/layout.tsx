"use client";

import { useState } from "react";
import Sidebar from "./components/ui/Sidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background">
            {/* Sidebar */}
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Navbar */}
                <header className="bg-white dark:bg-card border-b border-gray-200 dark:border-border px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                            Admin Dashboard
                        </h1>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                Welcome, Admin
                            </span>
                        </div>
                    </div>
                </header>

                {/* Page Content - This will render the actual page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-card border-t border-gray-200 dark:border-border px-6 py-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-muted-foreground">
                        <span>© 2024 OceanView Hotel. All rights reserved.</span>
                        <span>Version 1.0.0</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}