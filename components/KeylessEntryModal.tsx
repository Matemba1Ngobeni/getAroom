
import React, { useEffect } from 'react';

interface KeylessEntryModalProps {
  onClose: () => void;
}

const InfoStep: React.FC<{ icon: string; title: string; description: string; step: number; }> = ({ icon, title, description, step }) => (
    <div className="flex items-start space-x-4 relative">
        <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-200"></div>
        <div className="flex-shrink-0 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 text-teal-600 font-bold text-lg">
            {step}
        </div>
        <div>
            <div className="flex items-center space-x-3">
                 <i className={`fas ${icon} text-slate-500`}></i>
                 <h4 className="font-bold text-slate-800">{title}</h4>
            </div>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
        </div>
    </div>
);


const KeylessEntryModal: React.FC<KeylessEntryModalProps> = ({ onClose }) => {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl overflow-hidden w-full max-w-3xl max-h-[90vh] flex flex-col animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-6 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">How Keyless Entry Works</h2>
            <p className="text-slate-500">Simple, secure access at your fingertips.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors z-10">
            <i className="fas fa-times text-2xl"></i>
          </button>
        </header>
        
        <main className="p-6 md:p-8 flex-grow overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Tenants Section */}
                <div>
                    <h3 className="text-lg font-semibold text-teal-600 mb-4">For Tenants</h3>
                    <div className="space-y-6">
                        <InfoStep 
                            step={1}
                            icon="fa-user-check" 
                            title="Download the App" 
                            description="After your tenancy is approved, you'll get a link to download the 'GetAccess' mobile app." 
                        />
                        <InfoStep 
                            step={2}
                            icon="fa-key" 
                            title="Secure Your Digital Key" 
                            description="Log in on the app. It will generate a unique digital key based on your phone and user details, keeping your access secure." 
                        />
                         <InfoStep 
                            step={3}
                            icon="fa-wifi" 
                            title="Connect & Sync" 
                            description="For first-time setup, connect to the residential Wi-Fi. The app automatically links your digital key to your room's smart lock." 
                        />
                         <InfoStep 
                            step={4}
                            icon="fa-mobile-alt" 
                            title="Tap to Unlock" 
                            description="The app will show your name, room number, and door status (Locked/Unlocked). Just tap a button to control your door." 
                        />
                    </div>
                </div>

                {/* For Trustees Section */}
                <div>
                     <h3 className="text-lg font-semibold text-cyan-600 mb-4">For Trustees (Remote Access)</h3>
                     <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center"><i className="fas fa-shield-alt text-slate-500 mr-2"></i>Landlord Approved</h4>
                            <p className="text-sm text-slate-600 mt-1">For everyone's security, only trustees pre-approved by the landlord can be granted remote access by a tenant.</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center"><i className="fas fa-user-plus text-slate-500 mr-2"></i>Tenant Grants Access</h4>
                            <p className="text-sm text-slate-600 mt-1">A tenant can grant access to an approved trustee from their dashboard. The trustee logs into the web app with their own account to use it.</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center"><i className="fas fa-paper-plane text-slate-500 mr-2"></i>Requesting Access</h4>
                            <p className="text-sm text-slate-600 mt-1">If a trustee needs entry, they can request access. The tenant receives a notification to approve or deny this one-time or temporary request.</p>
                        </div>
                         <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <h4 className="font-semibold text-slate-800 flex items-center"><i className="fas fa-lock text-slate-500 mr-2"></i>Access is Specific</h4>
                            <p className="text-sm text-slate-600 mt-1">When a trustee is granted access, the lock/unlock function will only work for the specific room they've been approved for.</p>
                        </div>
                     </div>
                </div>
            </div>
        </main>
        
        <footer className="p-6 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
            <button onClick={onClose} className="bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                Got it!
            </button>
        </footer>
      </div>
    </div>
  );
};

export default KeylessEntryModal;
