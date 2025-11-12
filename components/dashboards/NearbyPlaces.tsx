
import React, { useState, useEffect } from 'react';
import { findNearbyPlaces } from '../../services/geminiService';

const NearbyPlaces: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ text: string, groundingMetadata: any[] } | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchNearbyPlaces = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const result = await findNearbyPlaces(latitude, longitude);
            setData(result);
          } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError("Permission to access location was denied. This feature requires your location to find nearby places.");
          setLoading(false);
        }
      );
    };

    fetchNearbyPlaces();
  }, []);

  const getPlaceIcon = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('shop') || lowerTitle.includes('pharmacy') || lowerTitle.includes('store') || lowerTitle.includes('market') || lowerTitle.includes('goods')) {
        return 'fa-shopping-cart';
    }
    if (lowerTitle.includes('clinic') || lowerTitle.includes('gp') || lowerTitle.includes('doctor') || lowerTitle.includes('health') || lowerTitle.includes('medical')) {
        return 'fa-clinic-medical';
    }
    if (lowerTitle.includes('hospital')) {
        return 'fa-hospital';
    }
    if (lowerTitle.includes('park') || lowerTitle.includes('garden') || lowerTitle.includes('recreation')) {
        return 'fa-tree';
    }
    if (lowerTitle.includes('police')) {
        return 'fa-building-shield';
    }
    return 'fa-map-marker-alt';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mb-3"></div>
          <p className="text-sm text-slate-500">Finding nearby places...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
           <p className="font-semibold mb-1">Could not load nearby places</p>
           {error}
        </div>
      );
    }

    if (data) {
      const allPlaces = data.groundingMetadata.filter(chunk => chunk.maps);

      if (allPlaces.length === 0) {
          return <p className="text-sm text-slate-500 text-center">No key locations could be identified nearby.</p>;
      }

      // Prioritize showing one of each category first
      const categoryMap = new Map<string, any>();
      allPlaces.forEach(place => {
          const category = getPlaceIcon(place.maps.title);
          if (!categoryMap.has(category)) {
              categoryMap.set(category, place);
          }
      });
      const uniqueCategoryPlaces = Array.from(categoryMap.values());
      const otherPlaces = allPlaces.filter(p => !uniqueCategoryPlaces.some(up => up.maps.uri === p.maps.uri));
      const sortedPlaces = [...uniqueCategoryPlaces, ...otherPlaces];
      
      const placesToDisplay = showAll ? sortedPlaces : sortedPlaces.slice(0, 10);

      return (
        <div>
            <div className="flex flex-wrap gap-3">
            {placesToDisplay.map((chunk, index) => (
                <a
                key={`place-${index}`}
                href={chunk.maps.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-teal-100 hover:text-teal-700 transition-all duration-200 flex items-center gap-2 shadow-sm border border-slate-200"
                title={chunk.maps.title}
                >
                <i className={`fas ${getPlaceIcon(chunk.maps.title)}`}></i>
                <span className="truncate max-w-xs">{chunk.maps.title}</span>
                </a>
            ))}
            </div>

            {sortedPlaces.length > 10 && (
                <div className="mt-4 text-center">
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                        {showAll ? 'View Less' : `View ${sortedPlaces.length - 10} More`}
                        <i className={`fas ${showAll ? 'fa-chevron-up' : 'fa-chevron-down'} ml-2 text-xs`}></i>
                    </button>
                </div>
            )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Points of Interest</h2>
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default NearbyPlaces;
