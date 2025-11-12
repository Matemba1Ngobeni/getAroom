
import React, { useState, useEffect } from 'react';
import type { TenantUser } from '../../types';
import { ALL_ROOMS_MAP } from '../../constants';

interface LeaseStatusProps {
    user: TenantUser;
}

const LeaseStatus: React.FC<LeaseStatusProps> = ({ user }) => {
    const leasedRoom = user.leasedRoomId ? ALL_ROOMS_MAP.get(user.leasedRoomId) : null;

    const calculateTimeLeft = () => {
        if (!user.leaseEndDate) return null;
        const difference = +new Date(user.leaseEndDate) - +new Date();
        let timeLeft: { [key: string]: number } = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    if (!user.leaseEndDate || !leasedRoom) return null;
    
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(leasedRoom.location)}`;

    const timerComponents = Object.entries(timeLeft || {}).map(([interval, value]) => {
        return (
            <div key={interval} className="text-center">
                <span className="text-2xl lg:text-3xl font-bold text-teal-600">{value.toString().padStart(2, '0')}</span>
                <span className="block text-xs uppercase text-slate-500">{interval}</span>
            </div>
        );
    });

    return (
        <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-xl font-bold text-slate-800">Lease Status</h2>
                        <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                           <i className="fas fa-map-marker-alt mr-1"></i> View on Map
                        </a>
                    </div>
                    <p className="text-sm text-slate-500">Your lease for "{leasedRoom.name}" expires in:</p>
                    <div className="flex space-x-4 mt-3">
                        {timerComponents.length ? timerComponents : <span className="text-lg font-semibold text-red-500">Lease Expired</span>}
                    </div>
                    {user.nextTenant && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
                            <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                            <span className="text-blue-800">
                                This room has been booked by <span className="font-semibold">{user.nextTenant.name}</span> after your lease ends.
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-start md:justify-end">
                    {user.leaseExtensionRequest?.status === 'Pending' ? (
                        <span className="px-4 py-2 text-sm font-semibold bg-yellow-100 text-yellow-800 rounded-md">
                            Extension Request Pending
                        </span>
                    ) : (
                        <button className="px-4 py-2 text-sm font-semibold bg-teal-100 text-teal-800 rounded-md hover:bg-teal-200 transition-colors">Extend Lease</button>
                    )}
                    <button className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-800 rounded-md hover:bg-slate-200 transition-colors">Exchange Room</button>
                    <button className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors">Terminate Now</button>
                </div>
            </div>
        </div>
    );
};

export default LeaseStatus;