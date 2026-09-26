import { Booking, UserProfile, RoomSuggestion } from "../types/dashboard";

export const MOCK_BOOKINGS: Booking[] = [
    {
        id: "1",
        roomNumber: "304",
        roomType: "Deluxe Ocean View",
        checkIn: "2024-12-20",
        checkOut: "2024-12-25",
        status: "confirmed",
        amount: 45000,
        nights: 5,
    },
    {
        id: "2",
        roomNumber: "201",
        roomType: "Premium Suite",
        checkIn: "2025-01-15",
        checkOut: "2025-01-18",
        status: "confirmed",
        amount: 75000,
        nights: 3,
    },
    {
        id: "3",
        roomNumber: "105",
        roomType: "Standard Room",
        checkIn: "2024-11-10",
        checkOut: "2024-11-12",
        status: "checked-out",
        amount: 28000,
        nights: 2,
    },
    {
        id: "4",
        roomNumber: "401",
        roomType: "Ocean Suite",
        checkIn: "2024-12-22",
        checkOut: "2024-12-24",
        status: "checked-in",
        amount: 65000,
        nights: 2,
    },
];

export const MOCK_SUGGESTIONS: RoomSuggestion[] = [
    {
        id: "1",
        name: "Ocean View Suite",
        type: "Deluxe",
        price: 55000,
        image: "",
        amenities: ["Wi-Fi", "Pool", "Spa", "Restaurant"],
        rating: 4.8,
        available: true,
    },
    {
        id: "2",
        name: "Garden Villa",
        type: "Premium",
        price: 42000,
        image: "",
        amenities: ["Wi-Fi", "Parking", "Gym", "Coffee"],
        rating: 4.6,
        available: true,
    },
    {
        id: "3",
        name: "Beach Front Room",
        type: "Standard",
        price: 32000,
        image: "",
        amenities: ["Wi-Fi", "Restaurant", "Pool"],
        rating: 4.4,
        available: false,
    },
];

export const MOCK_PROFILE: UserProfile = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    memberSince: "January 2024",
    totalBookings: 12,
    totalSpent: 580000,
};