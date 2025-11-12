import { collection, getDocs, writeBatch, doc, getDoc, setDoc, updateDoc, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { Room, User, BookingApplication, Complaint, FaultTicket, Announcement } from '../types';
import { ROOMS_DATA, ALL_MOCK_USERS, MOCK_BOOKING_APPLICATIONS, COMPLAINTS_DATA, FAULT_TICKETS_DATA, ANNOUNCEMENTS_DATA } from '../constants';

// --- Generic Firestore Functions ---

export const getCollection = async <T>(collectionName: string): Promise<T[]> => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        // Fix: The original implementation `({ ...doc.data(), id: doc.id })` overwrote the numeric `id` from the data
        // with the string document ID from Firestore. The new implementation `({ id: doc.id, ...doc.data() })` ensures
        // that if an `id` field exists in the document's data (like our numeric room IDs), it takes precedence.
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    } catch (error) {
        console.error(`Error fetching collection ${collectionName}:`, error);
        return [];
    }
};

export const addDocument = async <T extends object>(collectionName: string, data: T): Promise<T & { id: string }> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return { ...data, id: docRef.id };
    } catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
};

// --- Database Seeding Function ---

export const seedDatabase = async (): Promise<void> => {
    console.log("Starting database seed...");
    const batch = writeBatch(db);

    // Check if rooms are already seeded to prevent duplicates
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    if (roomsSnapshot.empty) {
        console.log("Seeding rooms...");
        ROOMS_DATA.forEach(room => {
            const docRef = doc(collection(db, 'rooms'));
            batch.set(docRef, room);
        });
    } else {
        console.log("Rooms collection already exists. Skipping seed.");
    }
    
    // Check if users are already seeded
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.empty) {
        console.log("Seeding users...");
        ALL_MOCK_USERS.forEach(user => {
             // Use the predefined ID for mock users
            const docRef = doc(db, 'users', user.id);
            batch.set(docRef, user);
        });
    } else {
        console.log("Users collection already exists. Skipping seed.");
    }
    
    const seedCollection = async (name: string, data: any[]) => {
        const snapshot = await getDocs(collection(db, name));
        if (snapshot.empty) {
            console.log(`Seeding ${name}...`);
            data.forEach(item => {
                 const docRef = item.id ? doc(db, name, item.id) : doc(collection(db, name));
                 batch.set(docRef, item);
            });
        } else {
            console.log(`${name} collection already exists. Skipping seed.`);
        }
    };

    await seedCollection('bookingApplications', MOCK_BOOKING_APPLICATIONS);
    await seedCollection('complaints', COMPLAINTS_DATA);
    await seedCollection('faultTickets', FAULT_TICKETS_DATA);
    await seedCollection('announcements', ANNOUNCEMENTS_DATA);

    try {
        await batch.commit();
        console.log("Database seeded successfully!");
        alert("Database has been initialized with sample data. Please refresh the page.");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("There was an error initializing the database. Check the console for details.");
    }
};