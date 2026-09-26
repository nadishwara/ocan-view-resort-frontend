"use client";

import React from "react";
import { RoomSuggestion } from "../../types/dashboard";
import { Heart, BedDouble, Star, Wifi, Users, Sparkles, Utensils, Dumbbell, ParkingCircle, Coffee, MapPin } from "lucide-react";

interface SuggestionsTabProps {
    suggestions: RoomSuggestion[];
}

export function SuggestionsTab({ suggestions }: SuggestionsTabProps) {
    return (
        <div>
            <header className="flex items-center justify-between border-b border-gray-200 dark:border-border pb-5">
                <div>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
                        ✨ Personalized Suggestions
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Based on your preferences and past stays</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/20 px-4 py-1.5 text-xs font-semibold text-gold-foreground ring-1 ring-gold/30 flex items-center gap-2">
                        <Heart className="h-3 w-3" /> Your Favorites
                    </span>
                </div>
            </header>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((room) => (
                    <SuggestionCard key={room.id} room={room} />
                ))}
            </div>
        </div>
    );
}

function SuggestionCard({ room }: { room: RoomSuggestion }) {
    const getAmenityIcon = (amenity: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            "Wi-Fi": <Wifi className="h-2 w-2" />,
            Pool: <Users className="h-2 w-2" />,
            Spa: <Sparkles className="h-2 w-2" />,
            Restaurant: <Utensils className="h-2 w-2" />,
            Gym: <Dumbbell className="h-2 w-2" />,
            Parking: <ParkingCircle className="h-2 w-2" />,
            Coffee: <Coffee className="h-2 w-2" />,
        };
        return iconMap[amenity] || null;
    };

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm hover:shadow-lg transition group">
            <div className="relative h-48 bg-gradient-to-br from-gold/30 to-primary/30 flex items-center justify-center">
                <BedDouble className="h-16 w-16 text-gold/60" />
                {room.available && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white rounded-full text-xs font-medium">
                        Available
                    </span>
                )}
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
                    {room.amenities.slice(0, 4).map((amenity, index) => {
                        const icon = getAmenityIcon(amenity);
                        return (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 dark:bg-secondary rounded-full text-xs text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                                {icon}
                                {!icon && amenity}
                            </span>
                        );
                    })}
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <span className="font-bold text-lg text-gray-900 dark:text-foreground">
                            LKR {room.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-muted-foreground ml-1">/night</span>
                    </div>
                    <button
                        className={`px-4 py-1.5 rounded-full text-sm transition ${room.available ? "bg-gold text-white hover:bg-gold/90 group-hover:scale-105" : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }`}
                        disabled={!room.available}
                    >
                        {room.available ? "Book Now" : "Unavailable"}
                    </button>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Near beach • 5 min walk</span>
                </div>
            </div>
        </div>
    );
}