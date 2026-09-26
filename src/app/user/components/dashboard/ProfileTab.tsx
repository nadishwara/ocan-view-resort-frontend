"use client";

import React from "react";
import { UserProfile } from "../../types/dashboard";
import { User } from "lucide-react";

interface ProfileTabProps {
    profile: UserProfile;
    userName: string;
}

export function ProfileTab({ profile, userName }: ProfileTabProps) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        My Profile
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Manage your account details</p>
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
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground">{userName}</h2>
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">{profile.email}</p>
                            <div className="mt-1 flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-gold/10 text-gold rounded-full text-xs font-medium">Member</span>
                                <span className="text-xs text-gray-600 dark:text-muted-foreground">Joined {profile.memberSince}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Phone</p>
                            <p className="font-medium text-gray-900 dark:text-foreground">{profile.phone}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Total Bookings</p>
                            <p className="font-medium text-gray-900 dark:text-foreground">{profile.totalBookings}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Total Spent</p>
                            <p className="font-medium text-gray-900 dark:text-foreground">LKR {profile.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 dark:bg-secondary/50 p-4">
                            <p className="text-sm text-gray-600 dark:text-muted-foreground">Member Since</p>
                            <p className="font-medium text-gray-900 dark:text-foreground">{profile.memberSince}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}