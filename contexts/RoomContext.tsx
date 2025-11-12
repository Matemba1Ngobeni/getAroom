import React, { createContext, useState, ReactNode, useMemo, useEffect } from 'react';
import type { Room } from '../types';
import { getCollection, addDocument } from '../services/firestoreService';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  roomsMap: Map<number, Room>;
  newlyAddedRooms: Room[];
  guestHouses: Room[];
  addRoom: (roomData: Omit<Room, 'id' | 'rating' | 'imageUrl'> & { imageUrl?: string }) => Promise<Room>;
}

export const RoomContext = createContext<RoomContextType>({
  rooms: [],
  loading: true,
  roomsMap: new Map(),
  newlyAddedRooms: [],
  guestHouses: [],
  addRoom: async () => { throw new Error('addRoom function not implemented'); },
});

interface RoomProviderProps {
  children: ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
        setLoading(true);
        const roomsData = await getCollection<Room>('rooms');
        setRooms(roomsData);
        setLoading(false);
    };
    fetchRooms();
  }, []);

  const addRoom = async (roomData: Omit<Room, 'id' | 'rating' | 'imageUrl'> & { imageUrl?: string }): Promise<Room> => {
    const highestId = rooms.reduce((max, r) => Math.max(r.id, max), 0);
    // Fix: Construct a full `Room` object with the correct types before saving and updating state.
    const newRoom: Room = {
      ...roomData,
      id: highestId + 1, // This is the numeric ID for the app's logic
      rating: 0,
      imageUrl: roomData.imageUrl || `https://picsum.photos/seed/room${highestId + 1}/800/600`,
      pricing: { // With types.ts change, properties are optional
          hourly: roomData.pricing?.hourly,
          nightly: roomData.pricing?.nightly,
          monthly: roomData.pricing?.monthly,
      }
    };
    // addDocument saves to Firestore. We don't need its return value which would have a string doc ID.
    await addDocument('rooms', newRoom);
    // Update state with the correctly typed `newRoom` object.
    setRooms(prevRooms => [...prevRooms, newRoom]);
    return newRoom;
  };
  
  const roomsMap = useMemo(() => new Map(rooms.map(room => [room.id, room])), [rooms]);
  const newlyAddedRooms = useMemo(() => [...rooms].sort((a,b) => b.id - a.id).slice(0, 3), [rooms]);
  // This logic for guest houses is based on mock data IDs, might need adjustment
  const guestHouses = useMemo(() => rooms.filter(r => r.name.toLowerCase().includes('guesthouse')), [rooms]);


  return (
    <RoomContext.Provider value={{ rooms, loading, roomsMap, newlyAddedRooms, guestHouses, addRoom }}>
      {children}
    </RoomContext.Provider>
  );
};