"use client";

import { RoomsTab } from "../../components/dashboard/RoomsTab";
import { MOCK_SUGGESTIONS } from "../../mock/dashboardData";

export default function RoomsPage() {
    return <RoomsTab suggestions={MOCK_SUGGESTIONS} />;
}
