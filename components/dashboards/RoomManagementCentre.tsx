
import React from 'react';
import type { Room, FaultTicket, TenantUser } from '../../types';
import { ALL_TENANTS_MAP } from '../../constants';

interface RoomManagementCentreProps {
    rooms: Room[];
    tickets: FaultTicket[];
    tenants: TenantUser[];
    onConfirmResolution: (ticketId: string) => void;
}

const statusColors = {
  Reported: 'bg-red-100 text-red-800',
  'Pending Approval': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Pending Confirmation': 'bg-orange-100 text-orange-800',
  Resolved: 'bg-green-100 text-green-800',
};

const RoomManagementCentre: React.FC<RoomManagementCentreProps> = ({ rooms, tickets, tenants, onConfirmResolution }) => {
    
    // A mock function to find the current tenant for a room
    const findTenantForRoom = (roomId: number) => {
        return tenants.find(t => t.leasedRoomId === roomId) || null;
    }

    return (
        <div className="bg-white shadow-sm rounded-lg">
            <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Room Management Centre</h2>
            <div className="p-6 space-y-6">
                {rooms.length > 0 ? rooms.map(room => {
                    const roomTickets = tickets.filter(t => t.roomId === room.id && t.status !== 'Resolved');
                    const currentTenant = findTenantForRoom(room.id);
                    return (
                        <div key={room.id} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex gap-4 items-start">
                                <img src={room.imageUrl} alt={room.name} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg text-slate-800">{room.name}</h3>
                                    <p className="text-sm text-slate-500">
                                        Current Tenant: <span className="font-semibold text-slate-700">{currentTenant?.name || 'Vacant'}</span>
                                    </p>
                                    <div className="mt-3">
                                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Active Issues ({roomTickets.length})</h4>
                                        {roomTickets.length > 0 ? (
                                            <div className="space-y-2">
                                                {roomTickets.map(ticket => (
                                                    <div key={ticket.id} className="text-xs p-2 bg-slate-50 rounded-md">
                                                        <div className="flex justify-between items-center">
                                                           <p className="text-slate-700 flex-grow"><span className="font-semibold">{ticket.category}:</span> {ticket.description}</p>
                                                           <span className={`ml-2 flex-shrink-0 px-2 py-1 font-semibold rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                                                        </div>
                                                        {ticket.status === 'Pending Confirmation' && (
                                                            <div className="mt-2 text-right">
                                                                {ticket.landlordConfirmedResolved ? (
                                                                    <p className="text-green-600 font-semibold text-xs">You confirmed resolution.</p>
                                                                ) : (
                                                                     <button onClick={() => onConfirmResolution(ticket.id)} className="bg-teal-600 text-white px-3 py-1 font-semibold rounded-md hover:bg-teal-700">Confirm Fix</button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : <p className="text-xs text-slate-500">No active issues for this room.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                     <p className="text-slate-500 text-center py-8">You haven't listed any properties yet.</p>
                )}
            </div>
        </div>
    );
};

export default RoomManagementCentre;