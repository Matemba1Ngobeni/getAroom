
import React, { useState } from 'react';
import type { Service } from '../types';
import { ALL_SERVICES } from '../constants';

interface ServiceProviderDetailsFormProps {
  onSubmit: (data: { services: Service[] }) => void;
  onBack: () => void;
}

const ServiceProviderDetailsForm: React.FC<ServiceProviderDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const handleServiceToggle = (service: Service) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ services: selectedServices });
  };

  return (
    <main className="flex-grow w-full flex items-center justify-center bg-slate-100 py-12 px-4 animate-fade-in">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
            <button
                onClick={onBack}
                className="text-sm font-semibold text-slate-600 hover:text-teal-600 mb-6 flex items-center group"
            >
                <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i>
                Choose a different role
            </button>
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-slate-800">
                Service Provider Details
                </h2>
                <p className="mt-2 text-slate-500">
                Tell us what services you provide. You can select multiple options.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Available Services</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {ALL_SERVICES.map(service => (
                        <label key={service} className="flex items-center space-x-3 p-3 border-2 border-slate-200 rounded-lg has-[:checked]:bg-teal-50 has-[:checked]:border-teal-400 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                name="service"
                                value={service}
                                checked={selectedServices.includes(service)}
                                onChange={() => handleServiceToggle(service)}
                                className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="font-medium text-slate-700">{service}</span>
                        </label>
                        ))}
                    </div>
                </div>
                 <div>
                    <button
                        type="submit"
                        disabled={selectedServices.length === 0}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </form>
        </div>
    </main>
  );
};

export default ServiceProviderDetailsForm;
