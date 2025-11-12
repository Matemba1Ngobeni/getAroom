import React from 'react';
import type { UserType } from '../types';

interface UserTypeSelectionModalProps {
  onSelect: (userType: UserType) => void;
  onCancel: () => void;
}

const USER_TYPES: { name: UserType; icon: string; description: string }[] = [
  { name: 'Student', icon: 'fa-user-graduate', description: 'Find housing for your studies.' },
  { name: 'Landlord', icon: 'fa-house-user', description: 'List and manage your properties.' },
  { name: 'Service Provider', icon: 'fa-screwdriver-wrench', description: 'Offer services to tenants.' },
  { name: 'General Tenant', icon: 'fa-user', description: 'Rent a room for any purpose.' },
];

const UserTypeSelectionModal: React.FC<UserTypeSelectionModalProps> = ({ onSelect, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center transform transition-all animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          Join Get.A.Room
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          First, let's figure out what you're looking for. Who are you?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {USER_TYPES.map(type => (
            <div
              key={type.name}
              onClick={() => onSelect(type.name)}
              className="group p-6 border-2 border-slate-200 rounded-lg text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 text-teal-600 text-3xl mx-auto group-hover:bg-teal-100 transition-colors">
                <i className={`fas ${type.icon}`}></i>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-800">{type.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{type.description}</p>
            </div>
          ))}
        </div>
         <div className="mt-10">
          <button 
            onClick={onCancel}
            className="text-sm font-semibold text-slate-500 hover:text-teal-600 transition-colors"
          >
            Cancel and return home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTypeSelectionModal;