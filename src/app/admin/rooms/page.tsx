"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { RoomTable } from '../components/rooms/RoomTable';
import { DeleteModal } from '../components/rooms/DeleteModal';
import { RoomFormModal } from '../components/rooms/RoomFormModal';


export interface Room {
  id: string;
  number: string;
  type: 'Standard' | 'Deluxe' | 'Suite' | 'Executive';
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  price: number;
  capacity: number;
  amenities: string[];
  description: string;
  floor: number;
  images: string[];
}

type ServerRoom = {
  id: number | string;
  roomNumber: string;
  roomType: string;
  price: number;
  isAvailable?: boolean;
  capacity?: number;
  amenities?: string[];
  imageUrls?: string[];
  images?: any[];
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const api = axios.create({ baseURL: API_BASE_URL });

// Cookie Reader
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Auth Interceptor
api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || getCookie('token') || getCookie('auth_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (e) {}
  return config;
});

// Mapping Logic
const mapServerToRoom = (sr: ServerRoom): Room => ({
  id: String(sr.id),
  number: sr.roomNumber ?? '',
  type: (sr.roomType as Room['type']) || 'Standard',
  status: sr.isAvailable ? 'available' : 'occupied',
  price: sr.price ?? 0,
  capacity: sr.capacity ?? 1,
  amenities: sr.amenities?.map((a: any) => String(a)) || [],
  description: '',
  floor: 1,
  images: (sr.imageUrls || sr.images || []).map((i: any) => String(i)),
});

const mapRoomToServer = (r: Partial<Room>) => ({
  roomNumber: r.number,
  roomType: r.type,
  price: r.price,
  isAvailable: r.status === 'available',
  capacity: r.capacity,
  amenities: r.amenities ?? [],
  imageUrls: r.images ?? [],
});

const roomApi = {
  getAll: () => api.get<ServerRoom[]>('/rooms'),
  create: (data: Partial<Room>) => api.post('/rooms', mapRoomToServer(data)),
  update: (id: string, data: Partial<Room>) => api.put(`/rooms/${id}`, mapRoomToServer(data)),
  delete: (id: string) => api.delete(`/rooms/${id}`),
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Partial<Room>>({});

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomApi.getAll();
      const apiRooms = Array.isArray(response.data) ? response.data : [];
      setRooms(apiRooms.map(mapServerToRoom));
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to load rooms: ${errMsg}`);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRooms();
  }, []);

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (editingRoom) {
        const response = await roomApi.update(editingRoom.id, formData);
        const updated = response.data ? mapServerToRoom(response.data as ServerRoom) : ({ ...editingRoom, ...formData } as Room);
        setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? updated : r)));
        toast.success(`Room ${updated.number} updated successfully`);
      } else {
        const response = await roomApi.create(formData);
        const created = response.data ? mapServerToRoom(response.data as ServerRoom) : (formData as Room);
        setRooms((prev) => [...prev, created]);
        toast.success(`Room ${created.number} added successfully`);
      }
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({});
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to save room: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm Delete Handler
  const confirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      setIsSubmitting(true);
      await roomApi.delete(roomToDelete.id);
      setRooms((prev) => prev.filter((r) => r.id !== roomToDelete.id));
      toast.success(`Room ${roomToDelete.number} deleted successfully`);
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || 'Unknown error';
      toast.error(`Failed to delete room: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.number.toLowerCase().includes(searchTerm.toLowerCase()) || r.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'occupied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'maintenance': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'cleaning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-blue-500';
      case 'maintenance': return 'bg-red-500';
      case 'cleaning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gold h-8 w-8" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <button
          onClick={() => {
            setEditingRoom(null);
            setFormData({ number: '', type: 'Standard', status: 'available', price: 0, capacity: 2, amenities: [], floor: 1 });
            setIsModalOpen(true);
          }}
          className="bg-gold text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Room
        </button>
      </div>

      <RoomTable
        rooms={filteredRooms}
        currentPage={currentPage}
        itemsPerPage={5}
        onEdit={(room) => { setEditingRoom(room); setFormData(room); setIsModalOpen(true); }}
        onDelete={(room) => { setRoomToDelete(room); setIsDeleteModalOpen(true); }}
        onPageChange={setCurrentPage}
        getStatusColor={getStatusColor}
        getStatusDot={getStatusDot}
      />

      <RoomFormModal
        isOpen={isModalOpen}
        editingRoom={editingRoom}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        setFormData={setFormData}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        roomToDelete={roomToDelete}
        isSubmitting={isSubmitting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}