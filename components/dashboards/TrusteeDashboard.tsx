
import React, { useState } from 'react';
import type { TrusteeUser, FaultTicket, FaultCategory } from '../../types';
import { ALL_ROOMS_MAP, MOCK_LANDLORD_ID } from '../../constants';

interface TrusteeDashboardProps {
    user: TrusteeUser;
    onAddTicket: (ticket: Omit<FaultTicket, 'id' | 'reportedAt' | 'status' | 'bids' | 'tenantConfirmedResolved' | 'landlordConfirmedResolved'>) => void;
}

const TrusteeDashboard: React.FC<TrusteeDashboardProps> = ({ user, onAddTicket }) => {
    const { tenantInTrust } = user;
    const leasedRoom = tenantInTrust.leasedRoomId ? ALL_ROOMS_MAP.get(tenantInTrust.leasedRoomId) : null;
    const [doorStatus, setDoorStatus] = useState<'Locked' | 'Unlocked'>('Locked');
    const [isFaultModalOpen, setIsFaultModalOpen] = useState(false);
    const [faultDescription, setFaultDescription] = useState('');
    const [faultCategory, setFaultCategory] = useState<FaultCategory>('General Repairs');

    const toggleDoor = () => {
        const newStatus = doorStatus === 'Locked' ? 'Unlocked' : 'Locked';
        setDoorStatus(newStatus);
        alert(`Door for "${leasedRoom?.name}" is now ${newStatus}.`);
    };

    const handleFaultSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!faultDescription || !leasedRoom) return;
        onAddTicket({
          roomId: leasedRoom.id,
          tenantId: tenantInTrust.id,
          landlordId: MOCK_LANDLORD_ID, // This would be dynamic in a real app
          description: faultDescription,
          category: faultCategory,
        });
        setFaultDescription('');
        setFaultCategory('General Repairs');
        setIsFaultModalOpen(false);
        alert(`Fault reported successfully for ${tenantInTrust.name}.`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="bg-white shadow-sm rounded-lg p-6">
                <h1 className="text-3xl font-extrabold text-slate-800">Welcome, {user.name}!</h1>
                <p className="mt-2 text-slate-600">You are logged in as a trustee for <span className="font-semibold text-teal-600">{tenantInTrust.name}</span>.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {leasedRoom ? (
                        <div className="bg-white shadow-sm rounded-lg">
                            <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Keyless Entry Access</h2>
                            <div className="p-6 flex flex-col sm:flex-row items-center justify-center gap-8">
                                <div className="text-center">
                                    <button
                                        onClick={toggleDoor}
                                        className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                                            doorStatus === 'Locked' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                    >
                                        <i className={`fas ${doorStatus === 'Locked' ? 'fa-lock' : 'fa-lock-open'} text-white text-5xl`}></i>
                                        <div className="absolute inset-0 rounded-full ring-4 ring-offset-4 ring-offset-white ring-slate-200"></div>
                                    </button>
                                    <p className={`mt-4 text-2xl font-bold ${doorStatus === 'Locked' ? 'text-red-600' : 'text-green-600'}`}>
                                        {doorStatus}
                                    </p>
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-sm text-slate-500">Access for:</p>
                                    <h3 className="text-2xl font-bold text-slate-800">{leasedRoom.name}</h3>
                                    <p className="text-md text-slate-600">{leasedRoom.location}</p>
                                    <p className="mt-2 text-xs text-slate-400 bg-slate-50 p-2 rounded-md border">This function remotely controls the door lock for {tenantInTrust.name}'s room.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white shadow-sm rounded-lg p-8 text-center">
                           <i className="fas fa-info-circle text-3xl text-slate-400 mb-3"></i>
                           <h3 className="font-semibold text-slate-700">{tenantInTrust.name} does not currently have a leased room.</h3>
                           <p className="text-sm text-slate-500">Keyless entry and other features will be available once they have an active lease.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                        <button 
                            onClick={() => setIsFaultModalOpen(true)} 
                            disabled={!leasedRoom}
                            className="w-full bg-teal-600 text-white font-semibold py-3 rounded-md hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <i className="fas fa-wrench"></i> Report a Fault
                        </button>
                    </div>
                </div>
            </div>

             {/* Report Fault Modal */}
            {isFaultModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleFaultSubmit} className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">Report Fault for {tenantInTrust.name}</h2>
                                <button type="button" onClick={() => setIsFaultModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                <select value={faultCategory} onChange={(e) => setFaultCategory(e.target.value as FaultCategory)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                    <option>General Repairs</option><option>Plumbing</option><option>Electrical</option><option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                <textarea rows={4} value={faultDescription} onChange={e => setFaultDescription(e.target.value)} required placeholder="e.g., The bathroom sink is clogged." className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-md hover:bg-teal-700">Submit Ticket</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrusteeDashboard;
