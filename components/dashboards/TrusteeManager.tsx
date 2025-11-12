

import React, { useState } from 'react';
import type { Trustee } from '../../types';

interface TrusteeManagerProps {
    currentTrustees: Trustee[];
    onAddTrustee: (trustee: Omit<Trustee, 'id'>) => void;
    onRemoveTrustee: (trusteeId: string) => void;
}

const TrusteeManager: React.FC<TrusteeManagerProps> = ({ currentTrustees, onAddTrustee, onRemoveTrustee }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;
        onAddTrustee({ name, email });
        setName('');
        setEmail('');
    };

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Trustee Manager</h2>
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-700 mb-2">Current Trustees</h3>
                    {currentTrustees.length > 0 ? (
                        <ul className="space-y-2">
                           {currentTrustees.map(trustee => (
                               <li key={trustee.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-md text-sm">
                                   <div>
                                     <span className="font-medium text-slate-800">{trustee.name}</span>
                                     <span className="block text-xs text-slate-500">{trustee.email}</span>
                                   </div>
                                   <button onClick={() => onRemoveTrustee(trustee.id)} className="text-red-500 hover:text-red-700">
                                       <i className="fas fa-trash-alt"></i>
                                   </button>
                               </li>
                           ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-slate-500">You have not added any trustees.</p>
                    )}
                </div>
                <form onSubmit={handleAdd} className="border-t border-slate-200 pt-4">
                     <h3 className="text-sm font-semibold text-slate-700 mb-2">Invite a New Trustee</h3>
                     <p className="text-xs text-slate-500 mb-2">They will be able to log in with their email to access keyless entry for your room.</p>
                     <div className="space-y-2">
                        <input 
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Trustee's Full Name"
                            required
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                        <input 
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Trustee's Email Address"
                            required
                            className="w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        />
                        <button type="submit" className="w-full bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors text-sm">Send Invite</button>
                     </div>
                </form>
            </div>
        </div>
    );
};

export default TrusteeManager;