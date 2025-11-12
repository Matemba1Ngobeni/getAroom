

import React, { useState, useEffect, useContext } from 'react';
import type { Room } from '../types';
import { generateWelcomeMessage } from '../services/geminiService';
import type { Page } from '../App';
import { UserContext } from '../contexts/UserContext';
import { BookingContext } from '../contexts/BookingContext';

interface RoomDetailModalProps {
  room: Room;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onNavigate }) => {
  const { user } = useContext(UserContext);
  const { addBookingApplication } = useContext(BookingContext);
  const [bookingState, setBookingState] = useState<'idle' | 'confirm' | 'loading' | 'success' | 'error'>('idle');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  
  const totalGuests = numAdults + numChildren;
  const occupancyExceeded = totalGuests > room.maxOccupancy;

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleInitiateBooking = () => {
    if (user) {
      setBookingState('confirm');
    } else {
      onClose(); // Close the modal
      onNavigate('signup'); // Navigate to sign up page
    }
  };

  const handleConfirmBooking = async () => {
    if (occupancyExceeded) {
        alert(`The number of guests (${totalGuests}) exceeds the maximum occupancy of ${room.maxOccupancy} for this room.`);
        return;
    }
    setBookingState('loading');
    setErrorMessage('');
    try {
      if (user) {
        addBookingApplication({
            tenantId: user.id,
            roomId: room.id,
            numberOfAdults: numAdults,
            numberOfChildren: numChildren
        });
      }

      const message = await generateWelcomeMessage(room.name, room.location);
      setWelcomeMessage(message);
      setBookingState('success');
    } catch (error) {
      console.error('Failed to generate welcome message:', error);
      setErrorMessage('We couldn\'t process your booking at this time. Please try again.');
      setBookingState('error');
    }
  };
  
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`;

  const renderContent = () => {
    switch (bookingState) {
      case 'confirm':
        return (
          <div className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 text-center">Confirm Your Booking</h3>
            <div className="mt-6 text-left bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-3">
                <div>
                    <p className="text-sm font-semibold text-slate-500">Room</p>
                    <p className="text-lg font-bold text-slate-800">{room.name}</p>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-slate-500">Location</p>
                    <p className="text-slate-700">{room.location}</p>
                </div>
                 <div>
                    <p className="text-sm font-semibold text-slate-500">Price</p>
                    <p className="text-2xl font-extrabold text-teal-600">
                        {room.pricing.nightly ? `$${room.pricing.nightly}/night` : 'Price on request'}
                    </p>
                </div>
            </div>

            {/* Occupancy Form */}
            <div className="mt-6">
                <h4 className="text-lg font-semibold text-slate-800">Who is staying?</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                        <label htmlFor="numAdults" className="block text-sm font-medium text-slate-700">Adults</label>
                        <input type="number" id="numAdults" value={numAdults} onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))} min="1" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                    </div>
                    <div>
                        <label htmlFor="numChildren" className="block text-sm font-medium text-slate-700">Children</label>
                        <input type="number" id="numChildren" value={numChildren} onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))} min="0" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                    </div>
                </div>

                <div className={`mt-2 text-sm font-semibold ${occupancyExceeded ? 'text-red-600' : 'text-slate-600'}`}>
                    Total Guests: {totalGuests} / {room.maxOccupancy}
                </div>

                <div className="mt-4 text-xs text-slate-500 bg-slate-100 p-3 rounded-md border border-slate-200">
                    <p><i className="fas fa-info-circle mr-1"></i> Partners will receive access to the keyless entry app. Children's access can be managed via the trustee system after booking is confirmed.</p>
                </div>
            </div>

             <div className="mt-8 flex flex-col sm:flex-row gap-3">
                 <button
                    onClick={() => setBookingState('idle')}
                    className="w-full bg-slate-200 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors font-semibold order-2 sm:order-1"
                 >
                    Back
                 </button>
                 <button
                    onClick={handleConfirmBooking}
                    className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-semibold shadow-lg hover:shadow-xl order-1 sm:order-2 disabled:bg-slate-400 disabled:opacity-75"
                    disabled={!user || occupancyExceeded}
                 >
                    {occupancyExceeded ? 'Occupancy Exceeded' : (user ? 'Confirm Application' : 'Please Sign In')}
                 </button>
            </div>
          </div>  
        );
      case 'loading':
        return (
          <div className="text-center p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-4 text-slate-600 font-semibold">Generating your welcome message...</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center p-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Application Sent!</h3>
            <p className="mt-2 text-slate-600">Your request to book this room has been sent. You'll be notified of the landlord's decision.</p>
            <div className="mt-4 text-left bg-teal-50 p-4 rounded-lg border border-teal-200">
                <p className="text-slate-700 whitespace-pre-wrap">{welcomeMessage}</p>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        );
      case 'error':
         return (
          <div className="text-center p-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <i className="fas fa-times text-red-600 text-2xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Oops!</h3>
            <p className="mt-2 text-slate-600">{errorMessage}</p>
            <button
              onClick={() => setBookingState('confirm')}
              className="mt-6 w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
         );
      case 'idle':
      default:
        return (
          <>
            <div className="relative">
              <img src={room.imageUrl} alt={room.name} className="w-full h-64 object-cover" />
               <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <i className="fas fa-star text-yellow-300"></i> 
                    <span>{room.rating.toFixed(1)}</span>
                </div>
                 <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
                    <i className="fas fa-users text-white"></i> 
                    <span>Max {room.maxOccupancy} guests</span>
                </div>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-extrabold text-slate-900">{room.name}</h2>
              <div className="flex justify-between items-center mt-1">
                 <p className="text-md text-slate-500"><i className="fas fa-map-marker-alt mr-2 text-slate-400"></i>{room.location}</p>
                 <a 
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors flex items-center group"
                >
                    View on Map
                    <i className="fas fa-external-link-alt ml-2 text-xs transition-transform group-hover:scale-110"></i>
                </a>
              </div>
              <p className="text-slate-700 mt-4">{room.description}</p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-slate-800">Amenities</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {room.amenities.map(amenity => (
                    <span key={amenity} className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">{amenity}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-200 sticky bottom-0">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col items-start">
                        {room.pricing.nightly && <p className="text-2xl font-bold text-slate-800">${room.pricing.nightly}<span className="text-base font-normal text-slate-500">/night</span></p>}
                        {room.pricing.monthly && <p className="text-lg font-semibold text-slate-600">${room.pricing.monthly}<span className="text-sm font-normal text-slate-500">/month</span></p>}
                        {room.pricing.hourly && <p className="text-md font-medium text-slate-500">${room.pricing.hourly}<span className="text-xs font-normal text-slate-500">/hour</span></p>}
                    </div>
                    <button 
                        onClick={handleInitiateBooking}
                        className="bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-transform transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                        {user ? 'Book Now' : 'Sign Up to Book'}
                    </button>
                </div>
            </div>
          </>
        );
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative flex-grow overflow-y-auto">
         {renderContent()}
        </div>
         {(bookingState === 'idle' || bookingState === 'confirm') && (
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10">
              <i className="fas fa-times text-2xl"></i>
            </button>
         )}
      </div>
    </div>
  );
};

export default RoomDetailModal;