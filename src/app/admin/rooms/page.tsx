"use client";

import React, { useState } from 'react';
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  DollarSign,
  Home,
  Wifi,
  Coffee,
  Tv,
  Snowflake,
  Bath,
  Car,
  Utensils,
  Smartphone,
  Loader2,
} from 'lucide-react';

// Types
interface Room {
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

// Mock Data
const MOCK_ROOMS: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Standard',
    status: 'available',
    price: 25000,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    description: 'Comfortable standard room with city view',
    floor: 1,
    images: ['/rooms/standard-1.jpg'],
  },
  {
    id: '2',
    number: '102',
    type: 'Standard',
    status: 'occupied',
    price: 25000,
    capacity: 2,
    amenities: ['WiFi', 'TV', 'AC'],
    description: 'Standard room with garden view',
    floor: 1,
    images: ['/rooms/standard-2.jpg'],
  },
  {
    id: '3',
    number: '201',
    type: 'Deluxe',
    status: 'available',
    price: 45000,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub'],
    description: 'Spacious deluxe room with ocean view',
    floor: 2,
    images: ['/rooms/deluxe-1.jpg'],
  },
  {
    id: '4',
    number: '202',
    type: 'Deluxe',
    status: 'cleaning',
    price: 45000,
    capacity: 3,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar'],
    description: 'Deluxe room with pool view',
    floor: 2,
    images: ['/rooms/deluxe-2.jpg'],
  },
  {
    id: '5',
    number: '301',
    type: 'Suite',
    status: 'maintenance',
    price: 75000,
    capacity: 4,
    amenities: ['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub', 'Living Room'],
    description: 'Luxury suite with panoramic ocean view',
    floor: 3,
    images: ['/rooms/suite-1.jpg'],
  },
];

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3 w-3" />,
  TV: <Tv className="h-3 w-3" />,
  AC: <Snowflake className="h-3 w-3" />,
  'Mini Bar': <Coffee className="h-3 w-3" />,
  Bathtub: <Bath className="h-3 w-3" />,
  'Living Room': <Home className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
  Restaurant: <Utensils className="h-3 w-3" />,
  'Room Service': <Smartphone className="h-3 w-3" />,
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const itemsPerPage = 5;

  // Form State
  const [formData, setFormData] = useState<Partial<Room>>({
    number: '',
    type: 'Standard',
    status: 'available',
    price: 0,
    capacity: 2,
    amenities: [],
    description: '',
    floor: 1,
  });

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || room.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleAddRoom = () => {
    setEditingRoom(null);
    setFormData({
      number: '',
      type: 'Standard',
      status: 'available',
      price: 0,
      capacity: 2,
      amenities: [],
      description: '',
      floor: 1,
    });
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setFormData(room);
    setIsModalOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      setRooms(rooms.filter(r => r.id !== roomToDelete.id));
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRoom) {
      // Update
      setRooms(rooms.map(r => 
        r.id === editingRoom.id ? { ...r, ...formData } as Room : r
      ));
    } else {
      // Create
      const newRoom: Room = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData as Omit<Room, 'id'>,
        images: [],
      };
      setRooms([...rooms, newRoom]);
    }
    
    setIsModalOpen(false);
    setEditingRoom(null);
    setFormData({});
  };

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

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-foreground">
            Room Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-muted-foreground">
            Manage your hotel rooms, availability, and pricing
          </p>
        </div>
        <button
          onClick={handleAddRoom}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add New Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Rooms"
          value={rooms.length}
          color="blue"
        />
        <StatCard
          title="Available"
          value={rooms.filter(r => r.status === 'available').length}
          color="green"
        />
        <StatCard
          title="Occupied"
          value={rooms.filter(r => r.status === 'occupied').length}
          color="purple"
        />
        <StatCard
          title="Maintenance"
          value={rooms.filter(r => r.status === 'maintenance').length}
          color="red"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms by number or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card hover:bg-gray-50 dark:hover:bg-secondary transition">
            <Filter className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Rooms Table */}
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
                    No rooms found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                currentRooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-gray-100 dark:border-border/50 hover:bg-gray-50 dark:hover:bg-secondary/50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                          <BedDouble className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-foreground">
                            Room {room.number}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-muted-foreground">
                            ID: {room.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900 dark:text-foreground">
                      {room.type}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${getStatusDot(room.status)}`} />
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-foreground">
                      LKR {room.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-muted-foreground">
                      {room.capacity} {room.capacity === 1 ? 'Guest' : 'Guests'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-muted-foreground">
                      Floor {room.floor}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                        >
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
        {filteredRooms.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-border">
            <p className="text-sm text-gray-600 dark:text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRooms.length)} of{' '}
              {filteredRooms.length} rooms
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                    currentPage === page
                      ? 'bg-gold text-white'
                      : 'text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white dark:bg-card border-b border-gray-200 dark:border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary transition"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Room Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number || ''}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                    placeholder="e.g., 101"
                  />
                </div>

                {/* Room Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Room Type *
                  </label>
                  <select
                    required
                    value={formData.type || 'Standard'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Room['type'] })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                    placeholder="e.g., 25000"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Capacity (Guests) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                    placeholder="e.g., 2"
                  />
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Floor *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                    placeholder="e.g., 1"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                    Status *
                  </label>
                  <select
                    required
                    value={formData.status || 'available'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Room['status'] })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-1.5">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-border rounded-lg bg-white dark:bg-card text-gray-900 dark:text-foreground focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition resize-none"
                  placeholder="Describe the room features and view..."
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted-foreground mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {['WiFi', 'TV', 'AC', 'Mini Bar', 'Bathtub', 'Living Room', 'Parking', 'Restaurant', 'Room Service'].map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        formData.amenities?.includes(amenity)
                          ? 'bg-gold text-white'
                          : 'bg-gray-100 dark:bg-secondary text-gray-600 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-secondary/80'
                      }`}
                    >
                      {amenityIcons[amenity]}
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-gold text-white rounded-lg hover:bg-gold/90 transition shadow-sm"
                >
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && roomToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <AlertCircle className="h-8 w-8" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-foreground">
                Delete Room
              </h3>
            </div>
            <p className="text-gray-600 dark:text-muted-foreground mb-6">
              Are you sure you want to delete <strong>Room {roomToDelete.number}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-secondary rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, color }: { title: string; value: number; color: 'blue' | 'green' | 'purple' | 'red' }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
  };

  return (
    <div className={`rounded-2xl border ${colors[color]} p-6 shadow-sm`}>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}