
import React, { createContext, useState, ReactNode } from 'react';
import type { User } from '../types';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
  createUser: (userData: User) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: async () => {},
  createUser: async () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };
  
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, updatedData);
    setUser(currentUser => {
      if (!currentUser) return null;
      return { ...currentUser, ...updatedData } as User;
    });
  };

  const createUser = async (userData: User) => {
      const userRef = doc(db, 'users', userData.id);
      await setDoc(userRef, userData);
      login(userData);
  };


  return (
    <UserContext.Provider value={{ user, login, logout, updateUser, createUser }}>
      {children}
    </UserContext.Provider>
  );
};
