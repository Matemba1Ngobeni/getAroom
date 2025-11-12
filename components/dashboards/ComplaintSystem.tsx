
import React, { useState } from 'react';
import type { Complaint, TenantUser } from '../../types';
import { MOCK_TENANTS, MOCK_SERVICE_PROVIDERS_LIST, MOCK_LANDLORD_ID } from '../../constants';

interface ComplaintSystemProps {
    user: TenantUser;
    complaints: Complaint[];
    onAddComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'status'>) => void;
}

const ComplaintSystem: React.FC<ComplaintSystemProps> = ({ user, complaints, onAddComplaint }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetType, setTargetType] = useState<'Landlord' | 'Tenant' | 'Service Provider'>('Landlord');
    const [targetId, setTargetId] = useState('');
    const [reason, setReason] = useState('');

    const filedByMe = complaints.filter(c => c.filedById === user.id);
    const againstMe = complaints.filter(c => c.filedAgainst.id === user.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!targetId || !reason) return;

        let targetName = '';
        if (targetType === 'Landlord') targetName = 'Property Manager';
        if (targetType === 'Tenant') targetName = MOCK_TENANTS.find(t => t.id === targetId)?.name || '';
        if (targetType === 'Service Provider') targetName = MOCK_SERVICE_PROVIDERS_LIST.find(sp => sp.id === targetId)?.name || '';

        onAddComplaint({
            filedById: user.id,
            filedAgainst: { id: targetId, name: targetName, type: targetType },
            reason,
        });
        
        setIsModalOpen(false);
        setTargetId('');
        setReason('');
    };
    
    const renderTargetSelector = () => {
        switch(targetType) {
            case 'Tenant':
                return (
                    <select value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                         <option value="">Select a Tenant</option>
                        {MOCK_TENANTS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                );
            case 'Service Provider':
                 return (
                    <select value={targetId} onChange={e => setTargetId(e.target.value)} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                         <option value="">Select a Service Provider</option>
                        {MOCK_SERVICE_PROVIDERS_LIST.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                    </select>
                );
            case 'Landlord':
            default:
                return <input type="text" value="Property Manager" disabled className="w-full bg-slate-100 border-slate-300 rounded-md shadow-sm sm:text-sm" />;
        }
    }

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Complaint Center</h2>
                <button onClick={() => setIsModalOpen(true)} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                    File a Complaint
                </button>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-slate-700 mb-2">Filed Against You ({againstMe.length})</h3>
                        <div className="space-y-2 text-sm">
                           {againstMe.length > 0 ? againstMe.map(c => (
                                <p key={c.id} className="p-2 bg-red-50 rounded-md border border-red-200">{c.reason.substring(0, 50)}...</p>
                           )) : <p className="text-slate-500">No complaints filed against you.</p>}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-slate-700 mb-2">Filed By You ({filedByMe.length})</h3>
                        <div className="space-y-2 text-sm">
                           {filedByMe.length > 0 ? filedByMe.map(c => (
                                <p key={c.id} className="p-2 bg-slate-100 rounded-md">{c.reason.substring(0, 50)}...</p>
                           )) : <p className="text-slate-500">You haven't filed any complaints.</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Complaint Modal */}
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">File a New Complaint</h2>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Who is this complaint about?</label>
                                <select value={targetType} onChange={e => {setTargetType(e.target.value as any); setTargetId(e.target.value === 'Landlord' ? MOCK_LANDLORD_ID : '');}} className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm">
                                    <option>Landlord</option>
                                    <option>Tenant</option>
                                    <option>Service Provider</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Target</label>
                                {renderTargetSelector()}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Complaint</label>
                                <textarea rows={4} value={reason} onChange={e => setReason(e.target.value)} placeholder="Please provide details about the issue." className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"></textarea>
                            </div>
                             <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2.5 rounded-md hover:bg-teal-700 transition-colors">
                                Submit Complaint
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplaintSystem;
