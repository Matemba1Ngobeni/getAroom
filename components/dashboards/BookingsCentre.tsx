

import React, { useState } from 'react';
import type { BookingApplication, TenantUser } from '../../types';
import { ALL_ROOMS_MAP, ALL_USERS_MAP } from '../../constants';

interface BookingsCentreProps {
    bookings: BookingApplication[];
    onUpdateBookingStatus: (bookingId: string, status: 'Approved' | 'Rejected') => void;
    allApplicants: TenantUser[];
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const BookingsCentre: React.FC<BookingsCentreProps> = ({ bookings, onUpdateBookingStatus, allApplicants }) => {
    const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    
    const applicantsMap = new Map(allApplicants.map(t => [t.id, t]));
    const selectedTenant = selectedTenantId ? applicantsMap.get(selectedTenantId) : null;
    const pendingBookings = bookings.filter(b => b.status === 'Pending');

    const handleChat = (tenantId: string) => {
        setSelectedTenantId(tenantId);
        setIsChatModalOpen(true);
    };

    const handleSendEmail = (e: React.FormEvent) => {
        e.preventDefault();
        const message = (e.target as HTMLFormElement).message.value;
        if (selectedTenant) {
            alert(`Simulating sending email to ${selectedTenant.email}:\n\n"${message}"`);
        }
        setIsChatModalOpen(false);
        setSelectedTenantId(null);
    }

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Bookings Centre</h2>
            <div className="p-6 space-y-4">
                {pendingBookings.length > 0 ? pendingBookings.map(booking => {
                    const tenant = applicantsMap.get(booking.tenantId);
                    const room = ALL_ROOMS_MAP.get(booking.roomId);
                    const referrer = booking.referrerId ? ALL_USERS_MAP.get(booking.referrerId) : null;

                    if (!tenant || !room) return null;

                    const totalGuests = booking.numberOfAdults + booking.numberOfChildren;
                    const occupancyExceeded = totalGuests > room.maxOccupancy;

                    return (
                        <div key={booking.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <img src={room.imageUrl} alt={room.name} className="w-full sm:w-32 h-32 sm:h-auto object-cover rounded-md" />
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800">{tenant.name}</h3>
                                            <p className="text-sm text-slate-500">Applied for: <span className="font-semibold">{room.name}</span></p>
                                            <p className="text-sm text-slate-500">
                                                Guests: <span className="font-semibold">{totalGuests}</span> ({booking.numberOfAdults} adults, {booking.numberOfChildren} children)
                                            </p>
                                        </div>
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[booking.status]}`}>{booking.status}</span>
                                    </div>
                                    {booking.messageToLandlord && (
                                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-md border italic">"{booking.messageToLandlord}"</p>
                                    )}
                                    {referrer && (
                                        <p className="text-xs text-teal-700 mt-2 bg-teal-50 p-2 rounded-md border border-teal-200">
                                            <i className="fas fa-user-friends mr-2"></i>
                                            Referred by: <span className="font-semibold">{referrer.name}</span>
                                        </p>
                                    )}
                                    {occupancyExceeded && (
                                        <div className="text-xs font-bold text-red-700 mt-2 bg-red-100 p-2 rounded-md border border-red-200">
                                            <i className="fas fa-exclamation-triangle mr-2"></i>
                                            Exceeds max occupancy of {room.maxOccupancy}!
                                        </div>
                                    )}
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button onClick={() => setSelectedTenantId(tenant.id)} className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-300">View Profile</button>
                                        <button onClick={() => handleChat(tenant.id)} className="text-xs font-semibold bg-slate-200 text-slate-700 px-3 py-1 rounded-md hover:bg-slate-300">Chat (Email)</button>
                                        <button onClick={() => onUpdateBookingStatus(booking.id, 'Approved')} className="text-xs font-semibold bg-green-200 text-green-800 px-3 py-1 rounded-md hover:bg-green-300">Approve</button>
                                        <button onClick={() => onUpdateBookingStatus(booking.id, 'Rejected')} className="text-xs font-semibold bg-red-200 text-red-800 px-3 py-1 rounded-md hover:bg-red-300">Reject</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <p className="text-slate-500 text-center py-8">No pending booking applications.</p>
                )}
            </div>
            
            {/* Tenant Profile Modal */}
            {selectedTenant && !isChatModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTenantId(null)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-slate-800">{selectedTenant.name}</h3>
                        <p className="text-slate-500">{selectedTenant.email}</p>
                        <p className="mt-4 text-sm">This is a placeholder for the tenant's profile, which would include their rating, booking history, and reviews.</p>
                         <button onClick={() => setSelectedTenantId(null)} className="mt-4 w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700">Close</button>
                    </div>
                 </div>
            )}
             {/* Chat Modal */}
            {isChatModalOpen && selectedTenant && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setIsChatModalOpen(false)}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold text-slate-800">Send Email to {selectedTenant.name}</h3>
                        <form onSubmit={handleSendEmail} className="mt-4 space-y-4">
                             <textarea name="message" rows={5} required className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Your message..."></textarea>
                             <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsChatModalOpen(false)} className="bg-slate-200 text-slate-800 font-semibold px-4 py-2 rounded-md">Cancel</button>
                                <button type="submit" className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md">Send</button>
                             </div>
                        </form>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default BookingsCentre;