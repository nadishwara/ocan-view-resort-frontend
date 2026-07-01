"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BedDouble,
    Users,
    LogOut,
    ShieldAlert,
} from "lucide-react";

export default function AdminDashboard() {
    const router = useRouter();
    const [adminName, setAdminName] = useState<string>("Admin");

    // ආරක්ෂක පියවර: පිටුවට පිවිසෙද්දීම Admin කෙනෙක්ද කියා පරීක්ෂා කිරීම
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login"); // Token එක නැත්නම් Login එකට හරවා යැවීම
        }
        // මෙතනදී ඔයාට පුළුවන් jwt-decode පාවිච්චි කරලා ඇත්තටම ROLE_ADMIN ද කියා බලන්නත්
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/");
    };

    return (
        <div className="flex h-screen bg-secondary/20 dark:bg-background text-foreground">
            {/* 1. Sidebar Component */}
            <aside className="w-64 border-r border-border bg-card p-5 flex flex-col justify-between">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                        <ShieldAlert className="text-gold" /> OceanView Admin
                    </div>

                    <nav className="space-y-1">
                        <a
                            href="/admin/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary transition"
                        >
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </a>
                        <a
                            href="/admin/rooms"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                        >
                            <BedDouble className="h-4 w-4" /> Manage Rooms
                        </a>
                        <a
                            href="#"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition"
                        >
                            <Users className="h-4 w-4" /> Hotel Guests
                        </a>
                    </nav>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                >
                    <LogOut className="h-4 w-4" /> Logout
                </button>
            </aside>

            {/* 2. Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex items-center justify-between border-b border-border pb-5">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome back, management portal is active.
                        </p>
                    </div>
                    <div className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30">
                        Role: Super Admin
                    </div>
                </header>

                {/* 3. Analytics Quick Cards */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card
                        title="Total Bookings"
                        value="142"
                        subtext="+12% from last week"
                    />
                    <Card
                        title="Available Rooms"
                        value="24 / 45"
                        subtext="8 Rooms cleaning status"
                    />
                    <Card
                        title="Today's Revenue"
                        value="LKR 540,000"
                        subtext="Based on local hotel rates"
                    />
                </div>

                {/* 4. Recent Activity Placeholder */}
                <div className="mt-8 rounded-2xl border border-border bg-card p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Recent Bookings / System Alerts
                    </h2>
                    <div className="text-sm text-muted-foreground py-8 text-center border border-dashed border-border rounded-xl">
                        Spring Boot API එකට සම්පුර්ණයෙන්ම සම්බන්ධ කර සජීවී Tables පෙන්වන
                        කොටස (We will add the fetch table here next).
                    </div>
                </div>
            </main>
        </div>
    );
}

// කුඩා Card Component එකක් එක පිටුව ඇතුළතම පාවිච්චියට
function Card({
    title,
    value,
    subtext,
}: {
    title: string;
    value: string;
    subtext: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
        </div>
    );
}
