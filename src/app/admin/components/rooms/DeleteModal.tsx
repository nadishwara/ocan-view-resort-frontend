"use client";

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Room } from '@/app/admin/rooms/page';

interface DeleteModalProps {
    isOpen: boolean;
    roomToDelete: Room | null;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function DeleteModal({ isOpen, roomToDelete, isSubmitting, onClose, onConfirm }: DeleteModalProps) {
    if (!isOpen || !roomToDelete) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <AlertCircle className="h-8 w-8" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-foreground">Delete Room</h3>
                </div>
                <p className="text-gray-600 dark:text-muted-foreground mb-6">
                    Are you sure you want to delete <strong>Room {roomToDelete.number}</strong>? This action cannot be undone.
                </p>
                <div className="flex items-center justify-end gap-3">
                    <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                    <button onClick={onConfirm} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2">
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />} Delete Room
                    </button>
                </div>
            </div>
        </div>
    );
}