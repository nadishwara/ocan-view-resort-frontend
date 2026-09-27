"use client";

import React from "react";
import { UserProfile, Booking } from "../../types/dashboard";
import { Star, Calendar, Clock, CreditCard, BedDouble, Sparkles } from "lucide-react";

interface OverviewTabProps {
    userName: string;
    profile: UserProfile;
    upcomingBookings: Booking[];
    setActiveTab: (tab: string) => void;
}

export function OverviewTab({ userName, profile, upcomingBookings, setActiveTab }: OverviewTabProps) {
    return (
        <>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        Welcome back, {userName}! 👋
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Here’s what’s happening with your stays
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                        <Star className="h-3 w-3" /> Premium Member
                    </span>
                </div>
            </header>

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
                        <button onClick={() => setActiveTab("rooms")} className="mt-2 text-gold hover:underline">
                            Browse Rooms
                        </button>
                    </div>
                )}
            </div>

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

function StatCard({ title, value, subtext, icon }: { title: string; value: string | number; subtext: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">{title}</p>
                {icon}
            </div>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">{value}</p>
            <p className="mt-1 text-xs text-gray-600 dark:text-muted-foreground">{subtext}</p>
        </div>
    );
}

function QuickActionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex items-start gap-4 rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-4 shadow-sm hover:shadow-md hover:border-gold/50 transition text-left"
        >
            <div className="rounded-full bg-gold/10 p-2 text-gold">{icon}</div>
            <div>
                <p className="font-medium text-gray-900 dark:text-foreground">{title}</p>
                <p className="text-xs text-gray-600 dark:text-muted-foreground">{description}</p>
            </div>
        </button>
    );
}

export function BookingCard({ booking }: { booking: Booking }) {
    const statusColors = {
        confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        "checked-in": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        "checked-out": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card p-4 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 dark:text-foreground">Room {booking.roomNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                    {booking.status}
                </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">{booking.roomType}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-600 dark:text-muted-foreground">
                <span>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</span>
                <span>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-foreground">
                    LKR {booking.amount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-600 dark:text-muted-foreground">{booking.nights} nights</span>
            </div>
        </div>
    );
}