import React, { createContext, useState, ReactNode, useEffect } from 'react';
import type { BookingApplication } from '../types';
import { getCollection, addDocument } from '../services/firestoreService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface BookingContextType {
  bookings: BookingApplication[];
  addBookingApplication: (application: Omit<BookingApplication, 'id' | 'status' | 'applicationDate'>) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: 'Approved' | 'Rejected') => Promise<void>;
}

export const BookingContext = createContext<BookingContextType>({
  bookings: [],
  addBookingApplication: async () => {},
  updateBookingStatus: async () => {},
});

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<BookingApplication[]>([]);

  useEffect(() => {
      const fetchBookings = async () => {
          const bookingsData = await getCollection<BookingApplication>('bookingApplications');
          setBookings(bookingsData);
      };
      fetchBookings();
  }, []);

  const addBookingApplication = async (application: Omit<BookingApplication, 'id' | 'status' | 'applicationDate'>) => {
    const newApplicationData: Omit<BookingApplication, 'id'> = {
      ...application,
      status: 'Pending',
      applicationDate: new Date().toISOString().split('T')[0],
      messageToLandlord: application.messageToLandlord || 'I would like to book this room.'
    };
    const newApplication = await addDocument('bookingApplications', newApplicationData);
    setBookings(prevBookings => [newApplication, ...prevBookings]);
  };

  const updateBookingStatus = async (bookingId: string, status: 'Approved' | 'Rejected') => {
    const bookingRef = doc(db, 'bookingApplications', bookingId);
    await updateDoc(bookingRef, { status });
    setBookings(prev => prev.map(b => (b.id === bookingId ? { ...b, status } : b)));
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      alert(`Email notification sent to applicant: Your application has been ${status}.`);
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, addBookingApplication, updateBookingStatus }}>
      {children}
    </BookingContext.Provider>
  );
};
