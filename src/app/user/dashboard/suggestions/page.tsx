"use client";

import { SuggestionsTab } from "../../components/dashboard/SuggestionsTab";
import { MOCK_SUGGESTIONS } from "../../mock/dashboardData";

export default function SuggestionsPage() {
    return <SuggestionsTab suggestions={MOCK_SUGGESTIONS} />;
}
