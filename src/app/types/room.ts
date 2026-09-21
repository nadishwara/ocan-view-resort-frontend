export interface RoomResponseDto {
    id: number;
    roomNumber: string;
    roomType: string;
    description?: string;
    price: number;
    isAvailable: boolean;
    capacity: number;
    roomSizeSqM?: number;
    bedType?: string;
    viewType?: string;
    mealPlan?: string;
    cancellationPolicy?: string;
    amenities?: string[];
    imageUrls?: string[];
}