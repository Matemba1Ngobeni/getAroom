
import React, { useState } from 'react';
import KeylessEntryModal from './KeylessEntryModal';

const KeylessEntry: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section 
        className="bg-slate-100/70 rounded-2xl p-8 md:p-12 my-16 cursor-pointer group hover:bg-slate-200/50 transition-colors duration-300"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Seamless Access</h2>
            <h3 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Introducing Keyless Entry
            </h3>
            <p className="mt-6 text-lg text-slate-600">
              Unlock a new level of convenience. Our Keyless Entry system allows you to manage access to your room from anywhere, granting temporary access to guests without ever needing a physical key.
            </p>
            <div className="mt-8 space-y-5">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white">
                    <i className="fas fa-mobile-alt text-2xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-bold text-slate-900">Your Phone is the Key</h4>
                  <p className="mt-1 text-base text-slate-500">
                    Use the 'getAccess' mobile app or your tenant dashboard to lock and unlock your door with a single tap.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-teal-600 text-white">
                    <i className="fas fa-share-alt text-2xl"></i>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-bold text-slate-900">Grant Access Remotely</h4>
                  <p className="mt-1 text-base text-slate-500">
                    Securely share digital keys with friends, family, or service providers for specific times or one-time entry.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-8 text-sm font-semibold text-teal-600 group-hover:underline">Click to learn more &rarr;</p>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1608293344645-ec3c4a25a4ac?q=80&w=800&h=1000&auto=format&fit=crop" 
              alt="Person using a phone to unlock a smart door lock"
              className="rounded-lg shadow-lg w-full max-w-sm h-auto object-cover"
            />
          </div>
        </div>
      </section>
      {isModalOpen && <KeylessEntryModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default KeylessEntry;
