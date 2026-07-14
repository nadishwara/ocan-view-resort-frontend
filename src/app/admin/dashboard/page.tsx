"use client";

import DashboardMetricCard from "../components/ui/dashboard-overview";
import { AlertCircle, BedDouble, Calendar, Clock, DollarSign, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">
                    Dashboard Overview
                </h2>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    Real-time analytics and metrics for your hotel
                </p>
            </div>

            {/* First Row - Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard
                    title="Total Users"
                    value="2,350"
                    icon={Users}
                    trendChange="+180"
                    trendType="up"
                />
                <DashboardMetricCard
                    title="Revenue"
                    value="$12,450"
                    icon={DollarSign}
                    trendChange="-2.5%"
                    trendType="down"
                />
                <DashboardMetricCard
                    title="Avg. Session"
                    value="4m 32s"
                    icon={Clock}
                    trendChange="+0.5s"
                    trendType="up"
                />
                <DashboardMetricCard
                    title="Open Tickets"
                    value="12"
                    icon={AlertCircle}
                    trendChange="+3"
                    trendType="up"
                />
            </div>

            {/* Second Row - Hotel Specific Metrics */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <DashboardMetricCard
                    title="Total Bookings"
                    value="142"
                    icon={Calendar}
                    trendChange="+12%"
                    trendType="up"
                />
                <DashboardMetricCard
                    title="Available Rooms"
                    value="24/45"
                    icon={BedDouble}
                    trendChange="73%"
                    trendType="up"
                />
                <DashboardMetricCard
                    title="Today's Revenue"
                    value="LKR 540,000"
                    icon={DollarSign}
                    trendChange="+8%"
                    trendType="up"
                />
                <DashboardMetricCard
                    title="Occupancy Rate"
                    value="73%"
                    icon={TrendingUp}
                    trendChange="-3%"
                    trendType="down"
                />
            </div>
        </div>
    );
}