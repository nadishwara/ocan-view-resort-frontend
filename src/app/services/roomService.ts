import axios from "axios";
import { RoomResponseDto } from "../types/room";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

interface PaginatedRoomResponse {
    content?: RoomResponseDto[];
}

export const fetchAllRooms = async (): Promise<RoomResponseDto[]> => {
    try {
        const response = await api.get<RoomResponseDto[] | PaginatedRoomResponse>("/rooms");
        const data = response.data;

        if (Array.isArray(data)) {
            return data;
        } else if (data && "content" in data && Array.isArray(data.content)) {
            return data.content;
        }
        return [];
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
};

export const groupRoomByType = (rooms: RoomResponseDto[]): Record<string, RoomResponseDto[]> => {
    const safeRooms = Array.isArray(rooms) ? rooms : [];

    return safeRooms.reduce((acc, room) => {
        const type = room.roomType ? room.roomType.trim().toUpperCase() : "OTHER";
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(room);
        return acc;
    }, {} as Record<string, RoomResponseDto[]>);
};