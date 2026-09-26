"use client";

import { useState } from "react";
import { Booking } from "../../types/dashboard";
import { BookingCard } from "./OverviewTab";
import { Calendar } from "lucide-react";

interface BookingsTabProps {
    upcomingBookings: Booking[];
    pastBookings: Booking[];
    allBookings: Booking[];
}

export function BookingsTab({ upcomingBookings, pastBookings, allBookings }: BookingsTabProps) {
    const [showAll, setShowAll] = useState(false);
    const bookings = showAll ? allBookings : upcomingBookings;

    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        My Bookings
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Manage your reservations</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAll(false)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${!showAll ? "bg-gold text-white" : "bg-gray-200 dark:bg-secondary text-gray-600 dark:text-muted-foreground"
                            }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setShowAll(true)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition ${showAll ? "bg-gold text-white" : "bg-gray-200 dark:bg-secondary text-gray-600 dark:text-muted-foreground"
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
                    <p className="mt-3 text-lg font-medium text-gray-900 dark:text-foreground">No bookings found</p>
                    <p className="text-sm">Start planning your stay with us!</p>
                    <button className="mt-4 px-6 py-2 bg-gold text-white rounded-full hover:bg-gold/90 transition">
                        Browse Rooms
                    </button>
                </div>
            )}

            {pastBookings.length > 0 && !showAll && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">Past Stays</h2>
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