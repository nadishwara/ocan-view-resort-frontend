import { useEffect, useState, useCallback } from "react";
import { RoomResponseDto } from "../types/room";
import { fetchAllRooms, groupRoomByType } from "../services/roomService";

export const useRooms = () => {
    const [rooms, setRooms] = useState<RoomResponseDto[]>([]);
    const [groupedRooms, setGroupedRooms] = useState<Record<string, RoomResponseDto[]>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getRooms = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAllRooms();

            // Safe array mapping
            const roomsArray = Array.isArray(data) ? data : [];
            setRooms(roomsArray);
            setGroupedRooms(groupRoomByType(roomsArray));
        } catch (err: any) {
            console.error("Failed to fetch rooms:", err);
            setError("Failed to load rooms, please try again later!");
            setRooms([]);
            setGroupedRooms({});
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getRooms();
    }, [getRooms]);

    return { rooms, groupedRooms, loading, error, refetchRooms: getRooms };
};

// Alias for backward compatibility
export const userRooms = useRooms;