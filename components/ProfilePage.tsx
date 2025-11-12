

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { Page } from '../App';
import { ALL_ROOMS_MAP } from '../constants';
import type { TenantUser, LandlordUser, ServiceProviderUser, BookingHistoryEntry, ReviewOfLandlord } from '../types';
import { userService } from '../services/userService';
import RateLandlordModal from './dashboards/RateLandlordModal';

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

// Reusable StarRating component to display ratings visually
const StarRating: React.FC<{ rating: number | null, size?: string }> = ({ rating, size = 'text-xl' }) => {
    if (rating === null) return <span className="text-slate-500 text-sm">Not yet rated</span>;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
        <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(fullStars)].map((_, i) => <i key={`full-${i}`} className={`fas fa-star ${size}`}></i>)}
            {halfStar && <i className={`fas fa-star-half-alt ${size}`}></i>}
            {[...Array(emptyStars)].map((_, i) => <i key={`empty-${i}`} className={`far fa-star ${size}`}></i>)}
            <span className="ml-2 font-bold text-slate-700">{rating.toFixed(1)}</span>
        </div>
    );
};

// Renders profile sections specific to Tenants
const TenantProfileDetails: React.FC<{
    user: TenantUser,
    onRateLandlord: (booking: BookingHistoryEntry) => void
}> = ({ user, onRateLandlord }) => {
    const leasedRoom = user.leasedRoomId ? ALL_ROOMS_MAP.get(user.leasedRoomId) : null;
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="space-y-6">
            {leasedRoom && (
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Current Lease Details</h2>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h3 className="font-bold text-slate-800">{leasedRoom.name}</h3>
                        <p className="text-sm text-slate-500">{leasedRoom.location}</p>
                        <p className="text-sm text-slate-700 mt-2">
                            <span className="font-semibold">Lease Period:</span> {user.leaseStartDate ? new Date(user.leaseStartDate).toLocaleDateString() : 'N/A'} to {user.leaseEndDate ? new Date(user.leaseEndDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            )}
            <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Booking History</h2>
                 <div className="space-y-4">
                    {user.bookingHistory && user.bookingHistory.length > 0 ? user.bookingHistory.map((booking) => (
                        <div key={booking.bookingId} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                               <div>
                                    <h3 className="font-bold text-slate-800">{booking.roomName}</h3>
                                    <p className="text-sm text-slate-500">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                               </div>
                               {booking.reviewed ? (
                                    <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full"><i className="fas fa-check mr-2"></i>Review Submitted</span>
                               ) : new Date(booking.endDate) < new Date(today) ? (
                                    <button onClick={() => onRateLandlord(booking)} className="bg-teal-600 text-white font-semibold py-1 px-3 rounded-md hover:bg-teal-700 text-sm">
                                        Rate Landlord
                                    </button>
                               ) : (
                                    <span className="text-sm text-slate-500">Awaiting stay completion</span>
                               )}
                           </div>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-sm p-4 text-center">No past bookings.</p>
                    )}
                 </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Your Tenant Rating</h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                   <StarRating rating={user.rating} />
                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Feedback From Landlords</h2>
                 <div className="space-y-4">
                    {user.feedbackFromLandlords && user.feedbackFromLandlords.length > 0 ? user.feedbackFromLandlords.map((review, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                               <span className="font-bold text-slate-800">{review.landlordName}</span>
                               <StarRating rating={review.rating} size="text-md" />
                           </div>
                           <p className="text-slate-600 italic">"{review.comment}"</p>
                           <p className="text-xs text-slate-400 text-right mt-2">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-sm p-4 text-center">No feedback yet.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};


// Renders profile sections specific to Landlords
const renderLandlordProfileDetails = (user: LandlordUser) => {
    return (
        <div className="space-y-6">
             <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Managed Properties</h2>
                 <div className="space-y-4">
                    {user.managedProperties && user.managedProperties.length > 0 ? user.managedProperties.map(roomId => {
                        const room = ALL_ROOMS_MAP.get(roomId);
                        if (!room) return null;
                        return (
                            <div key={roomId} className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-4">
                                <img src={room.imageUrl} alt={room.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-slate-800">{room.name}</h3>
                                    <p className="text-sm text-slate-500">{room.location}</p>
                                </div>
                            </div>
                        );
                    }) : (
                        <p className="text-slate-500 text-sm p-4 text-center">You are not managing any properties yet.</p>
                    )}
                 </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Reviews From Tenants</h2>
                 <div className="space-y-4">
                    {user.reviews && user.reviews.length > 0 ? user.reviews.map((review, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                               <span className="font-bold text-slate-800">{review.tenantName}</span>
                               <StarRating rating={review.rating} size="text-md" />
                           </div>
                           <p className="text-slate-600 italic">"{review.comment}"</p>
                           <p className="text-xs text-slate-400 text-right mt-2">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-sm p-4 text-center">No reviews from tenants yet.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};

// Renders profile sections specific to Service Providers
const renderServiceProviderProfileDetails = (user: ServiceProviderUser) => {
     return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Service Performance</h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm font-medium text-slate-600 mb-2">Average Client Rating</p>
                    <StarRating rating={user.averageRating} />
                </div>
            </div>
             <div>
                <h2 className="text-lg font-semibold text-slate-700 border-b pb-2 mb-4">Client Feedback</h2>
                 <div className="space-y-4">
                    {user.serviceFeedback && user.serviceFeedback.length > 0 ? user.serviceFeedback.map((review, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                           <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-2">
                               <span className="font-bold text-slate-800">{review.clientName}</span>
                               <StarRating rating={review.rating} size="text-md" />
                           </div>
                           <p className="text-slate-600 italic">"{review.comment}"</p>
                           <p className="text-xs text-slate-400 text-right mt-2">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-sm p-4 text-center">No reviews yet.</p>
                    )}
                 </div>
            </div>
        </div>
    );
};


const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateUser } = useContext(UserContext);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryEntry | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    onNavigate('home');
    return null;
  }
  
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    
    await updateUser({ name, email });
    
    if (newPassword) {
        // In a real app, this would trigger Firebase Auth's password update flow
        console.log("Password update requested (mock).");
    }
    
    alert("Profile updated successfully!");
    onNavigate('dashboard');
  };

  const handleCancel = () => {
    onNavigate('dashboard');
  };

  const handleOpenRatingModal = (booking: BookingHistoryEntry) => {
    setSelectedBooking(booking);
    setRatingModalOpen(true);
  };
  
  const handleSubmitRating = async ({ rating, comment }: { rating: number, comment: string }) => {
    if (!selectedBooking || !user) return;

    const newReview: ReviewOfLandlord = {
        tenantId: user.id,
        tenantName: user.name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
    };

    await userService.addReviewToLandlord(selectedBooking.landlordId, newReview);

    const updatedHistory = (user as TenantUser).bookingHistory.map(b => 
        b.bookingId === selectedBooking.bookingId ? { ...b, reviewed: true } : b
    );
    await updateUser({ bookingHistory: updatedHistory });

    setRatingModalOpen(false);
    setSelectedBooking(null);
    alert('Thank you for your feedback!');
  };


  // Helper function to decide which details to render based on user type
  const renderUserDetails = () => {
    switch (user.userType) {
      case 'Student':
      case 'General Tenant':
        return <TenantProfileDetails user={user} onRateLandlord={handleOpenRatingModal} />;
      case 'Landlord':
        return renderLandlordProfileDetails(user as LandlordUser);
      case 'Service Provider':
        return renderServiceProviderProfileDetails(user as ServiceProviderUser);
      default:
        return null;
    }
  };

  return (
    <>
        <main className="flex-grow bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up">
            <div className="p-6 md:p-8">
                <div className="flex items-center space-x-4 mb-8">
                <i className="fas fa-user-circle text-5xl text-slate-400"></i>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800">Your Profile</h1>
                    <p className="text-slate-500">Update your personal information and password.</p>
                </div>
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Personal Information</h2>
                    <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-slate-700">Full Name</label>
                    <input
                        type="text"
                        id="full-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    </div>
                    <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    </div>
                </div>

                {/* User-specific details rendered here */}
                {renderUserDetails()}

                {/* Change Password */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-700 border-b pb-2">Change Password</h2>
                    <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    </div>
                    <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-slate-700">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    </div>
                    <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t mt-8">
                    <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-slate-100 text-slate-700 font-semibold py-2 px-6 rounded-md hover:bg-slate-200 transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
                    >
                    Save Changes
                    </button>
                </div>
                </form>
            </div>
            </div>
        </div>
        </main>
        {ratingModalOpen && selectedBooking && (
            <RateLandlordModal 
                booking={selectedBooking}
                onClose={() => setRatingModalOpen(false)}
                onSubmit={handleSubmitRating}
            />
        )}
    </>
  );
};

export default ProfilePage;
