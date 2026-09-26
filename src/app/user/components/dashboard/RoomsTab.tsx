"use client";

import React from "react";
import { RoomSuggestion } from "../../types/dashboard";
import { Eye, BedDouble, Star } from "lucide-react";

interface RoomsTabProps {
    suggestions: RoomSuggestion[];
}

export function RoomsTab({ suggestions }: RoomsTabProps) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        Our Rooms
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Find the perfect room for your stay</p>
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

export function RoomCard({ room }: { room: RoomSuggestion }) {
    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-48 bg-gradient-to-br from-gold/20 to-primary/20 flex items-center justify-center">
                <BedDouble className="h-16 w-16 text-gold/50" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-foreground">{room.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gold">
                        <Star className="h-3 w-3 fill-current" />
                        <span>{room.rating}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">{room.type}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-secondary rounded-full text-xs text-gray-600 dark:text-muted-foreground">
                            {amenity}
                        </span>
                    ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                        LKR {room.price.toLocaleString()}
                    </span>
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm transition ${room.available ? "bg-gold text-white hover:bg-gold/90" : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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