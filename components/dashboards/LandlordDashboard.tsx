
import React, { useState, useMemo } from 'react';
import type { LandlordUser, FaultTicket, Announcement, Room, BookingApplication, TenantUser, Complaint } from '../../types';
import { ALL_ROOMS_MAP } from '../../constants';
import BookingsCentre from './BookingsCentre';
import RoomManagementCentre from './RoomManagementCentre';
import TenantManagementCentre from './TenantManagementCentre';
import PropertyRegistrationForm from '../PropertyRegistrationForm';

interface LandlordDashboardProps {
  user: LandlordUser;
  tickets: FaultTicket[];
  announcements: Announcement[];
  bookings: BookingApplication[];
  tenants: TenantUser[];
  complaints: Complaint[];
  onAcceptBid: (ticketId: string, bidId: string) => void;
  onAddAnnouncement: (announcement: { author: string; title: string; content: string; }) => void;
  onUpdateBookingStatus: (bookingId: string, status: 'Approved' | 'Rejected') => void;
  onConfirmResolution: (ticketId: string) => void;
  onIssueWarning: (tenantId: string, warningMessage: string) => void;
  onTerminateLease: (tenantId: string) => void;
  onUpdateLeaseExtension: (tenantId: string, status: 'Approved' | 'Rejected') => void;
  onRateTenant: (tenantId: string, newRating: number) => void;
}

type DashboardTab = 'overview' | 'tenants' | 'properties' | 'bookings' | 'finance';

const StatCard: React.FC<{ icon: string; title: string; value: string | number; color: string; }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm flex items-center space-x-4 border border-slate-200">
        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${color}`}>
            <i className={`fas ${icon} text-xl text-white`}></i>
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const LandlordDashboard: React.FC<LandlordDashboardProps> = (props) => {
    const { user, tenants, tickets, bookings, onAddAnnouncement, onUpdateBookingStatus } = props;
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');

    const managedProperties = user.managedProperties.map(id => ALL_ROOMS_MAP.get(id)).filter((r): r is Room => r !== undefined);

    const currentTenants = useMemo(() => tenants.filter(t => t.leasedRoomId && user.managedProperties.includes(t.leasedRoomId)), [tenants, user.managedProperties]);

    const metrics = useMemo(() => {
        const totalProperties = managedProperties.length;
        const occupiedProperties = currentTenants.length;
        const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;
        const pendingIssues = tickets.filter(t => t.status !== 'Resolved' && user.managedProperties.includes(t.roomId)).length;
        const monthlyIncome = currentTenants.reduce((acc, tenant) => acc + tenant.rentAmount, 0);
        const overdueRent = currentTenants.filter(t => t.rentStatus === 'Overdue').reduce((acc, t) => acc + t.rentAmount, 0);
        return { totalProperties, occupancyRate, pendingIssues, monthlyIncome, overdueRent };
    }, [managedProperties, currentTenants, tickets, user.managedProperties]);
    
    const handleAnnouncementSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!announcementTitle || !announcementContent) return;
        onAddAnnouncement({ author: user.name, title: announcementTitle, content: announcementContent });
        setAnnouncementTitle('');
        setAnnouncementContent('');
        alert('Announcement published!');
    };
    
    const TabButton: React.FC<{ tabName: DashboardTab; icon: string; label: string }> = ({ tabName, icon, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === tabName ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
        >
            <i className={`fas ${icon}`}></i>
            <span>{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'tenants':
                // Pass only current tenants to the management centre
                return <TenantManagementCentre {...props} tenants={currentTenants} />;
            case 'properties':
                return <RoomManagementCentre rooms={managedProperties} {...props} tenants={currentTenants} />;
            case 'bookings':
                 // Pass all tenants/applicants to the bookings centre
                return <BookingsCentre bookings={bookings} onUpdateBookingStatus={onUpdateBookingStatus} allApplicants={tenants} />;
            case 'finance':
                return (
                     <div className="bg-white shadow-sm rounded-lg animate-fade-in-up">
                        <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Financial Overview</h2>
                         <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <p className="text-sm font-medium text-green-800">Total Monthly Rent</p>
                                <p className="text-3xl font-bold text-green-700">${metrics.monthlyIncome.toLocaleString()}</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                                <p className="text-sm font-medium text-red-800">Total Overdue Rent</p>
                                <p className="text-3xl font-bold text-red-700">${metrics.overdueRent.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="font-semibold text-slate-700 mb-4">Rent Payment Status</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-600 uppercase">
                                        <tr>
                                            <th className="p-3">Tenant</th>
                                            <th className="p-3">Property</th>
                                            <th className="p-3">Amount</th>
                                            <th className="p-3">Due Date</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {currentTenants.map(tenant => (
                                            <tr key={tenant.id}>
                                                <td className="p-3 font-medium text-slate-800">{tenant.name}</td>
                                                <td className="p-3">{ALL_ROOMS_MAP.get(tenant.leasedRoomId!)?.name}</td>
                                                <td className="p-3">${tenant.rentAmount}</td>
                                                <td className="p-3">{new Date(tenant.rentDueDate).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tenant.rentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tenant.rentStatus}</span>
                                                </td>
                                                <td className="p-3">
                                                    {tenant.rentStatus === 'Overdue' && (
                                                        <button onClick={() => alert(`Rent reminder sent to ${tenant.name}`)} className="bg-yellow-500 text-white font-semibold px-3 py-1 text-xs rounded-md hover:bg-yellow-600">
                                                            Send Reminder
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            case 'overview':
            default:
                return (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon="fa-home" title="Total Properties" value={metrics.totalProperties} color="bg-blue-500" />
                            <StatCard icon="fa-users" title="Occupancy Rate" value={`${metrics.occupancyRate}%`} color="bg-teal-500" />
                            <StatCard icon="fa-wrench" title="Pending Issues" value={metrics.pendingIssues} color="bg-orange-500" />
                            <StatCard icon="fa-dollar-sign" title="Est. Monthly Income" value={`$${metrics.monthlyIncome.toLocaleString()}`} color="bg-green-500" />
                        </div>

                        {/* Quick Actions & Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 bg-white shadow-sm rounded-lg">
                                 <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Recent Activity</h2>
                                 <div className="p-6 space-y-4">
                                     {/* Mock Activity */}
                                     <p className="text-slate-500 text-sm"><i className="fas fa-ticket-alt text-red-500 mr-2"></i> New fault ticket reported for 'Cozy Downtown Loft'.</p>
                                     <p className="text-slate-500 text-sm"><i className="fas fa-file-signature text-blue-500 mr-2"></i> New booking application received for 'Chic Parisian Apartment'.</p>
                                     <p className="text-slate-500 text-sm"><i className="fas fa-check-circle text-green-500 mr-2"></i> Rent paid by John Smith.</p>
                                 </div>
                            </div>
                            <div className="bg-white shadow-sm rounded-lg">
                                <h2 className="text-xl font-bold text-slate-800 p-6 border-b border-slate-200">Post an Announcement</h2>
                                <form onSubmit={handleAnnouncementSubmit} className="p-6 space-y-4">
                                    <input 
                                        type="text" 
                                        value={announcementTitle}
                                        onChange={e => setAnnouncementTitle(e.target.value)}
                                        placeholder="Title"
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500"
                                    />
                                    <textarea
                                        value={announcementContent}
                                        onChange={e => setAnnouncementContent(e.target.value)}
                                        rows={3}
                                        placeholder="Message..."
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm focus:ring-teal-500 focus:border-teal-500"
                                    ></textarea>
                                    <button type="submit" className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700">Publish</button>
                                </form>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="space-y-8 animate-fade-in-up">
            <header className="bg-white shadow-sm rounded-lg p-6">
                <h1 className="text-3xl font-extrabold text-slate-800">Welcome, {user.name}!</h1>
                <p className="mt-2 text-slate-600">Manage your properties, tenants, and finances all in one place.</p>
            </header>
            
            <nav className="bg-white p-2 rounded-lg shadow-sm flex flex-wrap items-center gap-2">
                <TabButton tabName="overview" icon="fa-tachometer-alt" label="Overview" />
                <TabButton tabName="tenants" icon="fa-users-cog" label="Tenants" />
                <TabButton tabName="properties" icon="fa-building" label="Properties" />
                <TabButton tabName="bookings" icon="fa-calendar-check" label="Bookings" />
                <TabButton tabName="finance" icon="fa-chart-line" label="Finance" />
            </nav>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default LandlordDashboard;
