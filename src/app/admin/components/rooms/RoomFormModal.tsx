"use client";

import React, { useRef, useState } from 'react';
import { X, Loader2, Wifi, Tv, Snowflake, Coffee, Bath, Home, Car, Utensils, Smartphone, Upload, Bot } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'sonner';
import { Room } from '@/app/admin/rooms/page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const CHATBOT_BASE_URL = process.env.NEXT_PUBLIC_CHATBOT_URL;

const api = axios.create({ baseURL: API_BASE_URL });
const aiApi = axios.create({ baseURL: CHATBOT_BASE_URL });

const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || getCookie('token') || getCookie('auth_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});

interface RoomFormModalProps {
    isOpen: boolean;
    editingRoom: Room | null;
    formData: Partial<Room>;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Room>>>;
}

const amenityIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi className="h-3 w-3" />, TV: <Tv className="h-3 w-3" />, AC: <Snowflake className="h-3 w-3" />,
    'Mini Bar': <Coffee className="h-3 w-3" />, Bathtub: <Bath className="h-3 w-3" />, 'Living Room': <Home className="h-3 w-3" />,
    Parking: <Car className="h-3 w-3" />, Restaurant: <Utensils className="h-3 w-3" />, 'Room Service': <Smartphone className="h-3 w-3" />,
};

export function RoomFormModal({ isOpen, editingRoom, formData, isSubmitting, onClose, onSubmit, setFormData }: RoomFormModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const toggleAmenity = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities?.includes(amenity)
                ? prev.amenities.filter((a: string) => a !== amenity)
                : [...(prev.amenities || []), amenity],
        }));
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const uploadData = new FormData();
            uploadData.append('file', file);

            const token = localStorage.getItem('token') || getCookie('token') || getCookie('auth_token');

            try {
                const res = await api.post('/rooms/upload-image', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });

                const savedImageUrl = res.data.url;

                setFormData((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), savedImageUrl],
                }));

                toast.success("Image uploaded successfully!");
            } catch (err: unknown) {
                console.error("Upload Error:", err);
                toast.error("Failed to upload image");
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images?.filter((_: string, index: number) => index !== indexToRemove),
        }));
    };

    const handleGenerateDescription = async () => {
        try {
            setIsGenerating(true);
            toast.info("Generating description using AI...");

            const response = await aiApi.post('/api/generate-description', {
                type: formData.type || 'STANDARD',
                price: formData.price || 0,
                capacity: formData.capacity || 1,
                roomSizeSqM: formData.roomSizeSqM || null,
                bedType: formData.bedType || '',
                viewType: formData.viewType || '',
                mealPlan: formData.mealPlan || '',
                amenities: formData.amenities || []
            });

            if (response.data && response.data.description) {
                setFormData((prev) => ({
                    ...prev,
                    description: response.data.description
                }));
                toast.success("Description generated successfully!");
            }
        } catch (error: unknown) {
            console.error("AI Generation Error:", error);
            let errMsg = "Failed to generate description";
            if (axios.isAxiosError(error) && error.response?.data?.detail) {
                errMsg = error.response.data.detail;
            }
            toast.error(errMsg);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="sticky top-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                        {editingRoom ? 'Edit Room' : 'Add New Room'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Room Number *</label>
                            <input type="text" required value={formData.number || ''} onChange={(e) => setFormData({ ...formData, number: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., 101" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Room Type *</label>
                            <select required value={formData.type || 'DELUXE_SUITE'} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none">
                                <option value="STANDARD">Standard</option>
                                <option value="DELUXE">Deluxe</option>
                                <option value="SUITE">Suite</option>
                                <option value="EXECUTIVE">Executive</option>
                                <option value="DELUXE_SUITE">Deluxe Suite</option>
                                <option value="OCEAN_FRONT_TWIN">Oceanfront Twin</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Price (LKR) *</label>
                            <input type="number" required min="0" value={formData.price !== undefined ? formData.price : ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., 25000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Capacity (Guests) *</label>
                            <input type="number" required min="1" max="10" value={formData.capacity !== undefined ? formData.capacity : ''} onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., 2" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Room Size (SqM)</label>
                            <input type="number" step="0.1" value={formData.roomSizeSqM !== undefined ? formData.roomSizeSqM : ''} onChange={(e) => setFormData({ ...formData, roomSizeSqM: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., 45.5" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Bed Type</label>
                            <input type="text" value={formData.bedType || ''} onChange={(e) => setFormData({ ...formData, bedType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., 1 King Bed" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">View Type</label>
                            <input type="text" value={formData.viewType || ''} onChange={(e) => setFormData({ ...formData, viewType: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., Sea View" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Meal Plan</label>
                            <input type="text" value={formData.mealPlan || ''} onChange={(e) => setFormData({ ...formData, mealPlan: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., Breakfast Included" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">Cancellation Policy</label>
                        <input type="text" value={formData.cancellationPolicy || ''} onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })} className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none" placeholder="e.g., Free cancellation up to 24 hours" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground">Description</label>

                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={isGenerating}
                                className="px-3 py-1.5 text-xs font-medium bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                            >
                                {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Bot className="h-3.5 w-3.5" />}
                                {isGenerating ? 'Generating...' : 'AI Auto-Generate'}
                            </button>
                        </div>

                        <textarea
                            rows={3}
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg outline-none"
                            placeholder="Click AI Auto-Generate or write room description..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">Room Images</label>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

                        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-border rounded-xl p-4 text-center cursor-pointer hover:border-gold transition flex flex-col items-center justify-center gap-2">
                            <Upload className="h-6 w-6 text-gray-400" />
                            <p className="text-xs text-gray-500">Click to select room images from your device</p>
                        </div>

                        {formData.images && formData.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.images.map((imgUrl: string, index: number) => (
                                    <div key={index} className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 group">
                                        <Image
                                            src={imgUrl}
                                            alt={`Room Image ${index + 1}`}
                                            fill
                                            sizes='64px'
                                            className="h-full w-full object-cover"
                                        />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-80 hover:opacity-100 transition">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">Amenities</label>
                        <div className="flex flex-wrap gap-2">
                            {['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub', 'Living Room', 'Parking', 'Restaurant', 'Room Service'].map((amenity) => (
                                <button key={amenity} type="button" onClick={() => toggleAmenity(amenity)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${formData.amenities?.includes(amenity) ? 'bg-gold text-white' : 'bg-gray-100 dark:bg-secondary text-gray-600'}`}>
                                    {amenityIcons[amenity]} {amenity}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-border">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium bg-gold text-white rounded-lg hover:bg-gold/90 transition flex items-center gap-2">
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                            {editingRoom ? 'Update Room' : 'Add Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}