

import React, { useState, useEffect, useRef } from 'react';
import type { Filters } from '../types';
import { ALL_AMENITIES, MAX_PRICE } from '../constants';

interface SearchAndFilterBarProps {
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({ searchTerm, onSearchChange, filters, onFiltersChange }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>(filters);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters(prev => ({ ...prev, price: parseInt(e.target.value, 10) }));
  };

  const handleAmenityChange = (amenity: string) => {
    setTempFilters(prev => {
      const newAmenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities: newAmenities };
    });
  };

  const handleRatingChange = (rating: number) => {
    setTempFilters(prev => ({ ...prev, rating: prev.rating === rating ? 0 : rating }));
  };

  const handleOccupancyChange = (count: number) => {
    setTempFilters(prev => ({ ...prev, minOccupancy: Math.max(1, count) }));
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsFilterOpen(false);
  };
  
  const handleClearFilters = () => {
    const defaultFilters = { price: MAX_PRICE, amenities: [], rating: 0, minOccupancy: 1 };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
    setIsFilterOpen(false);
  }

  return (
    <div className="max-w-2xl mx-auto mb-16 relative" ref={filterMenuRef}>
        <div className="relative text-gray-400 focus-within:text-gray-600 shadow-lg rounded-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fas fa-search"></i>
            </div>
            <input
                id="search"
                name="search"
                className="block w-full pl-12 pr-24 py-4 border border-slate-300 rounded-full leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-lg transition"
                placeholder="Search by name or location..."
                type="search"
                value={searchTerm}
                onChange={onSearchChange}
                aria-label="Search for rooms by name or location"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                 <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="bg-white text-slate-700 border border-slate-300 px-4 py-2 rounded-full font-semibold hover:bg-slate-100 transition-all duration-300 flex items-center text-sm"
                >
                    <i className="fas fa-filter mr-2 text-slate-500"></i>
                    Filters
                </button>
            </div>
        </div>
        
        {isFilterOpen && (
            <div className="absolute left-0 right-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-slate-200 p-6 space-y-6 animate-fade-in-up">
            <div>
                <div className="flex justify-between items-center mb-2">
                <label htmlFor="price" className="font-semibold text-slate-700">Max Price (Nightly)</label>
                <span className="text-teal-600 font-bold">${tempFilters.price}</span>
                </div>
                <input type="range" id="price" min={0} max={MAX_PRICE} value={tempFilters.price} onChange={handlePriceChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"/>
            </div>

            <div>
                <h4 className="font-semibold text-slate-700 mb-3">Number of Guests</h4>
                <div className="flex items-center space-x-4">
                    <button type="button" onClick={() => handleOccupancyChange(tempFilters.minOccupancy - 1)} className="w-8 h-8 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors">-</button>
                    <span className="text-lg font-bold w-8 text-center text-slate-800">{tempFilters.minOccupancy}</span>
                    <button type="button" onClick={() => handleOccupancyChange(tempFilters.minOccupancy + 1)} className="w-8 h-8 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 transition-colors">+</button>
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-slate-700 mb-3">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {ALL_AMENITIES.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={tempFilters.amenities.includes(amenity)} onChange={() => handleAmenityChange(amenity)} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
                    <span className="text-slate-600">{amenity}</span>
                    </label>
                ))}
                </div>
            </div>

            <div>
                <h4 className="font-semibold text-slate-700 mb-3">Minimum Rating</h4>
                <div className="flex space-x-1 cursor-pointer">
                {[...Array(5)].map((_, i) => (
                    <i 
                    key={i} 
                    className={`fas fa-star text-2xl transition-colors ${i < tempFilters.rating ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`}
                    onClick={() => handleRatingChange(i + 1)}
                    />
                ))}
                </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-200">
                <button onClick={handleClearFilters} className="text-sm font-semibold text-slate-600 hover:text-teal-600">Clear all</button>
                <button onClick={handleApplyFilters} className="bg-teal-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-teal-700 transition-colors">Apply Filters</button>
            </div>
            </div>
        )}
    </div>
  );
};

export default SearchAndFilterBar;