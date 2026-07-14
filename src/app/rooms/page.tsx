"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Bed,
    Bath,
    Users,
    Wifi,
    Coffee,
    Utensils,
    Sparkles,
    Dumbbell,
    Waves,
    Sun,
    Moon,
    Star,
    MapPin,
    Calendar,
    Clock,
    ChevronRight,
    Award,
    Shield,
    Check,
    Hotel,
    Home,
    Building,
    Trees,
    GlassWater,
    Car,
    Snowflake,
    Tv,
    Phone,
    ParkingCircle,
    Briefcase,
    Heart,
    Share2,
    Eye,
    ArrowRight,
    Play,
    Search,
    Leaf,
} from "lucide-react";

// Room Types Data
const rooms = [
    {
        id: 1,
        name: "Ocean Suite",
        type: "Suite",
        description:
            "Luxurious oceanfront suite with panoramic views, private balcony, and premium amenities for an unforgettable stay.",
        price: "$450",
        pricePer: "night",
        capacity: 4,
        beds: 2,
        bathrooms: 2,
        size: "85 m²",
        image: "/rooms/ocean-suite.jpg",
        amenities: ["Wifi", "TV", "Minibar", "Bathtub", "Private Balcony", "Ocean View"],
        popular: true,
        rating: 4.9,
        reviews: 128,
        icon: Waves,
    },
    {
        id: 2,
        name: "Garden Villa",
        type: "Villa",
        description:
            "Tranquil garden villa surrounded by lush tropical greenery, featuring a private plunge pool and outdoor dining area.",
        price: "$350",
        pricePer: "night",
        capacity: 6,
        beds: 3,
        bathrooms: 2,
        size: "120 m²",
        image: "/rooms/garden-villa.jpg",
        amenities: ["Wifi", "TV", "Private Pool", "Outdoor Dining", "Garden View", "Kitchen"],
        popular: true,
        rating: 4.8,
        reviews: 96,
        icon: Trees,
    },
    {
        id: 3,
        name: "Deluxe King",
        type: "Room",
        description:
            "Elegant king room with modern coastal decor, premium bedding, and stunning sunset views from your private terrace.",
        price: "$280",
        pricePer: "night",
        capacity: 2,
        beds: 1,
        bathrooms: 1,
        size: "45 m²",
        image: "/rooms/deluxe-king.jpg",
        amenities: ["Wifi", "TV", "Minibar", "Terrace", "Sunset View", "Work Desk"],
        popular: false,
        rating: 4.7,
        reviews: 204,
        icon: Hotel,
    },
    {
        id: 4,
        name: "Family Suite",
        type: "Suite",
        description:
            "Spacious family suite with connecting rooms, kids' play area, and panoramic views of the coastal landscape.",
        price: "$520",
        pricePer: "night",
        capacity: 8,
        beds: 4,
        bathrooms: 3,
        size: "150 m²",
        image: "/rooms/family-suite.jpg",
        amenities: ["Wifi", "TV", "Minibar", "Play Area", "Panoramic View", "Bathtub"],
        popular: false,
        rating: 4.6,
        reviews: 67,
        icon: Users,
    },
];

// Services Data
const services = [
    {
        id: 1,
        title: "Spa & Wellness",
        description:
            "Rejuvenate with our signature treatments, massages, and wellness programs in a serene coastal setting.",
        icon: Sparkles,
        color: "#D4AF37",
        features: ["Massages", "Facials", "Body Treatments", "Yoga Classes"],
    },
    {
        id: 2,
        title: "Fine Dining",
        description:
            "Exquisite culinary experiences with locally sourced ingredients, ocean-inspired dishes, and world-class wines.",
        icon: Utensils,
        color: "#D4AF37",
        features: ["Breakfast Buffet", "Seafood Restaurant", "Wine Cellar", "Sunset Bar"],
    },
    {
        id: 3,
        title: "Fitness Center",
        description:
            "State-of-the-art fitness facilities with ocean views, personal trainers, and wellness coaching.",
        icon: Dumbbell,
        color: "#D4AF37",
        features: ["Cardio Equipment", "Strength Training", "Personal Training", "Fitness Classes"],
    },
    {
        id: 4,
        title: "Water Sports",
        description:
            "Adventure awaits with a variety of water activities including snorkeling, kayaking, and sailing.",
        icon: Waves,
        color: "#D4AF37",
        features: ["Snorkeling", "Kayaking", "Sailing", "Scuba Diving"],
    },
];

export default function RoomsServices() {
    const [activeTab, setActiveTab] = useState<"rooms" | "services">("rooms");

    return (
        <div className="w-full bg-background min-h-screen">
            {/* Hero Section */}
            <section className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen overflow-hidden">
                {/* Background Image with Gradient Overlay */}
                <div className="absolute inset-0">
                    {/* Hero Image Placeholder - Replace with your actual image */}
                    <div className="w-full h-full bg-gradient-ocean relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-ocean-deep/70 via-ocean-deep/40 to-transparent" />

                        {/* Decorative Pattern Overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-20 left-20 w-64 h-64 border-2 border-gold/30 rounded-full animate-pulse" />
                            <div className="absolute bottom-20 right-20 w-96 h-96 border-2 border-gold/20 rounded-full animate-pulse delay-1000" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gold/10 rounded-full animate-pulse delay-2000" />
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-10 left-10 animate-float">
                                <div className="w-3 h-3 rounded-full bg-gold/30" />
                            </div>
                            <div className="absolute top-20 right-20 animate-float-delay">
                                <div className="w-2 h-2 rounded-full bg-white/30" />
                            </div>
                            <div className="absolute bottom-32 left-1/4 animate-float-delay-2">
                                <div className="w-4 h-4 rounded-full bg-gold/20" />
                            </div>
                        </div>
                    </div>

                    {/* Image - Uncomment when you have actual images */}
                    {/* <Image
            src="/hero-image.jpg"
            alt="Luxury Resort"
            fill
            className="object-cover"
            priority
          /> */}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 h-full flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8">
                        <div className="max-w-2xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 backdrop-blur-sm border border-gold/30 rounded-full mb-6 animate-fade-in-up">
                                <Award className="w-4 h-4 text-gold" />
                                <span className="text-xs font-mono text-gold uppercase tracking-widest">
                                    Award Winning Resort
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white animate-fade-in-up animation-delay-200">
                                Discover
                                <br />
                                <span className="text-gradient-gold font-serif italic">
                                    Coastal Luxury
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-lg mt-4 font-sans animate-fade-in-up animation-delay-400">
                                Experience unparalleled comfort and world-class amenities at our
                                premier coastal resort. Where luxury meets nature.
                            </p>

                            {/* Search/Booking Bar */}
                            <div className="mt-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3 animate-fade-in-up animation-delay-600">
                                <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                                    <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Check In - Check Out"
                                        className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/40 text-sm w-full font-sans"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5 border border-white/10">
                                    <Users className="w-5 h-5 text-gold flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="2 Guests"
                                        className="bg-transparent border-none outline-none text-white/80 placeholder:text-white/40 text-sm w-full font-sans"
                                    />
                                </div>
                                <button className="bg-gold text-gold-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-gold hover:shadow-lg hover:scale-[1.02] whitespace-nowrap">
                                    <Search className="w-4 h-4" />
                                    Check Availability
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 mt-8 animate-fade-in-up animation-delay-800">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className="w-7 h-7 rounded-full bg-gold/20 border-2 border-white/10 flex items-center justify-center"
                                            >
                                                <span className="text-[10px] text-white/60 font-mono">
                                                    {String.fromCharCode(64 + i)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-white/60 text-sm font-sans">
                                        2k+ Happy Guests
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 fill-gold text-gold" />
                                    <span className="text-white/60 text-sm font-sans">
                                        4.9/5 (1.2k Reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
                        <div className="w-1 h-2 bg-gold rounded-full animate-scroll-indicator" />
                    </div>
                </div>
            </section>

            {/* Rooms & Services Section */}
            <section className="w-full bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div
                        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle at 30% 40%, var(--gold) 0%, transparent 70%)",
                            opacity: 0.05,
                            filter: "blur(80px)",
                        }}
                    />
                    <div
                        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle at 70% 60%, var(--ocean-deep) 0%, transparent 70%)",
                            opacity: 0.05,
                            filter: "blur(80px)",
                        }}
                    />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header */}
                    <div className="animate-on-scroll">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-xs sm:text-sm font-mono text-gold uppercase tracking-widest">
                                [ Accomodations ]
                            </span>
                            <span className="flex-1 h-px bg-gradient-to-r from-gold via-gold/30 to-transparent" />
                        </div>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div>
                                <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold leading-[1.1]">
                                    Luxury
                                    <br />
                                    <span className="text-gradient-gold font-serif italic">Rooms & Services</span>
                                </h2>
                                <p className="text-foreground/60 max-w-lg mt-3 text-sm sm:text-base font-sans">
                                    Experience unparalleled comfort and world-class amenities in our
                                    carefully curated accommodations.
                                </p>
                            </div>

                            {/* Tab Switcher */}
                            <div className="flex bg-muted p-1 rounded-lg border border-border/50 font-sans">
                                <button
                                    onClick={() => setActiveTab("rooms")}
                                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "rooms"
                                            ? "bg-gold text-gold-foreground shadow-gold"
                                            : "hover:bg-background/50"
                                        }`}
                                >
                                    <Hotel className="w-4 h-4" />
                                    Rooms
                                </button>
                                <button
                                    onClick={() => setActiveTab("services")}
                                    className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === "services"
                                            ? "bg-gold text-gold-foreground shadow-gold"
                                            : "hover:bg-background/50"
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Services
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rooms Grid */}
                    {activeTab === "rooms" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {rooms.map((room, index) => {
                                const Icon = room.icon;
                                return (
                                    <div
                                        key={room.id}
                                        className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden shadow-luxe hover:shadow-gold transition-all duration-500 hover:-translate-y-1 animate-on-scroll"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gradient-ocean/10">
                                            {/* Gradient Placeholder */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/20 to-gold/10 group-hover:scale-105 transition-transform duration-700" />

                                            {/* Decorative Pattern */}
                                            <div className="absolute inset-0 opacity-10">
                                                <div className="absolute top-0 right-0 w-48 h-48 border-r-2 border-t-2 border-gold/20" />
                                                <div className="absolute bottom-0 left-0 w-48 h-48 border-l-2 border-b-2 border-gold/20" />
                                            </div>

                                            {/* Image - Uncomment when ready */}
                                            {/* <Image
                        src={room.image}
                        alt={room.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      /> */}

                                            {/* Popular Badge */}
                                            {room.popular && (
                                                <div className="absolute top-4 right-4 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-gold animate-pulse">
                                                    <Star className="w-3 h-3 fill-gold-foreground" />
                                                    Popular
                                                </div>
                                            )}

                                            {/* Rating Badge */}
                                            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5">
                                                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                                                {room.rating} ({room.reviews} reviews)
                                            </div>

                                            {/* Icon Overlay */}
                                            <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/10">
                                                <Icon className="w-5 h-5 text-gold" />
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 sm:p-7">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono text-gold uppercase tracking-wider">
                                                            {room.type}
                                                        </span>
                                                        <span className="text-foreground/20">•</span>
                                                        <span className="text-xs text-foreground/40 font-sans">
                                                            {room.size}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-2xl font-display font-bold leading-tight">
                                                        {room.name}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-gold font-display">
                                                        {room.price}
                                                    </span>
                                                    <span className="text-xs text-foreground/40 block font-sans">
                                                        / {room.pricePer}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-foreground/60 text-sm leading-relaxed mb-4 font-sans">
                                                {room.description}
                                            </p>

                                            {/* Room Details */}
                                            <div className="flex flex-wrap gap-3 mb-4 text-xs text-foreground/50 font-sans">
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 text-gold" />
                                                    {room.capacity} guests
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Bed className="w-4 h-4 text-gold" />
                                                    {room.beds} bed{room.beds > 1 ? "s" : ""}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Bath className="w-4 h-4 text-gold" />
                                                    {room.bathrooms} bath{room.bathrooms > 1 ? "s" : ""}
                                                </span>
                                            </div>

                                            {/* Amenities */}
                                            <div className="flex flex-wrap gap-1.5 mb-5">
                                                {room.amenities.slice(0, 4).map((amenity) => (
                                                    <span
                                                        key={amenity}
                                                        className="px-2.5 py-1 bg-muted text-foreground/60 rounded-full text-[10px] font-sans border border-border/50"
                                                    >
                                                        {amenity}
                                                    </span>
                                                ))}
                                                {room.amenities.length > 4 && (
                                                    <span className="px-2.5 py-1 text-foreground/40 rounded-full text-[10px] font-sans">
                                                        +{room.amenities.length - 4} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3">
                                                <button className="flex-1 bg-gold text-gold-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-gold hover:shadow-lg hover:scale-[1.02]">
                                                    <Calendar className="w-4 h-4" />
                                                    Book Now
                                                </button>
                                                <button className="p-2.5 rounded-xl border border-border/50 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group">
                                                    <Heart className="w-4 h-4 text-foreground/40 group-hover:text-gold transition-colors" />
                                                </button>
                                                <button className="p-2.5 rounded-xl border border-border/50 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300 group">
                                                    <Share2 className="w-4 h-4 text-foreground/40 group-hover:text-gold transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Services Grid */}
                    {activeTab === "services" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {services.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <div
                                        key={service.id}
                                        className="group relative bg-card border border-border/50 rounded-2xl p-8 text-center hover:shadow-gold transition-all duration-500 hover:-translate-y-1 overflow-hidden animate-on-scroll"
                                        style={{ animationDelay: `${index * 150}ms` }}
                                    >
                                        {/* Decorative Background */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/5 to-transparent" />

                                        {/* Icon Circle */}
                                        <div className="relative w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center border border-gold/20 group-hover:border-gold/40 transition-all duration-300">
                                            <Icon className="w-10 h-10 text-gold" />
                                            <div className="absolute inset-0 rounded-full bg-gold/5 blur-xl group-hover:blur-2xl transition-all duration-500" />
                                        </div>

                                        <h3 className="text-xl font-display font-bold mb-2">{service.title}</h3>
                                        <p className="text-foreground/60 text-sm leading-relaxed mb-4 font-sans">
                                            {service.description}
                                        </p>

                                        {/* Features */}
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {service.features.map((feature) => (
                                                <span
                                                    key={feature}
                                                    className="px-2.5 py-1 bg-muted text-foreground/50 rounded-full text-[10px] font-sans border border-border/50"
                                                >
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Learn More Link */}
                                        <button className="mt-5 text-gold font-medium text-sm hover:gap-3 transition-all duration-300 inline-flex items-center gap-2 group/link">
                                            <span>Learn More</span>
                                            <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Bottom Decorative Line */}
                    <div className="mt-16 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
                </div>
            </section>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delay-2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scroll-indicator {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(12px); opacity: 0; }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float-delay 5s ease-in-out infinite;
        }
        
        .animate-float-delay-2 {
          animation: float-delay-2 3.5s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 1.5s ease-in-out infinite;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(40px);
          animation: fade-in-up 0.8s ease-out forwards;
          animation-play-state: paused;
        }
        
        .animate-on-scroll {
          animation-play-state: running;
        }
      `}</style>
        </div>
    );
}