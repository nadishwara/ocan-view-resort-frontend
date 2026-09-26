"use client";

import { BookingsTab } from "../../components/dashboard/BookingsTab";
import { MOCK_BOOKINGS } from "../../mock/dashboardData";

export default function BookingsPage() {
    const upcomingBookings = MOCK_BOOKINGS.filter(
        (b) => b.status === "confirmed" || b.status === "checked-in"
    );
    const pastBookings = MOCK_BOOKINGS.filter(
        (b) => b.status === "checked-out" || b.status === "cancelled"
    );

    return (
        <BookingsTab
            upcomingBookings={upcomingBookings}
            pastBookings={pastBookings}
            allBookings={MOCK_BOOKINGS}
        />
    );
}
