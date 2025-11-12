


import React, { useState, useContext } from 'react';
import type { TenantUser, FaultTicket, Announcement, FaultCategory, Complaint, Trustee, TimeManagerEvent, Goal, GoalTask, BookingApplication } from '../../types';
import type { Page } from '../../App';
import { ALL_ROOMS_MAP, MOCK_LANDLORD_ID } from '../../constants';
import LeaseStatus from './LeaseStatus';
import ComplaintSystem from './ComplaintSystem';
import TrusteeManager from './TrusteeManager';
import TimeManagerDashboard from './TimeManagerDashboard';
import NearbyPlaces from './NearbyPlaces';
import HelpFriendModal from './HelpFriendModal';
import { BookingContext } from '../../contexts/BookingContext';

interface TenantDashboardProps {
  user: TenantUser;
  tickets: FaultTicket[];
  announcements: Announcement[];
  complaints: Complaint[];
  bookings: BookingApplication[];
  allTenants: TenantUser[];
  onAddTicket: (ticket: Omit<FaultTicket, 'id' | 'reportedAt' | 'status' | 'bids' | 'tenantConfirmedResolved' | 'landlordConfirmedResolved'>) => void;
  onAddComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
  onAddTrustee: (trustee: Omit<Trustee, 'id'>) => void;
  onRemoveTrustee: (trusteeId: string) => void;
  onAddEvent: (event: Omit<TimeManagerEvent, 'id'>) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddGoal: (goal: Omit<Goal, 'id' | 'tasks'> & { tasks: Omit<GoalTask, 'id' | 'completed'>[] }) => void;
  onToggleGoalTask: (goalId: string, taskId: string) => void;
  onConfirmResolution: (ticketId: string) => void;
  onRequestLeaseExtension: (tenantId: string, requestedEndDate: string) => void;
  // Fix: Changed the return type to Promise<TenantUser> to match the async function from the context.
  onAddNewUser: (name: string, email: string) => Promise<TenantUser>;
  onNavigate: (page: Page) => void;
}

const statusColors = {
  Reported: 'bg-red-100 text-red-800',
  'Pending Approval': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Pending Confirmation': 'bg-orange-100 text-orange-800',
  Resolved: 'bg-green-100 text-green-800',
};

const bookingStatusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Approved: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const ActionCard: React.FC<{ icon: string; title: string; onClick?: () => void; }> = ({ icon, title, onClick }) => (
    <button onClick={onClick} className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left w-full border border-slate-200">
        <div className="flex items-center">
            <div className="flex-shrink-0 h-12 w-12 rounded-md bg-teal-50 flex items-center justify-center text-teal-600 group-hover:bg-teal-100 transition-colors">
                <i className={`fas ${icon} text-xl`}></i>
            </div>
            <div className="ml-4">
                <h3 className="text-md font-semibold text-slate-800">{title}</h3>
            </div>
        </div>
    </button>
);


const TenantDashboard: React.FC<TenantDashboardProps> = ({ 
    user, tickets, announcements, complaints, bookings, allTenants,
    onAddTicket, onAddComplaint, onAddTrustee, onRemoveTrustee, 
    onAddEvent, onDeleteEvent, onAddGoal, onToggleGoalTask,
    onConfirmResolution, onRequestLeaseExtension, onAddNewUser, onNavigate 
}) => {
  const { addBookingApplication } = useContext(BookingContext);
  const leasedRoom = user.leasedRoomId ? ALL_ROOMS_MAP.get(user.leasedRoomId) : null;
  const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);
  const [isTimeManagerOpen, setIsTimeManagerOpen] = useState(false);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [isHelpFriendModalOpen, setIsHelpFriendModalOpen] = useState(false);
  const [faultDescription, setFaultDescription] = useState('');
  const [faultCategory, setFaultCategory] = useState<FaultCategory>('General Repairs');

  const handleFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faultDescription || !leasedRoom) return;
    onAddTicket({
      roomId: leasedRoom.id,
      tenantId: user.id,
      landlordId: MOCK_LANDLORD_ID,
      description: faultDescription,
      category: faultCategory,
    });
    setFaultDescription('');
    setFaultCategory('General Repairs');
    setIsFaultModalOpen(false);
  };
  
  const handleLeaseExtensionRequest = () => {
    if(!user.leaseEndDate) return;
    const currentEndDate = new Date(user.leaseEndDate);
    const requestedEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 6)).toISOString().split('T')[0]; // Request 6 more months
    onRequestLeaseExtension(user.id, requestedEndDate);
    setIsLeaseModalOpen(false);
  }

  return (
    <div className="animate-fade-in-up space-y-8">
      {/* Header Section */}
      <header className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Hello, {user.name}!</h1>
                <p className="mt-2 text-slate-600">Ready to find your next stay? Let's get started.</p>
            </div>
            {leasedRoom && (
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-semibold text-slate-500">Your Current Room</p>
                    <p className="text-lg font-bold text-teal-600">{leasedRoom.name}</p>
                </div>
            )}
        </div>
      </header>

      {/* Lease Status */}
      {leasedRoom && user.leaseEndDate && <LeaseStatus user={user} />}
      
      {/* Quick Actions */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard icon="fa-wrench" title="Report a Fault" onClick={() => setIsFaultModalOpen(true)} />
          <ActionCard icon="fa-user-friends" title="Help a Friend Find a Place" onClick={() => setIsHelpFriendModalOpen(true)} />
          <ActionCard icon="fa-clock" title="Manage My Time" onClick={() => setIsTimeManagerOpen(true)} />
          <ActionCard icon="fa-search" title="Find a New Room" onClick={() => onNavigate('home')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
            {/* Landlord Warnings */}
            {user.warnings.length > 0 && (
                 <div className="bg-white shadow-sm rounded-lg">
                    <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200 flex items-center">
                        <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i> Landlord Warnings
                    </h2>
                    <div className="p-6 space-y-3">
                        {user.warnings.map((warning, index) => (
                             <div key={index} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                                {warning}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Your Tickets Section */}
            <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Your Active Tickets</h2>
                {tickets.length > 0 ? (
                    <div className="p-6 space-y-3">
                        {tickets.map(ticket => (
                            <div key={ticket.id} className="text-sm p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-slate-700">{ticket.category}</p>
                                        <p className="text-slate-600">{ticket.description.substring(0, 70)}{ticket.description.length > 70 ? '...' : ''}</p>
                                    </div>
                                    <span className={`ml-4 flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                </div>
                                {ticket.status === 'Pending Confirmation' && (
                                    <div className="mt-2 text-right border-t pt-2">
                                        {ticket.tenantConfirmedResolved ? (
                                            <p className="text-green-600 font-semibold text-xs">You have confirmed resolution.</p>
                                        ) : (
                                            <button onClick={() => onConfirmResolution(ticket.id)} className="bg-teal-600 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-teal-700">Confirm Issue is Resolved</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                     <p className="p-6 text-slate-500 text-center">You have no active fault tickets.</p>
                )}
            </div>

             {/* Application Status Section */}
            {bookings.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg">
                    <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Your Applications</h2>
                    <div className="p-6 space-y-3">
                        {bookings.map(booking => (
                            <div key={booking.id} className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <p className="font-semibold text-slate-700">Application for: {ALL_ROOMS_MAP.get(booking.roomId)?.name}</p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bookingStatusColors[booking.status]}`}>{booking.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Complaint System */}
            <ComplaintSystem user={user} complaints={complaints} onAddComplaint={onAddComplaint} />

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
            {/* Nearby Places */}
            <NearbyPlaces />

            {/* Announcements */}
            <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Announcements</h2>
                <div className="p-6 space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                            <p className="font-bold text-cyan-900">{ann.title} <span className="text-sm font-medium text-cyan-700 ml-2">- {ann.author}</span></p>
                            <p className="mt-1 text-sm text-cyan-800">{ann.content}</p>
                        </div>
                    ))}
                </div>
            </div>
          
           {/* Trustee Manager */}
           <TrusteeManager 
                currentTrustees={user.trustees}
                onAddTrustee={onAddTrustee} 
                onRemoveTrustee={onRemoveTrustee} 
            />
        </div>
      </div>
      
      {/* Report Fault Modal */}
      {isFaultModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleFaultSubmit} className="p-6 space-y-4">
                     <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Report a Fault</h2>
                        <button type="button" onClick={() => setIsFaultModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <i className="fas fa-times text-xl"></i>
                        </button>
                     </div>
                    <div>
                        <label htmlFor="fault-category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select 
                            id="fault-category"
                            value={faultCategory}
                            onChange={(e) => setFaultCategory(e.target.value as FaultCategory)}
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        >
                            <option>General Repairs</option>
                            <option>Plumbing</option>
                            <option>Electrical</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="fault-description" className="block text-sm font-medium text-slate-700 mb-1">Description of Issue</label>
                        <textarea 
                        id="fault-description"
                        rows={4}
                        value={faultDescription}
                        onChange={e => setFaultDescription(e.target.value)}
                        placeholder="e.g., The bathroom sink is clogged."
                        className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        ></textarea>
                    </div>
                    <button type="submit" disabled={!leasedRoom || !faultDescription} className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-md hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                        {leasedRoom ? 'Submit Ticket' : 'You must have a leased room to submit a ticket'}
                    </button>
                </form>
            </div>
        </div>
      )}

    {isTimeManagerOpen && (
        <TimeManagerDashboard
            events={user.events}
            goals={user.goals}
            onAddEvent={onAddEvent}
            onDeleteEvent={onDeleteEvent}
            onAddGoal={onAddGoal}
            onToggleGoalTask={onToggleGoalTask}
            onClose={() => setIsTimeManagerOpen(false)}
        />
    )}

    {/* Manage Lease Modal */}
    {isLeaseModalOpen && leasedRoom && (
         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-800">Manage Your Lease</h2>
                    <button type="button" onClick={() => setIsLeaseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div className="space-y-3 text-sm">
                    <p><span className="font-semibold">Property:</span> {leasedRoom.name}</p>
                    <p><span className="font-semibold">Lease Starts:</span> {user.leaseStartDate}</p>
                    <p><span className="font-semibold">Lease Ends:</span> {user.leaseEndDate}</p>
                    <p><span className="font-semibold">Rent:</span> ${user.rentAmount}/month</p>
                </div>
                <div className="mt-6 border-t pt-4">
                    {user.leaseExtensionRequest ? (
                        <div>
                            <p className="font-semibold text-slate-700">Lease Extension Status: 
                                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${bookingStatusColors[user.leaseExtensionRequest.status]}`}>
                                    {user.leaseExtensionRequest.status}
                                </span>
                            </p>
                            {user.leaseExtensionRequest.status === 'Pending' && <p className="text-xs text-slate-500 mt-1">Your landlord has been notified of your request.</p>}
                            {user.leaseExtensionRequest.status === 'Approved' && <p className="text-xs text-green-600 mt-1">Your lease has been successfully extended!</p>}
                        </div>
                    ) : (
                        <button onClick={handleLeaseExtensionRequest} className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-md hover:bg-teal-700 transition-colors">
                            Request 6-Month Extension
                        </button>
                    )}
                </div>
            </div>
        </div>
    )}

    {isHelpFriendModalOpen && (
        <HelpFriendModal
            currentUser={user}
            onClose={() => setIsHelpFriendModalOpen(false)}
            onAddNewUser={onAddNewUser}
        />
    )}
    </div>
  );
};

export default TenantDashboard;