"use client";

import React from 'react';
import { BedDouble, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Room } from '@/app/admin/rooms/page'; // import Room interface

interface RoomTableProps {
    rooms: Room[];
    currentPage: number;
    itemsPerPage: number;
    onEdit: (room: Room) => void;
    onDelete: (room: Room) => void;
    onPageChange: (page: number) => void;
    getStatusColor: (status: string) => string;
    getStatusDot: (status: string) => string;
}

export function RoomTable({
    rooms,
    currentPage,
    itemsPerPage,
    onEdit,
    onDelete,
    onPageChange,
    getStatusColor,
    getStatusDot,
}: RoomTableProps) {
    const totalPages = Math.ceil(rooms.length / itemsPerPage);
    const currentRooms = rooms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="rounded-2xl border border-gray-200 dark:border-border bg-white dark:bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-border bg-gray-50 dark:bg-secondary/50">
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Room</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Price</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Capacity</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Floor</th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600 dark:text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRooms.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-muted-foreground">
                                    No rooms found.
                                </td>
                            </tr>
                        ) : (
                            currentRooms.map((room) => (
                                <tr key={room.id} className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/50 transition">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                                                <BedDouble className="h-5 w-5 text-gold" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-foreground">Room {room.number}</p>
                                                <p className="text-xs text-gray-500 dark:text-muted-foreground">ID: {String(room.id || '').slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-900 dark:text-foreground">{room.type}</td>
                                    <td className="py-3 px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(room.status)}`} />
                                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-foreground">LKR {room.price.toLocaleString()}</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-muted-foreground">{room.capacity} Guests</td>
                                    <td className="py-3 px-4 text-gray-600 dark:text-muted-foreground">Floor {room.floor}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => onEdit(room)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition">
                                                <Edit className="h-4 w-4 text-blue-500" />
                                            </button>
                                            <button onClick={() => onDelete(room)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                                                <Trash2 className="h-4 w-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {rooms.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-border">
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, rooms.length)} of {rooms.length} rooms
                    </p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 transition">
                            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded-lg text-sm font-medium transition ${currentPage === page ? 'bg-gold text-white' : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100'}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 transition">
                            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}