"use client";

import React, { useState } from "react";
import {
    Bed, Users, Sparkles, Dumbbell, Waves, Award, Star, Calendar, ChevronRight, Hotel, Utensils, Heart, Share2, Search, Loader2,
} from "lucide-react";
import { useRooms } from "@/app/hooks/useRooms";
import { RoomResponseDto } from "@/app/types/room";
import Image from "next/image";

const BACKEND_HOST = process.env.NEXT_PUBLIC_SPRING_BACKEND_URL;

// Services Static Data
const SERVICES = [
    {
        id: 1,
        title: "Spa & Wellness",
        description: "Rejuvenate with our signature treatments, massages, and wellness programs in a serene coastal setting.",
        icon: Sparkles,
        features: ["Massages", "Facials", "Body Treatments", "Yoga Classes"],
    },
    {
        id: 2,
        title: "Fine Dining",
        description: "Exquisite culinary experiences with locally sourced ingredients, ocean-inspired dishes, and world-class wines.",
        icon: Utensils,
        features: ["Breakfast Buffet", "Seafood Restaurant", "Wine Cellar", "Sunset Bar"],
    },
    {
        id: 3,
        title: "Fitness Center",
        description: "State-of-the-art fitness facilities with ocean views, personal trainers, and wellness coaching.",
        icon: Dumbbell,
        features: ["Cardio Equipment", "Strength Training", "Personal Training", "Fitness Classes"],
    },
    {
        id: 4,
        title: "Water Sports",
        description: "Adventure awaits with a variety of water activities including snorkeling, kayaking, and sailing.",
        icon: Waves,
        features: ["Snorkeling", "Kayaking", "Sailing", "Scuba Diving"],
    },
];

// Fallback Placeholder SVG (Used when no image exists)
const DEFAULT_IMAGE_PLACEHOLDER =
    "data:image/svg+xml;charset=UTF-8,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%231e293b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%23cbd5e1'%3EOceanView Luxury Room%3C/text%3E%3C/svg%3E";

export default function RoomsServices() {
    const [activeTab, setActiveTab] = useState<"rooms" | "services">("rooms");
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

    // Fetch Room Data via Custom Hook
    const { rooms, loading, error } = useRooms();

    // Image Path Resolver Utility
    const resolveImageUrl = (imagePath?: string): string => {
        if (!imagePath || typeof imagePath !== "string" || imagePath.trim() === "") {
            return DEFAULT_IMAGE_PLACEHOLDER;
        }
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
            return imagePath;
        }
        const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
        return cleanPath;
    };

    // Category Normalization Helper
    const normalizeCategory = (category: string): string =>
        category.trim().toUpperCase().replace(/[\s_]+/g, "_");

    // Extract Unique Categories Dynamically
    const categoryMap = new Map<string, string>();
    rooms.forEach((room) => {
        if (room.roomType && room.roomType.trim()) {
            const normalized = normalizeCategory(room.roomType);
            if (!categoryMap.has(normalized)) {
                categoryMap.set(normalized, room.roomType.trim());
            }
        }
    });
    const categories = ["ALL", ...Array.from(categoryMap.values())];

    // Filter Rooms based on Selected Category
    const displayedRooms: RoomResponseDto[] =
        selectedCategory === "ALL"
            ? rooms
            : rooms.filter(
                (room) =>
                    room.roomType &&
                    normalizeCategory(room.roomType) === normalizeCategory(selectedCategory)
            );

    return (
        <div className="w-full bg-background min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Next.js Image Component */}
                    <Image
                        src="https://images.unsplash.com/photo-1609602126247-4ab7188b4aa1?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Ocean View Resort Hero"
                        fill
                        priority
                        quality={90}
                        className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-linear-to-b from-ocean-deep/40 via-ocean-deep/30 to-ocean-deep/80" />
                </div>

                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full mb-6 animate-fade-in-up">
                                <Award className="w-4 h-4 text-gold" />
                                <span className="text-xs font-mono text-gold uppercase tracking-widest">
                                    Award Winning Resort
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white">
                                Discover <br />
                                <span className="text-gradient-gold font-serif italic">Coastal Luxury</span>
                            </h1>

                            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mt-4 font-sans">
                                Experience unparalleled comfort and world-class amenities at our premier coastal resort.
                            </p>

                            {/* Booking Search Form */}
                            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                                    <Calendar className="w-5 h-5 text-gold shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Check In - Check Out"
                                        className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/40 text-sm w-full"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                                    <Users className="w-5 h-5 text-gold shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="2 Guests"
                                        className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/40 text-sm w-full"
                                    />
                                </div>
                                <button className="bg-gold text-gold-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-gold whitespace-nowrap">
                                    <Search className="w-4 h-4" />
                                    Check Availability
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rooms & Services Main Section */}
            <section className="w-full bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 overflow-hidden relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-xs sm:text-sm font-mono text-gold uppercase tracking-widest">
                            [ Accommodations ]
                        </span>
                        <span className="flex-1 h-px bg-linear-to-r from-gold via-gold/30 to-transparent" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1]">
                                Luxury <br />
                                <span className="text-gradient-gold font-serif italic">Rooms & Services</span>
                            </h2>
                        </div>

                        {/* Navigation Tab Switcher */}
                        <div className="flex bg-muted p-1 rounded-lg border border-border/50 font-sans">
                            <button
                                onClick={() => setActiveTab("rooms")}
                                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "rooms"
                                    ? "bg-gold text-gold-foreground shadow-gold"
                                    : "hover:bg-background/50"
                                    }`}
                            >
                                <Hotel className="w-4 h-4 inline mr-2" /> Rooms
                            </button>
                            <button
                                onClick={() => setActiveTab("services")}
                                className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === "services"
                                    ? "bg-gold text-gold-foreground shadow-gold"
                                    : "hover:bg-background/50"
                                    }`}
                            >
                                <Sparkles className="w-4 h-4 inline mr-2" /> Services
                            </button>
                        </div>
                    </div>

                    {/* Rooms Section */}
                    {activeTab === "rooms" && (
                        <div>
                            {/* Room Type Category Filter Pills */}
                            {!loading && categories.length > 1 && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`px-4 py-2 text-xs font-mono rounded-full uppercase tracking-wider transition-all ${selectedCategory === category
                                                ? "bg-gold text-white shadow-gold"
                                                : "bg-muted text-foreground/60 hover:bg-gold/20"
                                                }`}
                                        >
                                            {category === "ALL" ? "ALL" : category.replace(/_/g, " ")}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Loading State */}
                            {loading && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                                    <p className="text-sm text-foreground/60">Loading luxury rooms...</p>
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="text-center py-12 text-red-500">
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Empty Data State */}
                            {!loading && !error && displayedRooms.length === 0 && (
                                <div className="text-center py-16 text-foreground/50">
                                    No rooms available in this category.
                                </div>
                            )}

                            {/* Rooms Grid */}
                            {!loading && !error && displayedRooms.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                    {displayedRooms.map((room) => {
                                        const imageUrl = resolveImageUrl(
                                            Array.isArray(room.imageUrls) && room.imageUrls.length > 0
                                                ? room.imageUrls[0]
                                                : undefined
                                        );

                                        return (
                                            <div
                                                key={room.id}
                                                className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-luxe hover:shadow-gold transition-all duration-500 hover:-translate-y-1"
                                            >
                                                {/* Room Image Container */}
                                                <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-muted">
                                                    <img
                                                        src={imageUrl}
                                                        alt={`Room ${room.roomNumber}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = DEFAULT_IMAGE_PLACEHOLDER;
                                                        }}
                                                    />

                                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-mono">
                                                        Room {room.roomNumber}
                                                    </div>

                                                    {room.isAvailable && (
                                                        <div className="absolute top-4 right-4 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-gold">
                                                            <Star className="w-3 h-3 fill-gold-foreground" />
                                                            Available
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Room Details Content */}
                                                <div className="p-6 sm:p-7">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-xs font-mono text-gold uppercase tracking-wider">
                                                                    {room.roomType ? room.roomType.replace(/_/g, " ") : "STANDARD"}
                                                                </span>
                                                                {typeof room.roomSizeSqM === "number" && room.roomSizeSqM > 0 && (
                                                                    <>
                                                                        <span className="text-foreground/20">•</span>
                                                                        <span className="text-xs text-foreground/40">
                                                                            {room.roomSizeSqM} m²
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            <h3 className="text-2xl font-display font-bold leading-tight">
                                                                {room.viewType || `Room ${room.roomNumber}`}
                                                            </h3>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-2xl font-bold text-gold font-display">
                                                                LKR {typeof room.price === "number" ? room.price.toLocaleString() : "0"}
                                                            </span>
                                                            <span className="text-xs text-foreground/40 block">
                                                                / night
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-foreground/60 text-sm leading-relaxed mb-4 line-clamp-3">
                                                        {room.description && room.description.trim() !== ""
                                                            ? room.description
                                                            : "No description available."}
                                                    </p>

                                                    {/* Room Capacity and Bed Information */}
                                                    <div className="flex flex-wrap gap-3 mb-4 text-xs text-foreground/50">
                                                        <span className="flex items-center gap-1.5">
                                                            <Users className="w-4 h-4 text-gold" />
                                                            {room.capacity ?? 2} guests
                                                        </span>
                                                        {room.bedType && room.bedType.trim() !== "" && (
                                                            <span className="flex items-center gap-1.5">
                                                                <Bed className="w-4 h-4 text-gold" />
                                                                {room.bedType}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Amenities Badges */}
                                                    {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-5">
                                                            {room.amenities.slice(0, 4).map((amenity) => (
                                                                <span
                                                                    key={amenity}
                                                                    className="px-2.5 py-1 bg-muted text-foreground/60 rounded-full text-[10px] border border-border/50"
                                                                >
                                                                    {amenity}
                                                                </span>
                                                            ))}
                                                            {room.amenities.length > 4 && (
                                                                <span className="px-2.5 py-1 text-foreground/40 rounded-full text-[10px]">
                                                                    +{room.amenities.length - 4} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-3">
                                                        <button className="flex-1 bg-gold text-gold-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-gold">
                                                            <Calendar className="w-4 h-4" /> Book Now
                                                        </button>
                                                        <button className="p-2.5 rounded-xl border border-border/50 hover:border-gold/50 transition-all">
                                                            <Heart className="w-4 h-4 text-foreground/40" />
                                                        </button>
                                                        <button className="p-2.5 rounded-xl border border-border/50 hover:border-gold/50 transition-all">
                                                            <Share2 className="w-4 h-4 text-foreground/40" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Services Section */}
                    {activeTab === "services" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {SERVICES.map((service) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        className="group relative bg-card border border-border/50 rounded-2xl p-8 text-center hover:shadow-gold transition-all duration-500 hover:-translate-y-1"
                                    >
                                        <div className="relative w-20 h-20 mx-auto mb-5 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                            <Icon className="w-10 h-10 text-gold" />
                                        </div>
                                        <h3 className="text-xl font-display font-bold mb-2">{service.title}</h3>
                                        <p className="text-foreground/60 text-sm leading-relaxed mb-4">
                                            {service.description}
                                        </p>
                                        <button className="mt-2 text-gold font-medium text-sm inline-flex items-center gap-1">
                                            <span>Learn More</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}