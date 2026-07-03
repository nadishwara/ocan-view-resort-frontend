"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    BedDouble,
    Users,
    LogOut,
    User,
    Calendar,
    Clock,
    Star,
    MapPin,
    Wifi,
    Coffee,
    ParkingCircle,
    Utensils,
    Dumbbell,
    Sparkles,
    CreditCard,
    Home,
    Eye,
    Heart,
    Bell,
    Settings,
    HelpCircle,
} from "lucide-react";

// Types
type BookingStatus = "confirmed" | "checked-in" | "checked-out" | "cancelled";

interface Booking {
    id: string;
    roomNumber: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    status: BookingStatus;
    amount: number;
    nights: number;
}

interface UserProfile {
    name: string;
    email: string;
    phone: string;
    memberSince: string;
    totalBookings: number;
    totalSpent: number;
}

interface RoomSuggestion {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    amenities: string[];
    rating: number;
    available: boolean;
}

// Mock Data
const MOCK_BOOKINGS: Booking[] = [
    {
        id: "1",
        roomNumber: "304",
        roomType: "Deluxe Ocean View",
        checkIn: "2024-12-20",
        checkOut: "2024-12-25",
        status: "confirmed",
        amount: 45000,
        nights: 5,
    },
    {
        id: "2",
        roomNumber: "201",
        roomType: "Premium Suite",
        checkIn: "2025-01-15",
        checkOut: "2025-01-18",
        status: "confirmed",
        amount: 75000,
        nights: 3,
    },
    {
        id: "3",
        roomNumber: "105",
        roomType: "Standard Room",
        checkIn: "2024-11-10",
        checkOut: "2024-11-12",
        status: "checked-out",
        amount: 28000,
        nights: 2,
    },
    {
        id: "4",
        roomNumber: "401",
        roomType: "Ocean Suite",
        checkIn: "2024-12-22",
        checkOut: "2024-12-24",
        status: "checked-in",
        amount: 65000,
        nights: 2,
    },
];

const MOCK_SUGGESTIONS: RoomSuggestion[] = [
    {
        id: "1",
        name: "Ocean View Suite",
        type: "Deluxe",
        price: 55000,
        image: "",
        amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant"],
        rating: 4.8,
        available: true,
    },
    {
        id: "2",
        name: "Garden Villa",
        type: "Premium",
        price: 42000,
        image: "",
        amenities: ["Wi-Fi", "Parking", "Gym", "Coffee"],
        rating: 4.6,
        available: true,
    },
    {
        id: "3",
        name: "Beach Front Room",
        type: "Standard",
        price: 32000,
        image: "",
        amenities: ["Wi-Fi", "Restaurant", "Pool"],
        rating: 4.4,
        available: false,
    },
];

const MOCK_PROFILE: UserProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    memberSince: "January 2024",
    totalBookings: 12,
    totalSpent: 580000,
};

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [userName] = useState("John Doe");
    const [bookings] = useState<Booking[]>(MOCK_BOOKINGS);
    const [profile] = useState<UserProfile>(MOCK_PROFILE);
    const [suggestions] = useState<RoomSuggestion[]>(MOCK_SUGGESTIONS);

    // Fixed: Include both "confirmed" and "checked-in" as upcoming
    const upcomingBookings = bookings.filter(
        (b) => b.status === "confirmed" || b.status === "checked-in"
    );
    const pastBookings = bookings.filter((b) => b.status === "checked-out" || b.status === "cancelled");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 dark:border-border bg-white dark:bg-card p-5 flex flex-col justify-between shrink-0">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 font-display text-xl font-bold text-primary">
                        <Home className="text-gold" /> OceanView
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                activeTab === "overview"
                                    ? "bg-gold/10 text-gold"
                                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                            }`}
                        >
                            <LayoutDashboard className="h-4 w-4" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("bookings")}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                activeTab === "bookings"
                                    ? "bg-gold/10 text-gold"
                                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                            }`}
                        >
                            <Calendar className="h-4 w-4" /> My Bookings
                        </button>
                        <button
                            onClick={() => setActiveTab("rooms")}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                activeTab === "rooms"
                                    ? "bg-gold/10 text-gold"
                                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                            }`}
                        >
                            <BedDouble className="h-4 w-4" /> Rooms
                        </button>
                        <button
                            onClick={() => setActiveTab("suggestions")}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                activeTab === "suggestions"
                                    ? "bg-gold/10 text-gold"
                                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                            }`}
                        >
                            <Sparkles className="h-4 w-4" /> Suggestions
                        </button>
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                activeTab === "profile"
                                    ? "bg-gold/10 text-gold"
                                    : "text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground"
                            }`}
                        >
                            <User className="h-4 w-4" /> Profile
                        </button>
                    </nav>

                    <div className="border-t border-gray-200 dark:border-border pt-4">
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <Bell className="h-4 w-4" /> Notifications
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <Settings className="h-4 w-4" /> Settings
                        </button>
                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary hover:text-gray-900 dark:hover:text-foreground transition">
                            <HelpCircle className="h-4 w-4" /> Help
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600 dark:text-muted-foreground border-t border-gray-200 dark:border-border pt-4">
                        <p className="font-medium text-gray-900 dark:text-foreground">{userName}</p>
                        <p className="text-xs">Member since {profile.memberSince}</p>
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
                {activeTab === "overview" && (
                    <OverviewTab
                        userName={userName}
                        profile={profile}
                        upcomingBookings={upcomingBookings}
                        setActiveTab={setActiveTab}
                    />
                )}

                {activeTab === "bookings" && (
                    <BookingsTab
                        upcomingBookings={upcomingBookings}
                        pastBookings={pastBookings}
                        allBookings={bookings}
                    />
                )}

                {activeTab === "rooms" && (
                    <RoomsTab suggestions={suggestions} />
                )}

                {activeTab === "suggestions" && (
                    <SuggestionsTab suggestions={suggestions} />
                )}

                {activeTab === "profile" && (
                    <ProfileTab profile={profile} userName={userName} />
                )}
            </main>
        </div>
    );
}

// Overview Tab
function OverviewTab({
    userName,
    profile,
    upcomingBookings,
    setActiveTab,
}: {
    userName: string;
    profile: UserProfile;
    upcomingBookings: Booking[];
    setActiveTab: (tab: string) => void;
}) {
    return (
        <>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Here's what's happening with your stays
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                        <Star className="h-3 w-3" /> Premium Member
                    </span>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Bookings"
                    value={profile.totalBookings}
                    subtext="All time"
                    icon={<Calendar className="h-5 w-5 text-gold" />}
                />
                <StatCard
                    title="Upcoming Stays"
                    value={upcomingBookings.length}
                    subtext={`${upcomingBookings.length} bookings upcoming`}
                    icon={<Clock className="h-5 w-5 text-gold" />}
                />
                <StatCard
                    title="Total Spent"
                    value={`LKR ${profile.totalSpent.toLocaleString()}`}
                    subtext="Lifetime value"
                    icon={<CreditCard className="h-5 w-5 text-gold" />}
                />
                <StatCard
                    title="Loyalty Points"
                    value="2,450"
                    subtext="+250 from last stay"
                    icon={<Star className="h-5 w-5 text-gold" />}
                />
            </div>

            {/* Upcoming Bookings */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                    Upcoming Stays
                </h2>
                {upcomingBookings.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {upcomingBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-muted-foreground border border-dashed border-gray-300 dark:border-border rounded-xl">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 dark:text-muted-foreground/50" />
                        <p className="mt-2">No upcoming bookings</p>
                        <button
                            onClick={() => setActiveTab("rooms")}
                            className="mt-2 text-gold hover:underline"
                        >
                            Browse Rooms
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickActionCard
                    icon={<BedDouble className="h-6 w-6" />}
                    title="Book a Room"
                    description="Find your perfect stay"
                    onClick={() => setActiveTab("rooms")}
                />
                <QuickActionCard
                    icon={<Calendar className="h-6 w-6" />}
                    title="View Bookings"
                    description="Manage your reservations"
                    onClick={() => setActiveTab("bookings")}
                />
                <QuickActionCard
                    icon={<Sparkles className="h-6 w-6" />}
                    title="Get Suggestions"
                    description="Personalized recommendations"
                    onClick={() => setActiveTab("suggestions")}
                />
            </div>
        </>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    subtext,
    icon,
}: {
    title: string;
    value: string | number;
    subtext: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">
                    {title}
                </p>
                {icon}
            </div>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                {value}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-muted-foreground">{subtext}</p>
        </div>
    );
}

// Quick Action Card
function QuickActionCard({
    icon,
    title,
    description,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-4 shadow-sm hover:shadow-md hover:border-gold/50 transition text-left"
        >
            <div className="rounded-full bg-gold/10 p-2 text-gold">{icon}</div>
            <div>
                <p className="font-medium text-gray-900 dark:text-foreground">{title}</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground">
                    {description}
                </p>
            </div>
        </button>
    );
}

// Booking Card
function BookingCard({ booking }: { booking: Booking }) {
    const statusColors: Record<BookingStatus, string> = {
        confirmed:
            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "checked-in":
            "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "checked-out":
            "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        cancelled:
            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-foreground">
                    Room {booking.roomNumber}
                </span>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[booking.status]
                    }`}
                >
                    {booking.status}
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                {booking.roomType}
            </p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-muted-foreground">
                <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    LKR {booking.amount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 dark:text-muted-foreground">
                    {booking.nights} nights
                </span>
            </div>
        </div>
    );
}

// Bookings Tab
function BookingsTab({
    upcomingBookings,
    pastBookings,
    allBookings,
}: {
    upcomingBookings: Booking[];
    pastBookings: Booking[];
    allBookings: Booking[];
}) {
    const [showAll, setShowAll] = useState(false);
    const bookings = showAll ? allBookings : upcomingBookings;

    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        My Bookings
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Manage your reservations
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAll(false)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            !showAll
                                ? "bg-gold text-white"
                                : "bg-gray-200 dark:bg-secondary text-gray-600 dark:text-muted-foreground"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setShowAll(true)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            showAll
                                ? "bg-gold text-white"
                                : "bg-gray-200 dark:bg-secondary text-gray-600 dark:text-muted-foreground"
                        }`}
                    >
                        All
                    </button>
                </div>
            </header>

            {bookings.length > 0 ? (
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {bookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 text-center py-12 text-gray-600 dark:text-muted-foreground border border-dashed border-gray-300 dark:border-border rounded-xl">
                    <Calendar className="h-16 w-16 mx-auto text-gray-400 dark:text-muted-foreground/30" />
                    <p className="mt-3 text-lg font-medium text-gray-900 dark:text-foreground">
                        No bookings found
                    </p>
                    <p className="text-sm">Start planning your stay with us!</p>
                    <button className="mt-4 px-6 py-2 bg-gold text-white rounded-full hover:bg-gold/90 transition">
                        Browse Rooms
                    </button>
                </div>
            )}

            {pastBookings.length > 0 && !showAll && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
                        Past Stays
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {pastBookings.slice(0, 2).map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Rooms Tab
function RoomsTab({ suggestions }: { suggestions: RoomSuggestion[] }) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        Our Rooms
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Find the perfect room for your stay
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                        <Eye className="h-3 w-3" /> View All
                    </span>
                </div>
            </header>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}

// Room Card
function RoomCard({ room }: { room: RoomSuggestion }) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-48 bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center">
                <BedDouble className="h-16 w-16 text-gold/50" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-foreground">
                        {room.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gold">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{room.rating}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    {room.type}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-secondary rounded-full text-xs text-gray-600 dark:text-muted-foreground"
                        >
                            {amenity}
                        </span>
                    ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                        LKR {room.price.toLocaleString()}
                    </span>
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm transition ${
                            room.available
                                ? "bg-gold text-white hover:bg-gold/90"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!room.available}
                    >
                        {room.available ? "Book Now" : "Unavailable"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Suggestions Tab
function SuggestionsTab({ suggestions }: { suggestions: RoomSuggestion[] }) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        ✨ Personalized Suggestions
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Based on your preferences and past stays
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                        <Heart className="h-3 w-3" /> Your Favorites
                    </span>
                </div>
            </header>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((room) => (
                    <SuggestionCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}

// Suggestion Card
function SuggestionCard({ room }: { room: RoomSuggestion }) {
    const getAmenityIcon = (amenity: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            "Wi-Fi": <Wifi className="h-2 w-2" />,
            Pool: <Users className="h-2 w-2" />,
            Spa: <Sparkles className="h-2 w-2" />,
            Restaurant: <Utensils className="h-2 w-2" />,
            Gym: <Dumbbell className="h-2 w-2" />,
            Parking: <ParkingCircle className="h-2 w-2" />,
            Coffee: <Coffee className="h-2 w-2" />,
        };
        return iconMap[amenity] || null;
    };

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm hover:shadow-lg transition group">
            <div className="relative h-48 bg-gradient-to-br from-gold/30 to-primary/30 flex items-center justify-center">
                <BedDouble className="h-16 w-16 text-gold/60" />
                {room.available && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium">
                        Available
                    </span>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-foreground">
                        {room.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gold">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{room.rating}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    {room.type}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 4).map((amenity, index) => {
                        const icon = getAmenityIcon(amenity);
                        return (
                            <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 dark:bg-secondary rounded-full text-xs text-gray-600 dark:text-muted-foreground flex items-center gap-1"
                            >
                                {icon}
                                {!icon && amenity}
                            </span>
                        );
                    })}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                            LKR {room.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-muted-foreground ml-1">
                            /night
                        </span>
                    </div>
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm transition ${
                            room.available
                                ? "bg-gold text-white hover:bg-gold/90 group-hover:scale-105"
                                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        }`}
                        disabled={!room.available}
                    >
                        {room.available ? "Book Now" : "Unavailable"}
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Near beach • 5 min walk</span>
                </div>
            </div>
        </div>
    );
}

// Profile Tab
function ProfileTab({
    profile,
    userName,
}: {
    profile: UserProfile;
    userName: string;
}) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Manage your account details
                    </p>
                </div>
                <button className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                    <User className="h-3 w-3" /> Edit Profile
                </button>
            </header>

            <div className="mt-8 max-w-2xl">
                <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-full bg-gold/20 flex items-center justify-center text-3xl font-bold text-gold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">
                                {userName}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                {profile.email}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs font-medium">
                                    Member
                                </span>
                                <span className="text-xs text-gray-600 dark:text-muted-foreground">
                                    Joined {profile.memberSince}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                Phone
                            </p>
                            <p className="font-medium text-gray-900 dark:text-foreground">
                                {profile.phone}
                            </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                Total Bookings
                            </p>
                            <p className="font-medium text-gray-900 dark:text-foreground">
                                {profile.totalBookings}
                            </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                Total Spent
                            </p>
                            <p className="font-medium text-gray-900 dark:text-foreground">
                                LKR {profile.totalSpent.toLocaleString()}
                            </p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">
                                Member Since
                            </p>
                            <p className="font-medium text-gray-900 dark:text-foreground">
                                {profile.memberSince}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}