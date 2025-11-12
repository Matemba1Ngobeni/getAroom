
import React, { useState } from 'react';
import type { ServiceProviderUser, FaultTicket } from '../../types';
import { ALL_ROOMS_MAP } from '../../constants';

interface ServiceProviderDashboardProps {
  user: ServiceProviderUser & {id: string, name: string}; // With mock data
  allTickets: FaultTicket[];
  onAddBid: (ticketId: string, bid: { serviceProviderId: string; serviceProviderName: string; amount: number; notes: string; }) => void;
  onMarkJobComplete: (ticketId: string) => void;
}

const ServiceProviderDashboard: React.FC<ServiceProviderDashboardProps> = ({ user, allTickets, onAddBid, onMarkJobComplete }) => {
  const [bidAmount, setBidAmount] = useState<{[key: string]: number}>({});
  const [bidNotes, setBidNotes] = useState<{[key: string]: string}>({});

  const availableJobs = allTickets.filter(ticket =>
    (ticket.status === 'Reported') &&
    user.services.includes(ticket.category as any) &&
    !ticket.bids.some(b => b.serviceProviderId === user.id) // Don't show if already bid
  );
  
  const activeJobs = allTickets.filter(ticket =>
    ticket.status === 'In Progress' && ticket.bids.some(b => b.serviceProviderId === user.id)
  );

  const handleBidSubmit = (ticketId: string) => {
    const amount = bidAmount[ticketId];
    const notes = bidNotes[ticketId] || '';
    if (!amount || amount <= 0) {
        alert("Please enter a valid bid amount.");
        return;
    };
    onAddBid(ticketId, {
        serviceProviderId: user.id,
        serviceProviderName: user.name,
        amount,
        notes,
    });
    // Clear form
    setBidAmount(prev => ({...prev, [ticketId]: 0}));
    setBidNotes(prev => ({...prev, [ticketId]: ''}));
  };

  return (
    <div className="animate-fade-in-up space-y-8">
      <header className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Welcome, {user.name}!</h1>
        <p className="mt-2 text-slate-600">Welcome to your Service Provider Dashboard. Find jobs and manage your services.</p>
      </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Active Jobs */}
            <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Active Jobs</h2>
                <div className="p-6 space-y-4">
                    {activeJobs.length > 0 ? activeJobs.map(job => (
                        <div key={job.id} className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                            <p className="font-semibold text-slate-800">{ALL_ROOMS_MAP.get(job.roomId)?.location || 'Unknown Location'}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">{job.category}:</span> {job.description}</p>
                            <div className="mt-3 text-right">
                                <button onClick={() => onMarkJobComplete(job.id)} className="bg-blue-600 text-white font-semibold px-4 py-2 text-sm rounded-md hover:bg-blue-700 transition-colors">
                                    Mark as Complete
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-500 text-center py-8">You have no active jobs.</p>
                    )}
                </div>
            </div>
            
            {/* Job Board */}
            <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Job Board</h2>
                <div className="p-6 space-y-4">
                    {availableJobs.length > 0 ? availableJobs.map(job => (
                        <div key={job.id} className="border border-slate-200 rounded-lg p-4">
                            <p className="font-semibold text-slate-800">{ALL_ROOMS_MAP.get(job.roomId)?.location || 'Unknown Location'}</p>
                            <p className="text-sm text-slate-600"><span className="font-semibold">{job.category}:</span> {job.description}</p>
                            <div className="mt-3 flex gap-2 items-center">
                                <input 
                                        type="number"
                                        placeholder="Bid amount ($)"
                                        value={bidAmount[job.id] || ''}
                                        onChange={e => setBidAmount(prev => ({...prev, [job.id]: parseFloat(e.target.value)}))}
                                        className="w-32 border-slate-300 rounded-md shadow-sm text-sm focus:ring-teal-500 focus:border-teal-500"
                                />
                                <input
                                        type="text"
                                        placeholder="Optional notes"
                                        value={bidNotes[job.id] || ''}
                                        onChange={e => setBidNotes(prev => ({...prev, [job.id]: e.target.value}))}
                                        className="flex-grow border-slate-300 rounded-md shadow-sm text-sm focus:ring-teal-500 focus:border-teal-500"
                                />
                                <button onClick={() => handleBidSubmit(job.id)} className="bg-teal-600 text-white font-semibold px-4 py-2 text-sm rounded-md hover:bg-teal-700 transition-colors">
                                    Place Bid
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12">
                            <i className="fas fa-tools text-4xl text-slate-400"></i>
                            <h3 className="mt-4 text-lg font-semibold text-slate-700">No available jobs.</h3>
                            <p className="mt-1 text-sm text-slate-500">We'll notify you when a new job matching your services is posted.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        <div className="space-y-8">
            <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Your Offered Services</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                    {user.services.map(service => (
                        <span key={service} className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">{service}</span>
                    ))}
                </div>
                 <div className="mt-6">
                    <h3 className="font-semibold text-slate-700">Profile Management</h3>
                     <ul className="mt-2 space-y-2 text-teal-600 font-medium text-sm">
                        <li><a href="#" className="hover:underline">Edit Your Services</a></li>
                        <li><a href="#" className="hover:underline">Update Contact Info</a></li>
                        <li><a href="#" className="hover:underline">View Ratings</a></li>
                    </ul>
                </div>
            </div>
             <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Complaint Center</h2>
                    <p className="text-sm text-slate-500">Manage or file complaints regarding tenants or landlords.</p>
                    <button className="mt-3 text-sm font-semibold text-teal-600 hover:text-teal-700">View Complaints</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDashboard;
