import React, { useState, useContext } from 'react';
import type { UserType, User, Service, PropertyType, Room, TenantUser } from '../types';
import { UserContext } from '../contexts/UserContext';
import { RoomContext } from '../contexts/RoomContext';
import type { Page } from '../App';
import UserTypeSelectionModal from './UserTypeSelectionModal';
import SignUpForm from './SignUpForm';
import ServiceProviderDetailsForm from './ServiceProviderDetailsForm';
import LandlordDetailsForm from './LandlordDetailsForm';
import PropertyRegistrationForm from './PropertyRegistrationForm';

interface SignUpPageProps {
  onNavigate: (page: Page) => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const { createUser } = useContext(UserContext);
  const { addRoom } = useContext(RoomContext);
  const [step, setStep] = useState<'type' | 'details' | 'propertyDetails' | 'personal'>('type');
  const [userType, setUserType] = useState<UserType | null>(null);
  const [details, setDetails] = useState<object>({});
  const [newProperty, setNewProperty] = useState<Omit<Room, 'id' | 'rating' | 'imageUrl'> & { imageUrl?: string } | null>(null);

  const handleTypeSelect = (type: UserType) => {
    setUserType(type);
    if (type === 'Landlord' || type === 'Service Provider') {
      setStep('details');
    } else {
      setStep('personal');
    }
  };

  const handleCancelSignUp = () => {
    onNavigate('home');
  };

  const handleDetailsSubmit = (data: { services?: Service[], propertyTypes?: PropertyType[] }) => {
    setDetails(data);
    if (userType === 'Landlord') {
        setStep('propertyDetails');
    } else {
        setStep('personal');
    }
  };

  const handlePropertySubmit = (propertyData: Omit<Room, 'id' | 'rating' | 'imageUrl'> & { imageUrl?: string }) => {
      setNewProperty(propertyData);
      setStep('personal');
  }

  const handleBackToType = () => {
    setUserType(null);
    setDetails({});
    setStep('type');
  };
  
  const handleBackToDetails = () => {
      setStep('details');
  }

   const handleBackToPropertyForm = () => {
      setStep('propertyDetails');
   }

  const handleFinalSubmit = async (personalData: { name: string, email: string }) => {
    if (!userType) return;

    const id = `user-${Date.now()}`;
    let newUser: User;

    switch (userType) {
      case 'Landlord':
        if (!newProperty) {
            alert("Property details are missing.");
            return;
        }
        const createdRoom = await addRoom(newProperty);
        newUser = {
          id,
          ...personalData,
          userType,
          propertyTypes: (details as { propertyTypes: PropertyType[] }).propertyTypes || [],
          managedProperties: [createdRoom.id],
          reviews: [],
        };
        break;
      case 'Service Provider':
        newUser = {
          id,
          ...personalData,
          userType,
          services: (details as { services: Service[] }).services || [],
          averageRating: null,
          serviceFeedback: [],
        };
        break;
      case 'Student':
      case 'General Tenant':
        newUser = {
          id,
          ...personalData,
          userType,
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
        } as TenantUser;
        break;
      default:
        console.error(`Attempted to sign up with an unsupported user type: ${userType}`);
        return;
    }
    
    await createUser(newUser);
    onNavigate('dashboard');
  };

  const renderStep = () => {
    switch(step) {
      case 'type':
        return <UserTypeSelectionModal onSelect={handleTypeSelect} onCancel={handleCancelSignUp} />;
      case 'details':
        if (userType === 'Landlord') {
          return <LandlordDetailsForm onSubmit={handleDetailsSubmit} onBack={handleBackToType} />;
        }
        if (userType === 'Service Provider') {
          return <ServiceProviderDetailsForm onSubmit={handleDetailsSubmit} onBack={handleBackToType} />;
        }
        // Fallback for other types
        setStep('personal');
        return null;
      case 'propertyDetails':
        if (userType === 'Landlord') {
            return (
                <main className="flex-grow w-full flex items-center justify-center bg-slate-100 py-12 px-4">
                    <PropertyRegistrationForm 
                        onSubmit={handlePropertySubmit} 
                        onBack={handleBackToDetails} 
                        submitButtonText="Continue to Personal Details"
                        isSigningUp
                    />
                </main>
            );
        }
        return null;
      case 'personal':
        if (!userType) return null;
        
        let backAction;
        let backText;

        if (userType === 'Landlord') {
            backAction = handleBackToPropertyForm;
            backText = 'Back to Property Details'
        } else if (userType === 'Service Provider') {
            backAction = handleBackToDetails;
            backText = 'Back to Service Details';
        } else {
            backAction = handleBackToType;
            backText = 'Choose a different role';
        }
        
        return (
          <main className="flex-grow w-full flex items-center justify-center bg-slate-100 py-12 px-4">
            <SignUpForm 
              userType={userType} 
              onBack={backAction} 
              onSubmit={handleFinalSubmit}
              backButtonText={backText}
            />
          </main>
        )
    }
  }

  return <>{renderStep()}</>;
};

export default SignUpPage;
