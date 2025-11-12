
import React, { useState } from 'react';
import type { PropertyType } from '../types';
import { ALL_PROPERTY_TYPES } from '../constants';

interface LandlordDetailsFormProps {
  onSubmit: (data: { propertyTypes: PropertyType[] }) => void;
  onBack: () => void;
}

const LandlordDetailsForm: React.FC<LandlordDetailsFormProps> = ({ onSubmit, onBack }) => {
  const [selectedPropTypes, setSelectedPropTypes] = useState<PropertyType[]>([]);

  const handlePropTypeToggle = (propType: PropertyType) => {
    setSelectedPropTypes(prev =>
      prev.includes(propType)
        ? prev.filter(s => s !== propType)
        : [...prev, propType]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ propertyTypes: selectedPropTypes });
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
                Landlord Details
                </h2>
                <p className="mt-2 text-slate-500">
                What kind of properties do you manage? You can select multiple options.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-slate-900">Property Types</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {ALL_PROPERTY_TYPES.map(propType => (
                        <label key={propType} className="flex items-center space-x-3 p-3 border-2 border-slate-200 rounded-lg has-[:checked]:bg-teal-50 has-[:checked]:border-teal-400 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                name="propertyType"
                                value={propType}
                                checked={selectedPropTypes.includes(propType)}
                                onChange={() => handlePropTypeToggle(propType)}
                                className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                            />
                            <span className="font-medium text-slate-700">{propType}</span>
                        </label>
                        ))}
                    </div>
                </div>
                 <div>
                    <button
                        type="submit"
                        disabled={selectedPropTypes.length === 0}
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

export default LandlordDetailsForm;
