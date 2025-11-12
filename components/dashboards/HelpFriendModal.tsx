

import React, { useState, useContext, useMemo } from 'react';
import type { Room, Filters, TenantUser } from '../../types';
import { RoomContext } from '../../contexts/RoomContext';
import { BookingContext } from '../../contexts/BookingContext';
import { MAX_PRICE } from '../../constants';
import SearchAndFilterBar from '../SearchAndFilterBar';
import RoomGrid from '../RoomGrid';

interface HelpFriendModalProps {
  currentUser: TenantUser;
  onClose: () => void;
  // Fix: Changed the return type to Promise<TenantUser> to align with the async data context function.
  onAddNewUser: (name: string, email: string) => Promise<TenantUser>;
}

const HelpFriendModal: React.FC<HelpFriendModalProps> = ({ currentUser, onClose, onAddNewUser }) => {
  const { rooms } = useContext(RoomContext);
  const { addBookingApplication } = useContext(BookingContext);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [message, setMessage] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    price: MAX_PRICE,
    amenities: [],
    rating: 0,
    minOccupancy: 1,
  });

  const filteredRooms = useMemo(() => rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = (room.pricing.nightly || Infinity) <= filters.price;
    const matchesRating = room.rating >= filters.rating;
    const matchesAmenities = filters.amenities.every(amenity => room.amenities.includes(amenity));
    const matchesOccupancy = room.maxOccupancy >= filters.minOccupancy;
    return matchesSearch && matchesPrice && matchesRating && matchesAmenities && matchesOccupancy;
  }), [rooms, searchTerm, filters]);
  
  // Fix: Made the function async to await the creation of a new user.
  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !friendName || !friendEmail) {
        alert("Please fill in all details for your friend.");
        return;
    }
    
    const totalGuests = numAdults + numChildren;
    if (totalGuests > selectedRoom.maxOccupancy) {
        alert(`The number of guests (${totalGuests}) exceeds the maximum occupancy of ${selectedRoom.maxOccupancy} for this room.`);
        return;
    }
    
    // Fix: Await the async user creation before proceeding.
    // 1. Create a new user for the friend
    const newFriendUser = await onAddNewUser(friendName, friendEmail);

    // 2. Create the booking application with referral info
    addBookingApplication({
        tenantId: newFriendUser.id,
        roomId: selectedRoom.id,
        messageToLandlord: message || `My friend, ${currentUser.name}, referred me to this place!`,
        referrerId: currentUser.id,
        numberOfAdults: numAdults,
        numberOfChildren: numChildren,
    });
    
    alert(`Booking application for ${friendName} has been sent successfully!`);
    onClose();
  };

  const renderContent = () => {
    if (selectedRoom) {
      // Step 2: Show Room Details and Friend Form
      const totalGuests = numAdults + numChildren;
      const occupancyExceeded = totalGuests > selectedRoom.maxOccupancy;

      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Left Side: Room Details */}
            <div className="flex flex-col h-full bg-slate-50 rounded-lg p-1">
                 <button onClick={() => setSelectedRoom(null)} className="flex-shrink-0 text-left text-sm font-semibold text-slate-600 hover:text-teal-600 mb-2 p-2 flex items-center group">
                    <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i>
                    Back to Search
                </button>
                <div className="flex-grow overflow-y-auto">
                    <img src={selectedRoom.imageUrl} alt={selectedRoom.name} className="w-full h-48 object-cover rounded-t-md" />
                    <div className="p-4">
                        <h3 className="text-2xl font-bold text-slate-800">{selectedRoom.name}</h3>
                        <p className="text-slate-500 mt-1">{selectedRoom.location}</p>
                        <p className="text-slate-700 mt-4">{selectedRoom.description}</p>
                    </div>
                </div>
            </div>
            {/* Right Side: Form */}
            <div className="flex flex-col h-full">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex-shrink-0">Book for a Friend</h3>
                <form onSubmit={handleReferralSubmit} className="flex-grow overflow-y-auto space-y-4 pr-2">
                    <div>
                        <label htmlFor="friend-name" className="block text-sm font-medium text-slate-700">Friend's Full Name</label>
                        <input type="text" id="friend-name" value={friendName} onChange={e => setFriendName(e.target.value)} required className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="John Doe"/>
                    </div>
                     <div>
                        <label htmlFor="friend-email" className="block text-sm font-medium text-slate-700">Friend's Email Address</label>
                        <input type="email" id="friend-email" value={friendEmail} onChange={e => setFriendEmail(e.target.value)} required className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="friend@example.com"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="numAdults" className="block text-sm font-medium text-slate-700">Adults</label>
                            <input type="number" id="numAdults" value={numAdults} onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                        </div>
                        <div>
                            <label htmlFor="numChildren" className="block text-sm font-medium text-slate-700">Children</label>
                            <input type="number" id="numChildren" value={numChildren} onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))} min="0" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                        </div>
                    </div>
                    <div className={`text-sm font-semibold ${occupancyExceeded ? 'text-red-600' : 'text-slate-600'}`}>
                        Total Guests: {totalGuests} / {selectedRoom.maxOccupancy}
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message to Landlord (Optional)</label>
                         <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={4} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Add a personal note..."></textarea>
                    </div>
                    <div className="pt-2 sticky bottom-0 bg-white pb-2">
                        <button type="submit" disabled={occupancyExceeded} className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition-colors disabled:bg-slate-400">
                            {occupancyExceeded ? 'Occupancy Exceeded' : 'Submit Referral Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      );
    }

    // Step 1: Show Search and Room Grid
    return (
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 mb-6">
          <SearchAndFilterBar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            <RoomGrid rooms={filteredRooms} onSelectRoom={setSelectedRoom} />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full h-full flex flex-col p-6">
        {/* Header */}
        <header className="flex-shrink-0 pb-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="fas fa-user-friends text-2xl text-teal-600"></i>
            <h1 className="text-2xl font-extrabold text-slate-800">Help a Friend Find a Place</h1>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </header>
        <main className="flex-grow pt-6 overflow-y-hidden">
            {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HelpFriendModal;