

import React, { useState } from 'react';
import type { Room } from '../types';
import { ALL_AMENITIES } from '../constants';

interface PropertyRegistrationFormProps {
  onSubmit: (data: Omit<Room, 'id' | 'rating' | 'imageUrl'> & { imageUrl?: string }) => void;
  onBack: () => void;
  submitButtonText: string;
  isSigningUp?: boolean; // To adjust layout/text for sign-up flow
}

const PropertyRegistrationForm: React.FC<PropertyRegistrationFormProps> = ({ onSubmit, onBack, submitButtonText, isSigningUp = false }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [pricing, setPricing] = useState<{ hourly?: number; nightly?: number; monthly?: number; }>({});
  const [amenities, setAmenities] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [maxOccupancy, setMaxOccupancy] = useState(2);

  const handleAmenityChange = (amenity: string) => {
    setAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      return newAmenities;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !description) {
      alert("Please fill in all required fields.");
      return;
    }
    // In a real app, imageFile would be uploaded to a server to get a URL.
    // Here, we're just noting its presence. The URL will be a placeholder.
    onSubmit({
      name,
      location,
      pricing,
      description,
      amenities,
      maxOccupancy,
    });
  };
  
  const formContent = (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
            <div>
                <label htmlFor="prop-name" className="block text-sm font-medium text-slate-700">Property Name</label>
                <input type="text" id="prop-name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., Sunny Downtown Apartment"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="prop-location" className="block text-sm font-medium text-slate-700">Location</label>
                    <input type="text" id="prop-location" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., New York, USA"/>
                </div>
                <div>
                    <label htmlFor="prop-occupancy" className="block text-sm font-medium text-slate-700">Max Occupancy</label>
                    <input type="number" id="prop-occupancy" value={maxOccupancy} onChange={e => setMaxOccupancy(parseInt(e.target.value) || 1)} required min="1" className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="e.g., 4"/>
                </div>
            </div>
             <div>
                <label htmlFor="prop-description" className="block text-sm font-medium text-slate-700">Description</label>
                <textarea id="prop-description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm" placeholder="Describe what makes your place special."></textarea>
            </div>
        </div>
        
        {/* Pricing */}
         <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-slate-900">Pricing (Optional)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="price-nightly" className="block text-sm font-medium text-slate-700">Nightly Rate ($)</label>
                    <input type="number" id="price-nightly" value={pricing.nightly || ''} onChange={e => setPricing(p => ({...p, nightly: parseInt(e.target.value)}))} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                </div>
                 <div>
                    <label htmlFor="price-monthly" className="block text-sm font-medium text-slate-700">Monthly Rate ($)</label>
                    <input type="number" id="price-monthly" value={pricing.monthly || ''} onChange={e => setPricing(p => ({...p, monthly: parseInt(e.target.value)}))} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                </div>
                 <div>
                    <label htmlFor="price-hourly" className="block text-sm font-medium text-slate-700">Hourly Rate ($)</label>
                    <input type="number" id="price-hourly" value={pricing.hourly || ''} onChange={e => setPricing(p => ({...p, hourly: parseInt(e.target.value)}))} className="mt-1 w-full border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm"/>
                </div>
            </div>
        </div>
        
        {/* Amenities */}
        <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium text-slate-900">Amenities</h3>
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {ALL_AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-3 p-3 border-2 border-slate-200 rounded-lg has-[:checked]:bg-teal-50 has-[:checked]:border-teal-400 cursor-pointer transition-colors">
                        <input type="checkbox" checked={amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-5 w-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"/>
                        <span className="font-medium text-slate-700">{amenity}</span>
                    </label>
                ))}
            </div>
        </div>
        
        {/* Image Upload */}
        <div className="space-y-2 border-t pt-6">
             <h3 className="text-lg font-medium text-slate-900">Add Photos (Optional)</h3>
             <p className="text-sm text-slate-500">You can add photos now or later from your dashboard.</p>
             <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <i className="fas fa-image text-4xl text-slate-400 mx-auto"></i>
                    <div className="flex text-sm text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">{imageFile ? `Selected: ${imageFile.name}` : 'PNG, JPG up to 10MB'}</p>
                </div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t">
          <button type="button" onClick={onBack} className="bg-slate-100 text-slate-700 font-semibold py-2 px-6 rounded-md hover:bg-slate-200 transition-colors">
            {isSigningUp ? 'Back' : 'Cancel'}
          </button>
          <button type="submit" className="bg-teal-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-teal-700 transition-colors">
            {submitButtonText}
          </button>
        </div>
      </form>
  );

  // If used during sign up, wrap in specific layout
  if (isSigningUp) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl animate-fade-in">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-slate-600 hover:text-teal-600 mb-6 flex items-center group"
        >
          <i className="fas fa-arrow-left mr-2 transition-transform group-hover:-translate-x-1"></i>
          Back to Property Types
        </button>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-slate-800">
            Register Your First Property
          </h2>
          <p className="mt-2 text-slate-500">
            Let's get the details for your first listing. You can add more later.
          </p>
        </div>
        {formContent}
      </div>
    );
  }

  // Otherwise, return the plain form for use in modals
  return <div className="p-6">{formContent}</div>;
};

export default PropertyRegistrationForm;