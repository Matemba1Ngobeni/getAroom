

import React, { useState, useContext } from 'react';
import type { Room, Filters } from './types';
import { MAX_PRICE } from './constants';
import { UserContext } from './contexts/UserContext';
import { RoomContext } from './contexts/RoomContext';
import Header from './components/Header';
import RoomGrid from './components/RoomGrid';
import RoomDetailModal from './components/RoomDetailModal';
import Footer from './components/Footer';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import LoginModal from './components/LoginModal';
import DatabaseSetup from './components/DatabaseSetup';

export type Page = 'home' | 'signup' | 'dashboard' | 'profile';

function App() {
  const { user } = useContext(UserContext);
  const { rooms, newlyAddedRooms, guestHouses, loading } = useContext(RoomContext);
  const [page, setPage] = useState<Page>('home');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    price: MAX_PRICE,
    amenities: [],
    rating: 0,
    minOccupancy: 1,
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = (targetPage: Page) => {
    setPage(targetPage);
    window.scrollTo(0, 0);
  };

  // If no user is logged in, they can't be on the dashboard or profile page.
  if (!user && (page === 'dashboard' || page === 'profile')) {
    setPage('home');
  }

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = (room.pricing.nightly || Infinity) <= filters.price;

    const matchesRating = room.rating >= filters.rating;

    const matchesAmenities = filters.amenities.every(amenity =>
      room.amenities.includes(amenity)
    );
    
    const matchesOccupancy = room.maxOccupancy >= filters.minOccupancy;

    return matchesSearch && matchesPrice && matchesRating && matchesAmenities && matchesOccupancy;
  });
  
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      );
    }

    switch(page) {
      case 'signup':
        return <SignUpPage onNavigate={navigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage onNavigate={navigate} />;
      case 'home':
      default:
        return (
          <>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-12 py-8">
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
                  Find Your Perfect Stay
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                  Explore our curated selection of beautiful rooms and find the perfect space for your next getaway.
                </p>
              </div>

              {rooms.length === 0 ? (
                <DatabaseSetup />
              ) : (
                <>
                  <SearchAndFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                  
                  <section className="my-20">
                    <div className="flex justify-between items-baseline mb-8">
                      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Newly Added</h2>
                      <button className="text-teal-600 font-semibold hover:text-teal-700 transition-colors flex items-center group">
                        View more
                        <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                      </button>
                    </div>
                    <RoomGrid rooms={newlyAddedRooms} onSelectRoom={handleSelectRoom} />
                  </section>

                  <section className="my-20">
                    <div className="flex justify-between items-baseline mb-8">
                      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Most Popular Guest Houses</h2>
                      <button className="text-teal-600 font-semibold hover:text-teal-700 transition-colors flex items-center group">
                        View more guest houses
                        <i className="fas fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"></i>
                      </button>
                    </div>
                    <RoomGrid rooms={guestHouses} onSelectRoom={handleSelectRoom} />
                  </section>

                  <section className="my-20">
                    <div className="text-center mb-12">
                      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Explore All Rooms</h2>
                      <p className="mt-2 text-slate-500">Use the search and filters above to find exactly what you're looking for.</p>
                    </div>
                    <RoomGrid rooms={filteredRooms} onSelectRoom={handleSelectRoom} />
                  </section>
                </>
              )}


            </main>
            {selectedRoom && (
              <RoomDetailModal
                room={selectedRoom}
                onClose={handleCloseModal}
                onNavigate={navigate}
              />
            )}
            <Footer />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onNavigate={navigate}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        page={page}
      />
      {renderPage()}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

export default App;
