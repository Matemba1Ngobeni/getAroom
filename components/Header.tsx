
import React, { useState, useEffect, useRef, useContext } from 'react';
import type { Page } from '../App';
import { UserContext } from '../contexts/UserContext';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onOpenLoginModal: () => void;
  page: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenLoginModal, page }) => {
  const { user, logout } = useContext(UserContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setIsProfileMenuOpen(false);
    logout();
    onNavigate('home');
  }
  
  const handleNavigation = (page: Page) => {
      setIsProfileMenuOpen(false);
      onNavigate(page);
  }

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => onNavigate('home')} className="flex items-center space-x-2 cursor-pointer">
            <i className="fas fa-door-open text-2xl text-teal-600"></i>
            <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">Get.A.Room</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                 <button
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  className="text-slate-500 hover:text-teal-600 transition-colors focus:outline-none"
                  aria-label="View profile menu"
                  title="Profile Menu"
                >
                  <i className="fas fa-user-circle text-3xl"></i>
                </button>
                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-fade-in">
                        <button onClick={() => handleNavigation('dashboard')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-teal-600">
                           <i className="fas fa-tachometer-alt w-6 mr-2"></i> Dashboard
                        </button>
                        <button onClick={() => handleNavigation('profile')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-teal-600">
                            <i className="fas fa-user-edit w-6 mr-2"></i> Profile
                        </button>
                        <div className="border-t my-1 border-slate-200"></div>
                        <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-red-600">
                           <i className="fas fa-sign-out-alt w-6 mr-2"></i> Sign Out
                        </button>
                    </div>
                )}
              </div>
            ) : (
              <>
                <button onClick={onOpenLoginModal} className="bg-white text-teal-600 border border-teal-600 px-4 py-2 rounded-full font-semibold hover:bg-teal-50 transition-all duration-300 text-sm">
                  Sign In
                </button>
                <button onClick={() => onNavigate('signup')} className="bg-teal-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-teal-700 transition-all duration-300 text-sm">
                  Sign Up
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;