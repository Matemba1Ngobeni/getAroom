import React, { useState } from 'react';
import type { Room } from '../types';

interface RoomCardProps {
  room: Room;
  onSelectRoom: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onSelectRoom }) => {
  const [isCopied, setIsCopied] = useState(false);

  const getDisplayPrice = () => {
    const { pricing } = room;
    if (pricing.nightly) {
      return <>${pricing.nightly} <span className="text-sm font-normal text-slate-500">/ night</span></>;
    }
    if (pricing.monthly) {
      return <>${pricing.monthly} <span className="text-sm font-normal text-slate-500">/ month</span></>;
    }
    if (pricing.hourly) {
        return <>${pricing.hourly} <span className="text-sm font-normal text-slate-500">/ hour</span></>;
    }
    return <span className="text-sm font-normal text-slate-500">Pricing not available</span>;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate a unique URL for the room
    const shareUrl = `${window.location.origin}${window.location.pathname}?room=${room.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link.');
    });
  };

  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-in-out cursor-pointer group animate-fade-in border border-transparent hover:border-slate-200"
      onClick={() => onSelectRoom(room)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
          <p className="text-white text-sm line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100 ease-in-out">
              {room.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200 ease-in-out">
              {room.amenities.slice(0, 3).map(amenity => (
              <span key={amenity} className="bg-white/30 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">{amenity}</span>
              ))}
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
          <i className="fas fa-star text-yellow-300"></i>
          <span>{room.rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-sm text-slate-500 mb-1">{room.location}</p>
        <h3 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-teal-600 transition-colors">{room.name}</h3>
        <div className="flex justify-between items-center">
            <p className="text-lg font-semibold text-slate-700">
              {getDisplayPrice()}
            </p>
            <button
              onClick={handleShare}
              title="Copy share link"
              aria-label={`Share ${room.name}`}
              className={`flex items-center text-sm font-semibold px-3 py-1.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                isCopied
                  ? 'bg-teal-100 text-teal-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isCopied ? (
                <>
                  <i className="fas fa-check mr-2"></i>
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <i className="fas fa-share-alt mr-2"></i>
                  <span>Share</span>
                </>
              )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;