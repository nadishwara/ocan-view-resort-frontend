"use client";

import { ProfileTab } from "../../components/dashboard/ProfileTab";
import { MOCK_PROFILE } from "../../mock/dashboardData";

export default function ProfilePage() {
    return <ProfileTab profile={MOCK_PROFILE} userName={MOCK_PROFILE.name} />;
}
