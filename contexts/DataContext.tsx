import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { FaultTicket, Complaint, Announcement, TenantUser, JobBid } from '../types';
import { getCollection, addDocument } from '../services/firestoreService';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface DataContextType {
  tickets: FaultTicket[];
  complaints: Complaint[];
  announcements: Announcement[];
  tenants: TenantUser[];
  loading: boolean;
  addTicket: (ticketData: Omit<FaultTicket, 'id' | 'reportedAt' | 'status' | 'bids' | 'tenantConfirmedResolved' | 'landlordConfirmedResolved'>) => Promise<void>;
  addComplaint: (complaintData: Omit<Complaint, 'id' | 'date' | 'status'>) => Promise<void>;
  addAnnouncement: (announcementData: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  addBidToTicket: (ticketId: string, bidData: Omit<JobBid, 'id'>) => Promise<void>;
  updateTicketStatus: (ticketId: string, status: FaultTicket['status'], updates?: Partial<FaultTicket>) => Promise<void>;
  addNewUser: (name: string, email: string) => Promise<TenantUser>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<FaultTicket[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tenants, setTenants] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [ticketsData, complaintsData, announcementsData, tenantsData] = await Promise.all([
        getCollection<FaultTicket>('faultTickets'),
        getCollection<Complaint>('complaints'),
        getCollection<Announcement>('announcements'),
        getCollection<TenantUser>('users'), // Assuming all users are fetched, then filtered
      ]);
      setTickets(ticketsData);
      setComplaints(complaintsData);
      setAnnouncements(announcementsData);
      setTenants(tenantsData.filter(u => u.userType === 'Student' || u.userType === 'General Tenant'));
      setLoading(false);
    };
    fetchData();
  }, []);

  const addTicket = async (ticketData: Omit<FaultTicket, 'id' | 'reportedAt' | 'status' | 'bids' | 'tenantConfirmedResolved' | 'landlordConfirmedResolved'>) => {
    const newTicket: Omit<FaultTicket, 'id'> = {
      ...ticketData,
      reportedAt: new Date().toISOString().split('T')[0],
      status: 'Reported',
      bids: [],
      tenantConfirmedResolved: false,
      landlordConfirmedResolved: false,
    };
    const addedTicket = await addDocument('faultTickets', newTicket);
    setTickets(prev => [addedTicket, ...prev]);
  };

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'date' | 'status'>) => {
    const newComplaint: Omit<Complaint, 'id'> = {
      ...complaintData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    const addedComplaint = await addDocument('complaints', newComplaint);
    setComplaints(prev => [addedComplaint, ...prev]);
  };

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement: Omit<Announcement, 'id'> = {
      ...announcementData,
      date: new Date().toISOString().split('T')[0],
    };
    const addedAnnouncement = await addDocument('announcements', newAnnouncement);
    setAnnouncements(prev => [addedAnnouncement, ...prev]);
  };
  
  const addBidToTicket = async (ticketId: string, bidData: Omit<JobBid, 'id'>) => {
      const newBid = { ...bidData, id: `bid-${Date.now()}` };
      const ticketRef = doc(db, 'faultTickets', ticketId);
      await updateDoc(ticketRef, {
          bids: arrayUnion(newBid),
          status: 'Pending Approval'
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? {...t, bids: [...t.bids, newBid], status: 'Pending Approval'} : t));
  };
  
  const updateTicketStatus = async (ticketId: string, status: FaultTicket['status'], updates: Partial<FaultTicket> = {}) => {
      const ticketRef = doc(db, 'faultTickets', ticketId);
      await updateDoc(ticketRef, { status, ...updates });
      setTickets(prev => prev.map(t => t.id === ticketId ? {...t, status, ...updates} : t));
  };

  const addNewUser = async (name: string, email: string): Promise<TenantUser> => {
    const newUser: Omit<TenantUser, 'id'> = {
      name,
      email,
      userType: 'General Tenant',
      leasedRoomId: null,
      leaseStartDate: null,
      leaseEndDate: null,
      rentAmount: 0,
      rentDueDate: '',
      rentStatus: 'Paid',
      warnings: [],
      leaseExtensionRequest: null,
      nextTenant: null,
      trustees: [],
      events: [],
      goals: [],
      bookingHistory: [],
      rating: null,
      feedbackFromLandlords: [],
    };
    const addedUser = await addDocument('users', newUser);
    setTenants(prev => [...prev, addedUser]);
    return addedUser;
  }

  return (
    <DataContext.Provider value={{ tickets, complaints, announcements, tenants, loading, addTicket, addComplaint, addAnnouncement, addBidToTicket, updateTicketStatus, addNewUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
