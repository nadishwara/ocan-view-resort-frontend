"use client";

import { useRouter } from "next/navigation";
import { OverviewTab } from "../components/dashboard/OverviewTab";
import { MOCK_BOOKINGS, MOCK_PROFILE } from "../mock/dashboardData";

export default function UserDashboardOverviewPage() {
    const router = useRouter();

    const upcomingBookings = MOCK_BOOKINGS.filter(
        (b) => b.status === "confirmed" || b.status === "checked-in"
    );

    const handleTabNavigation = (tab: string) => {
        if (tab === "overview") {
            router.push("/user/dashboard");
        } else {
            router.push(`/user/dashboard/${tab}`);
        }
    };

    return (
        <OverviewTab
            userName={MOCK_PROFILE.name}
            profile={MOCK_PROFILE}
            upcomingBookings={upcomingBookings}
            setActiveTab={handleTabNavigation}
        />
    );
}