export type BookingStatus = "confirmed" | "checked-in" | "checked-out" | "cancelled";

export interface Booking {
    id: string;
    roomNumber: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    status: BookingStatus;
    amount: number;
    nights: number;
}

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    memberSince: string;
    totalBookings: number;
    totalSpent: number;
}

export interface RoomSuggestion {
    id: string;
    name: string;
    type: string;
    price: number;
    image: string;
    amenities: string[];
    rating: number;
    available: boolean;
}