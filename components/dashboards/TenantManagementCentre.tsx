
import React, { useState } from 'react';
import type { TenantUser, Complaint } from '../../types';
import { ALL_ROOMS_MAP } from '../../constants';

interface TenantManagementCentreProps {
    tenants: TenantUser[];
    complaints: Complaint[];
    onIssueWarning: (tenantId: string, warningMessage: string) => void;
    onTerminateLease: (tenantId: string) => void;
    onUpdateLeaseExtension: (tenantId: string, status: 'Approved' | 'Rejected') => void;
    onRateTenant: (tenantId: string, newRating: number) => void;
}

const rentStatusColors = {
    Paid: 'bg-green-100 text-green-800',
    Overdue: 'bg-red-100 text-red-800',
};

const leaseExtensionStatusColors = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
};

const StarRatingInput: React.FC<{ rating: number | null, onRate: (rating: number) => void }> = ({ rating, onRate }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const displayRating = hoverRating || rating || 0;
    
    return (
        <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
            {[...Array(5)].map((_, i) => (
                <i 
                    key={i} 
                    className={`fas fa-star text-2xl transition-colors cursor-pointer ${i < displayRating ? 'text-yellow-400' : 'text-slate-300'}`}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onClick={() => onRate(i + 1)}
                />
            ))}
             <span className="ml-2 font-bold text-slate-700">{rating ? rating.toFixed(1) : 'N/A'}</span>
        </div>
    );
};

const TenantManagementCentre: React.FC<TenantManagementCentreProps> = ({ tenants, complaints, onIssueWarning, onTerminateLease, onUpdateLeaseExtension, onRateTenant }) => {
    const [selectedTenant, setSelectedTenant] = useState<TenantUser | null>(null);
    const [warningMessage, setWarningMessage] = useState('');

    const handleIssueWarning = () => {
        if (selectedTenant && warningMessage) {
            const fullMessage = `${warningMessage} (Issued on: ${new Date().toLocaleDateString()})`;
            onIssueWarning(selectedTenant.id, fullMessage);
            setWarningMessage('');
        }
    };
    
    const tenantComplaints = selectedTenant 
        ? complaints.filter(c => c.filedById === selectedTenant.id || c.filedAgainst.id === selectedTenant.id) 
        : [];

    return (
        <>
            <div className="bg-white shadow-sm rounded-lg">
                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Tenant Management Centre</h2>
                <div className="p-6">
                    {tenants.length > 0 ? (
                        <div className="divide-y divide-slate-200">
                            {tenants.map(tenant => {
                                const room = tenant.leasedRoomId ? ALL_ROOMS_MAP.get(tenant.leasedRoomId) : null;
                                return (
                                    <div key={tenant.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <p className="font-bold text-slate-800">{tenant.name}</p>
                                            <p className="text-sm text-slate-500">In: {room?.name || 'Unknown Property'}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${rentStatusColors[tenant.rentStatus]}`}>
                                                Rent {tenant.rentStatus}
                                            </span>
                                            <button onClick={() => setSelectedTenant(tenant)} className="bg-teal-600 text-white font-semibold px-4 py-2 text-sm rounded-md hover:bg-teal-700 transition-colors">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">You have no current tenants.</p>
                    )}
                </div>
            </div>

            {/* Tenant Management Modal */}
            {selectedTenant && (
                <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-800">{selectedTenant.name}</h2>
                            <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-slate-600"><i className="fas fa-times text-xl"></i></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-6">
                            {/* Lease & Rent Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Lease Details</h3>
                                    <p className="text-sm"><span className="font-medium">Period:</span> {new Date(selectedTenant.leaseStartDate!).toLocaleDateString()} - {new Date(selectedTenant.leaseEndDate!).toLocaleDateString()}</p>
                                    <p className="text-sm"><span className="font-medium">Rent:</span> ${selectedTenant.rentAmount}/month</p>
                                    <p className="text-sm"><span className="font-medium">Next Due:</span> {new Date(selectedTenant.rentDueDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Emergency Contacts</h3>
                                    {selectedTenant.trustees.length > 0 ? selectedTenant.trustees.map(t => (
                                        <p key={t.id} className="text-sm">{t.name}</p>
                                    )) : <p className="text-sm text-slate-500">No trustees listed.</p>}
                                </div>
                            </div>

                             {/* Lease Extension Request */}
                            {selectedTenant.leaseExtensionRequest && (
                                <div>
                                    <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Lease Extension Request</h3>
                                    <div className="bg-slate-50 p-3 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="text-sm">Requested End Date: {new Date(selectedTenant.leaseExtensionRequest.requestedEndDate).toLocaleDateString()}</p>
                                            <span className={`px-2 py-0.5 mt-1 inline-block text-xs font-semibold rounded-full ${leaseExtensionStatusColors[selectedTenant.leaseExtensionRequest.status]}`}>
                                                {selectedTenant.leaseExtensionRequest.status}
                                            </span>
                                        </div>
                                        {selectedTenant.leaseExtensionRequest.status === 'Pending' && (
                                            <div className="flex gap-2">
                                                <button onClick={() => onUpdateLeaseExtension(selectedTenant.id, 'Approved')} className="bg-green-600 text-white font-semibold px-3 py-1 text-xs rounded-md">Approve</button>
                                                <button onClick={() => onUpdateLeaseExtension(selectedTenant.id, 'Rejected')} className="bg-red-600 text-white font-semibold px-3 py-1 text-xs rounded-md">Decline</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                             {/* Rate Tenant */}
                            <div>
                                <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Rate This Tenant</h3>
                                <StarRatingInput rating={selectedTenant.rating} onRate={(r) => onRateTenant(selectedTenant.id, r)} />
                            </div>

                             {/* Complaint History */}
                             <div>
                                <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Complaint History</h3>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {tenantComplaints.length > 0 ? tenantComplaints.map(c => (
                                        <div key={c.id} className={`p-2 rounded-md text-xs ${c.filedById === selectedTenant.id ? 'bg-yellow-50' : 'bg-red-50'}`}>
                                            <p className="font-semibold">{c.filedById === selectedTenant.id ? 'Filed by Tenant:' : 'Filed against Tenant:'}</p>
                                            <p>{c.reason}</p>
                                        </div>
                                    )) : <p className="text-sm text-slate-500">No complaint history.</p>}
                                </div>
                             </div>

                             {/* Actions */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Issue a Warning</h3>
                                    <div className="flex gap-2">
                                        <input type="text" value={warningMessage} onChange={e => setWarningMessage(e.target.value)} placeholder="Reason for warning..." className="flex-grow border-slate-300 rounded-md shadow-sm sm:text-sm"/>
                                        <button onClick={handleIssueWarning} className="bg-yellow-500 text-white font-semibold px-4 py-2 text-sm rounded-md">Issue</button>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-700 mb-2 border-b pb-1">Terminate Lease</h3>
                                    <button onClick={() => { if(confirm('Are you sure you want to issue a 30-day lease termination notice?')) onTerminateLease(selectedTenant.id); }} className="w-full bg-red-600 text-white font-semibold py-2 text-sm rounded-md">
                                        Issue 30-Day Termination Notice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TenantManagementCentre;
