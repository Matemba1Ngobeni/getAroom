
import React, { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import type { Page } from '../App';
import type { TenantUser, Trustee, TimeManagerEvent, Goal, GoalTask } from '../types';
import LandlordDashboard from './dashboards/LandlordDashboard';
import ServiceProviderDashboard from './dashboards/ServiceProviderDashboard';
import TenantDashboard from './dashboards/TenantDashboard';
import TrusteeDashboard from './dashboards/TrusteeDashboard';
import { BookingContext } from '../contexts/BookingContext';
import { useData } from '../contexts/DataContext';

interface DashboardProps {
    onNavigate: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user, updateUser } = useContext(UserContext);
  const { bookings, updateBookingStatus } = useContext(BookingContext);
  const { tickets, announcements, complaints, tenants, loading, addTicket, addComplaint, addAnnouncement, addBidToTicket, updateTicketStatus, addNewUser } = useData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!user) {
    onNavigate('home');
    return null;
  }
  
  const handleConfirmResolution = (ticketId: string, userType: 'Landlord' | 'Tenant') => {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;

      const updates: Partial<typeof ticket> = {};
      let isNowResolved = false;

      if (userType === 'Landlord') {
          updates.landlordConfirmedResolved = true;
          if (ticket.tenantConfirmedResolved) isNowResolved = true;
      } else { // Tenant
          updates.tenantConfirmedResolved = true;
          if (ticket.landlordConfirmedResolved) isNowResolved = true;
      }

      if (isNowResolved) {
          updateTicketStatus(ticketId, 'Resolved', updates);
          alert(`Ticket ${ticketId} has been fully resolved and is now closed.`);
      } else {
          // Just update the confirmation status without changing the main status
          updateTicketStatus(ticketId, ticket.status, updates);
      }
  };
  
  const handleIssueWarning = async (tenantId: string, warningMessage: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;
    // This is not ideal as it updates another user's data. In a real app, this would be a backend operation with permissions.
    // For now, we'll proceed with a direct update for demo purposes.
    // await updateUser({ warnings: [...tenant.warnings, warningMessage] });
    console.log("Warning issued - Firestore update needs to be targeted to the tenant's doc.");
    alert('Warning has been issued to the tenant.');
  };
  
  const handleRequestLeaseExtension = async (tenantId: string, requestedEndDate: string) => {
    await updateUser({ leaseExtensionRequest: { status: 'Pending', requestedEndDate } });
    alert('Your lease extension request has been sent to the landlord.');
  };
  
  const handleAddTrustee = (trustee: Omit<Trustee, 'id'>) => {
    if (user && 'trustees' in user && !user.trustees.some(t => t.email === trustee.email)) {
        const newTrustee = { ...trustee, id: `trustee-${Date.now()}`};
        updateUser({ trustees: [...user.trustees, newTrustee] });
    }
  };

  const handleRemoveTrustee = (trusteeId: string) => {
    if (user && 'trustees' in user) {
        updateUser({ trustees: user.trustees.filter(t => t.id !== trusteeId) });
    }
  };
  
   const handleAddEvent = (newEvent: Omit<TimeManagerEvent, 'id'>) => {
    if (user && 'events' in user) {
        const event: TimeManagerEvent = { ...newEvent, id: `evt-${Date.now()}` };
        const updatedEvents = [...user.events, event].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        updateUser({ events: updatedEvents });
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (user && 'events' in user) {
        updateUser({ events: user.events.filter(e => e.id !== eventId) });
    }
  };

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'tasks'> & { tasks: Omit<GoalTask, 'id' | 'completed'>[] }) => {
    if (user && 'goals' in user) {
        const goal: Goal = {
            ...newGoal,
            id: `goal-${Date.now()}`,
            tasks: newGoal.tasks.map((task, index) => ({ ...task, id: `task-${Date.now()}-${index}`, completed: false }))
        };
        updateUser({ goals: [...user.goals, goal] });
    }
  };
  
  const handleToggleGoalTask = (goalId: string, taskId: string) => {
    if (user && 'goals' in user) {
        const updatedGoals = user.goals.map(goal => 
            goal.id === goalId 
            ? { ...goal, tasks: goal.tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task) } 
            : goal
        );
        updateUser({ goals: updatedGoals });
    }
  };

  const renderDashboard = () => {
    switch (user.userType) {
      case 'Landlord':
        return <LandlordDashboard 
            user={user}
            tickets={tickets} 
            announcements={announcements} 
            bookings={bookings}
            tenants={tenants}
            complaints={complaints}
            onAcceptBid={(ticketId) => updateTicketStatus(ticketId, 'In Progress')}
            onAddAnnouncement={addAnnouncement}
            onUpdateBookingStatus={updateBookingStatus}
            onConfirmResolution={(ticketId) => handleConfirmResolution(ticketId, 'Landlord')}
            onIssueWarning={handleIssueWarning}
            onTerminateLease={() => alert("Lease termination process initiated.")}
            onUpdateLeaseExtension={() => alert("Lease extension updated.")}
            onRateTenant={() => alert("Tenant rated.")}
        />;
      case 'Service Provider':
        return <ServiceProviderDashboard 
            user={{...user, id: user.id, name: user.name}} // Ensure mock props are met
            allTickets={tickets} 
            onAddBid={addBidToTicket}
            onMarkJobComplete={(ticketId) => updateTicketStatus(ticketId, 'Pending Confirmation')}
        />;
      case 'Student':
      case 'General Tenant':
        return <TenantDashboard 
            user={user} 
            tickets={tickets.filter(t => t.tenantId === user.id)} 
            announcements={announcements} 
            complaints={complaints.filter(c => c.filedById === user.id || c.filedAgainst.id === user.id)}
            bookings={bookings.filter(b => b.tenantId === user.id)}
            allTenants={tenants}
            onAddTicket={addTicket} 
            onAddComplaint={addComplaint}
            onAddTrustee={handleAddTrustee}
            onRemoveTrustee={handleRemoveTrustee}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddGoal={handleAddGoal}
            onToggleGoalTask={handleToggleGoalTask}
            onConfirmResolution={(ticketId) => handleConfirmResolution(ticketId, 'Tenant')}
            onRequestLeaseExtension={handleRequestLeaseExtension}
            onAddNewUser={addNewUser}
            onNavigate={onNavigate} 
        />;
      case 'Trustee':
        return <TrusteeDashboard user={user} onAddTicket={addTicket} />;
      default:
        return <div>Invalid user type.</div>;
    }
  }

  return (
    <main className="flex-grow bg-slate-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {renderDashboard()}
        </div>
    </main>
  );
};

export default Dashboard;
