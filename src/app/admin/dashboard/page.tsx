"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    BedDouble,
    Users,
    LogOut,
    ShieldAlert,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    UserPlus,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    MoreVertical,
    Search,
    Filter,
    Download,
    RefreshCw,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Bell,
    Settings,
    HelpCircle,
    Star,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";

// Mock Data
const MOCK_STATS = {
    totalBookings: 142,
    availableRooms: 24,
    totalRooms: 45,
    todayRevenue: 540000,
    occupancyRate: 73,
    bookingsTrend: 12,
    revenueTrend: 8,
    occupancyTrend: -3,
};

const MOCK_RECENT_BOOKINGS = [
    {
        id: 1,
        guest: "Michael Silva",
        room: "304",
        checkIn: "2024-12-20",
        checkOut: "2024-12-25",
        status: "confirmed",
        amount: 45000,
        phone: "+94 77 123 4567",
        email: "michael@example.com",
    },
    {
        id: 2,
        guest: "Sarah Johnson",
        room: "201",
        checkIn: "2024-12-21",
        checkOut: "2024-12-23",
        status: "checked-in",
        amount: 32000,
        phone: "+94 71 234 5678",
        email: "sarah@example.com",
    },
    {
        id: 3,
        guest: "David Perera",
        room: "105",
        checkIn: "2024-12-19",
        checkOut: "2024-12-20",
        status: "checked-out",
        amount: 28000,
        phone: "+94 76 345 6789",
        email: "david@example.com",
    },
    {
        id: 4,
        guest: "Emma Wilson",
        room: "402",
        checkIn: "2024-12-22",
        checkOut: "2024-12-26",
        status: "pending",
        amount: 55000,
        phone: "+94 72 456 7890",
        email: "emma@example.com",
    },
];

const MOCK_ROOMS = [
    { id: 1, number: "101", type: "Standard", status: "occupied", price: 25000 },
    { id: 2, number: "102", type: "Standard", status: "available", price: 25000 },
    { id: 3, number: "201", type: "Deluxe", status: "occupied", price: 45000 },
    { id: 4, number: "202", type: "Deluxe", status: "cleaning", price: 45000 },
    { id: 5, number: "301", type: "Suite", status: "available", price: 75000 },
];

const MOCK_ALERTS = [
    { id: 1, type: "warning", message: "Room 105 check-out delayed", time: "10 min ago" },
    { id: 2, type: "info", message: "New booking for Room 402", time: "25 min ago" },
    { id: 3, type: "success", message: "Payment received from Room 304", time: "1 hour ago" },
];

export default function AdminDashboard() {
    const [adminName] = useState("Admin");
    const [activeTab] = useState("overview");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    // Pagination
    const totalPages = Math.ceil(MOCK_RECENT_BOOKINGS.length / itemsPerPage);
    const currentBookings = MOCK_RECENT_BOOKINGS.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 dark:border-border bg-white dark:bg-card p-5 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                        <ShieldAlert className="text-gold" /> OceanView Admin
                    </div>

                    <nav className="space-y-1">
                        <a
                            href="/admin/dashboard"
                            className="flex items-center gap-3 rounded-lg bg-gold/10 px-3 py-2.5 text-sm font-medium text-gold transition"
                        >
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </a>
                        <a
                            href="/admin/rooms"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition"
                        >
                            <BedDouble className="h-4 w-4" /> Manage Rooms
                        </a>
                        <a
                            href="/admin/bookings"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition"
                        >
                            <Calendar className="h-4 w-4" /> Bookings
                        </a>
                        <a
                            href="/admin/guests"
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition"
                        >
                            <Users className="h-4 w-4" /> Hotel Guests
                        </a>
                    </nav>

                    <div className="border-t border-gray-200 dark:border-border pt-4">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <Bell className="h-4 w-4" /> Notifications
                            <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                3
                            </span>
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <Settings className="h-4 w-4" /> Settings
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <HelpCircle className="h-4 w-4" /> Help & Support
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-muted-foreground border-t border-gray-200 dark:border-border pt-4">
                        <p className="font-medium text-gray-900 dark:text-foreground">{adminName}</p>
                        <p className="text-xs">Super Administrator</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                    >
                        <LogOut className="h-4 w-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                    <div>
                        <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-muted-foreground">
                            Welcome back, {adminName}. Here's what's happening with your hotel today.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg bg-gray-100 dark:bg-secondary hover:bg-gray-200 dark:hover:bg-secondary/80 transition">
                            <RefreshCw className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-100 dark:bg-secondary hover:bg-gray-200 dark:hover:bg-secondary/80 transition">
                            <Download className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                        </button>
                        <div className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                            <ShieldAlert className="h-3 w-3" /> Super Admin
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Bookings"
                        value={MOCK_STATS.totalBookings}
                        subtext={`${MOCK_STATS.bookingsTrend}% from last week`}
                        trend={MOCK_STATS.bookingsTrend}
                        icon={<Calendar className="h-5 w-5 text-gold" />}
                        color="blue"
                    />
                    <StatCard
                        title="Available Rooms"
                        value={`${MOCK_STATS.availableRooms} / ${MOCK_STATS.totalRooms}`}
                        subtext={`${MOCK_STATS.occupancyRate}% Occupancy Rate`}
                        trend={MOCK_STATS.occupancyTrend}
                        icon={<BedDouble className="h-5 w-5 text-gold" />}
                        color="green"
                    />
                    <StatCard
                        title="Today's Revenue"
                        value={`LKR ${MOCK_STATS.todayRevenue.toLocaleString()}`}
                        subtext={`${MOCK_STATS.revenueTrend}% from yesterday`}
                        trend={MOCK_STATS.revenueTrend}
                        icon={<DollarSign className="h-5 w-5 text-gold" />}
                        color="gold"
                    />
                    <StatCard
                        title="Total Guests"
                        value="89"
                        subtext="12% from last week"
                        trend={12}
                        icon={<Users className="h-5 w-5 text-gold" />}
                        color="purple"
                    />
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <QuickActionCard
                        icon={<UserPlus className="h-5 w-5" />}
                        title="Check-in Guest"
                        description="Quick check-in process"
                        color="green"
                    />
                    <QuickActionCard
                        icon={<CheckCircle className="h-5 w-5" />}
                        title="Check-out Guest"
                        description="Complete check-out"
                        color="blue"
                    />
                    <QuickActionCard
                        icon={<BedDouble className="h-5 w-5" />}
                        title="Add Room"
                        description="Add new room listing"
                        color="gold"
                    />
                    <QuickActionCard
                        icon={<AlertCircle className="h-5 w-5" />}
                        title="Report Issue"
                        description="Report maintenance"
                        color="red"
                    />
                </div>

                {/* Recent Bookings & Alerts */}
                <div className="mt-8 grid gap-6 lg:grid-cols-3">
                    {/* Recent Bookings Table */}
                    <div className="lg:col-span-2 rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                                Recent Bookings
                            </h2>
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition">
                                    <Search className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                </button>
                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition">
                                    <Filter className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                </button>
                                <a
                                    href="/admin/bookings"
                                    className="text-sm text-gold hover:underline"
                                >
                                    View All
                                </a>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-border">
                                        <th className="text-left py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Guest
                                        </th>
                                        <th className="text-left py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Room
                                        </th>
                                        <th className="text-left py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Check-in
                                        </th>
                                        <th className="text-left py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Status
                                        </th>
                                        <th className="text-right py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Amount
                                        </th>
                                        <th className="text-center py-3 px-3 font-medium text-gray-600 dark:text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBookings.map((booking) => (
                                        <tr
                                            key={booking.id}
                                            className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/50 transition"
                                        >
                                            <td className="py-3 px-3">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-foreground">
                                                        {booking.guest}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-muted-foreground">
                                                        {booking.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-gray-900 dark:text-foreground">
                                                Room {booking.room}
                                            </td>
                                            <td className="py-3 px-3 text-gray-600 dark:text-muted-foreground">
                                                {new Date(booking.checkIn).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-3">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        booking.status === "confirmed"
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                            : booking.status === "checked-in"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : booking.status === "checked-out"
                                                            ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                    }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right font-medium text-gray-900 dark:text-foreground">
                                                LKR {booking.amount.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-secondary transition">
                                                        <Eye className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                                    </button>
                                                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-secondary transition">
                                                        <Edit className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                                    </button>
                                                    <button className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                                                        <Trash2 className="h-4 w-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                                {Math.min(currentPage * itemsPerPage, MOCK_RECENT_BOOKINGS.length)} of{" "}
                                {MOCK_RECENT_BOOKINGS.length} entries
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                                            currentPage === page
                                                ? "bg-gold text-white"
                                                : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <ChevronRight className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Alerts & Quick Stats */}
                    <div className="space-y-6">
                        {/* Alerts */}
                        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                                    Alerts
                                </h2>
                                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {MOCK_ALERTS.length} New
                                </span>
                            </div>
                            <div className="space-y-3">
                                {MOCK_ALERTS.map((alert) => (
                                    <div
                                        key={alert.id}
                                        className={`flex items-start gap-3 p-3 rounded-xl ${
                                            alert.type === "warning"
                                                ? "bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800"
                                                : alert.type === "info"
                                                ? "bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800"
                                                : "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                                        }`}
                                    >
                                        {alert.type === "warning" && (
                                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                        )}
                                        {alert.type === "info" && (
                                            <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                                        )}
                                        {alert.type === "success" && (
                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900 dark:text-foreground">
                                                {alert.message}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-muted-foreground mt-0.5">
                                                {alert.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Room Status */}
                        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                                Room Status
                            </h2>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                        Occupied
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "45%" }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                            45%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                        Available
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: "35%" }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                            35%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                        Cleaning
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: "15%" }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                            15%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-muted-foreground">
                                        Maintenance
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-gray-200 dark:bg-secondary rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: "5%" }} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                                            5%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8 rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground">
                            Recent Activity
                        </h2>
                        <button className="text-sm text-gold hover:underline">
                            View All Activity
                        </button>
                    </div>
                    <div className="space-y-4">
                        <ActivityItem
                            icon={<UserPlus className="h-4 w-4" />}
                            title="New guest checked in"
                            description="Michael Silva checked in to Room 304"
                            time="5 min ago"
                            color="blue"
                        />
                        <ActivityItem
                            icon={<CheckCircle className="h-4 w-4" />}
                            title="Payment received"
                            description="LKR 45,000 received from Room 304"
                            time="15 min ago"
                            color="green"
                        />
                        <ActivityItem
                            icon={<BedDouble className="h-4 w-4" />}
                            title="Room status updated"
                            description="Room 202 is now available"
                            time="1 hour ago"
                            color="gold"
                        />
                        <ActivityItem
                            icon={<AlertCircle className="h-4 w-4" />}
                            title="Maintenance request"
                            description="AC repair needed in Room 105"
                            time="2 hours ago"
                            color="red"
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    subtext,
    trend,
    icon,
    color,
}: {
    title: string;
    value: string | number;
    subtext: string;
    trend: number;
    icon: React.ReactNode;
    color: "blue" | "green" | "gold" | "purple";
}) {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
        green: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800",
        gold: "bg-gold/10 border-gold/20",
        purple: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
    };

    return (
        <div
            className={`rounded-2xl border ${colorClasses[color]} p-6 shadow-sm hover:shadow-md transition`}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">
                    {title}
                </p>
                {icon}
            </div>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                {value}
            </p>
            <div className="mt-1 flex items-center gap-2">
                {trend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                ) : trend < 0 ? (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                ) : null}
                <p
                    className={`text-xs ${
                        trend > 0
                            ? "text-green-500"
                            : trend < 0
                            ? "text-red-500"
                            : "text-gray-600 dark:text-muted-foreground"
                    }`}
                >
                    {subtext}
                </p>
            </div>
        </div>
    );
}

// Quick Action Card
function QuickActionCard({
    icon,
    title,
    description,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: "green" | "blue" | "gold" | "red";
}) {
    const colorClasses = {
        green: "hover:border-green-500/50 hover:bg-green-50 dark:hover:bg-green-950/20",
        blue: "hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-950/20",
        gold: "hover:border-gold/50 hover:bg-gold/10",
        red: "hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-950/20",
    };

    return (
        <button
            className={`flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-4 shadow-sm ${colorClasses[color]} transition`}
        >
            <div
                className={`rounded-full p-2 ${
                    color === "green"
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        : color === "blue"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : color === "gold"
                        ? "bg-gold/20 text-gold"
                        : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                }`}
            >
                {icon}
            </div>
            <div className="text-left">
                <p className="font-medium text-gray-900 dark:text-foreground">{title}</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground">
                    {description}
                </p>
            </div>
        </button>
    );
}

// Activity Item
function ActivityItem({
    icon,
    title,
    description,
    time,
    color,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
    color: "blue" | "green" | "gold" | "red";
}) {
    const colorClasses = {
        blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
        green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
        gold: "bg-gold/20 text-gold",
        red: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
        <div className="flex items-start gap-3">
            <div className={`rounded-full p-2 ${colorClasses[color]}`}>{icon}</div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                    {title}
                </p>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    {description}
                </p>
                <p className="text-xs text-gray-500 dark:text-muted-foreground mt-0.5">{time}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-foreground transition">
                <MoreVertical className="h-4 w-4" />
            </button>
        </div>
    );
}