


export interface Room {
  id: number;
  name: string;
  location: string;
  pricing: {
    // Fix: Made pricing properties optional as not all rooms have all pricing types.
    hourly?: number;
    nightly?: number;
    monthly?: number;
  };
  imageUrl: string;
  description: string;
  amenities: string[];
  rating: number;
  maxOccupancy: number;
}

export interface Filters {
  price: number;
  amenities: string[];
  rating: number;
  minOccupancy: number;
}

export type UserType = 'Student' | 'Landlord' | 'Service Provider' | 'General Tenant' | 'Trustee';

// --- New User and Role-Specific Types ---

export type Service = 'Plumbing' | 'Electrical' | 'Cleaning' | 'Gardening' | 'General Repairs' | 'Painting' | 'HVAC';
export type PropertyType = 'Private Rooms' | 'Guest Houses' | 'Entire Houses' | 'Apartments';

interface BaseUser {
  id: string;
  name: string;
  email: string;
}

export interface Trustee {
    id: string;
    name: string;
    email: string;
}

export interface Complaint {
    id: string;
    filedById: string;
    filedAgainst: {
        id: string;
        name: string;
        type: 'Landlord' | 'Tenant' | 'Service Provider';
    };
    reason: string;
    status: 'Pending' | 'Resolved';
    date: string;
}

// --- New Time Manager Types ---

export type TimeManagerEventCategory = 'Timetable' | 'Assignment' | 'Test' | 'Appointment' | 'Study' | 'Birthday' | 'Rent Due' | 'Sleep' | 'Exercise' | 'Personal';

export interface TimeManagerEvent {
    id: string;
    title: string;
    category: TimeManagerEventCategory;
    date: string; // YYYY-MM-DD
    startTime?: string; // HH:MM
    endTime?: string; // HH:MM
    notes?: string;
}

export interface GoalTask {
    id: string;
    text: string;
    completed: boolean;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    tasks: GoalTask[];
}

export interface BookingHistoryEntry {
    bookingId: string;
    roomId: number;
    roomName: string;
    landlordId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    reviewed: boolean;
}

export interface FeedbackFromLandlord {
    landlordName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface ReviewOfLandlord {
    tenantId: string;
    tenantName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface FeedbackFromClient {
    clientName: string;
    rating: number;
    comment: string;
    date: string;
}

export interface TenantUser extends BaseUser {
  userType: 'Student' | 'General Tenant';
  leasedRoomId: number | null;
  leaseStartDate: string | null;
  leaseEndDate: string | null;
  rentAmount: number;
  rentDueDate: string; // YYYY-MM-DD
  rentStatus: 'Paid' | 'Overdue';
  warnings: string[]; // Array of warning messages from the landlord
  leaseExtensionRequest: {
      status: 'Pending' | 'Approved' | 'Rejected';
      requestedEndDate: string; // YYYY-MM-DD
  } | null;
  nextTenant: { name: string } | null;
  trustees: Trustee[];
  events: TimeManagerEvent[];
  goals: Goal[];
  bookingHistory: BookingHistoryEntry[];
  rating: number | null;
  feedbackFromLandlords: FeedbackFromLandlord[];
}

export interface LandlordUser extends BaseUser {
  userType: 'Landlord';
  propertyTypes: PropertyType[];
  managedProperties: number[]; // Array of Room IDs
  reviews: ReviewOfLandlord[];
}

export interface ServiceProviderUser extends BaseUser {
  userType: 'Service Provider';
  services: Service[];
  averageRating: number | null;
  serviceFeedback: FeedbackFromClient[];
}

export interface TrusteeUser extends BaseUser {
    userType: 'Trustee';
    tenantInTrust: {
        id: string;
        name: string;
        leasedRoomId: number | null;
    };
}

export type User = TenantUser | LandlordUser | ServiceProviderUser | TrusteeUser;

// --- New Dashboard Feature Types ---
export type FaultCategory = 'Plumbing' | 'Electrical' | 'General Repairs' | 'Other';

export interface JobBid {
  id: string;
  serviceProviderId: string;
  serviceProviderName: string;
  amount: number;
  notes: string;
}

export interface FaultTicket {
  id: string;
  roomId: number;
  tenantId: string;
  landlordId: string;
  description: string;
  category: FaultCategory;
  status: 'Reported' | 'Pending Approval' | 'In Progress' | 'Pending Confirmation' | 'Resolved';
  reportedAt: string;
  bids: JobBid[];
  tenantConfirmedResolved: boolean;
  landlordConfirmedResolved: boolean;
}

export interface Announcement {
    id: string;
    author: 'Get.A.Room' | string; // Platform or Landlord Name
    title: string;
    content: string;
    date: string;
}

export interface BookingApplication {
  id: string;
  tenantId: string;
  roomId: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  applicationDate: string;
  messageToLandlord?: string;
  referrerId?: string;
  numberOfAdults: number;
  numberOfChildren: number;
}