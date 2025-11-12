
import React from 'react';
import type { Room } from '../types';
import RoomCard from './RoomCard';

interface RoomGridProps {
  rooms: Room[];
  onSelectRoom: (room: Room) => void;
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms, onSelectRoom }) => {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-search text-5xl text-gray-400 mb-4"></i>
        <h3 className="text-2xl font-semibold text-gray-700">No Rooms Found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onSelectRoom={onSelectRoom} />
      ))}
    </div>
  );
};

export default RoomGrid;
