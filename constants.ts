

import type { Room, Service, PropertyType, Announcement, FaultTicket, TenantUser, Complaint, LandlordUser, ServiceProviderUser, BookingApplication } from './types';

export const ROOMS_DATA: Room[] = [
  {
    id: 1,
    name: 'Cozy Downtown Loft',
    location: 'New York, USA',
    pricing: { nightly: 250, monthly: 6000 },
    imageUrl: 'https://picsum.photos/seed/loft/800/600',
    description: 'A stylish and cozy loft in the heart of the city. Perfect for solo travelers or couples looking to explore the urban landscape. Features a king-sized bed and a stunning view of the skyline.',
    amenities: ['Wi-Fi', 'Kitchen', 'Air Conditioning', 'TV', 'City View'],
    rating: 4.9,
    maxOccupancy: 2,
  },
  {
    id: 2,
    name: 'Beachfront Paradise Villa',
    location: 'Bali, Indonesia',
    pricing: { nightly: 450, monthly: 12000 },
    imageUrl: 'https://picsum.photos/seed/bali/800/600',
    description: 'Escape to this luxurious beachfront villa with a private pool. Wake up to the sound of waves and enjoy breathtaking sunsets from your patio. An unforgettable tropical getaway.',
    amenities: ['Wi-Fi', 'Private Pool', 'Beach Access', 'Kitchen', 'Free Parking'],
    rating: 5.0,
    maxOccupancy: 4,
  },
  {
    id: 3,
    name: 'Rustic Mountain Cabin',
    location: 'Aspen, USA',
    pricing: { nightly: 320, monthly: 8500 },
    imageUrl: 'https://picsum.photos/seed/cabin/800/600',
    description: 'Nestled in the serene mountains, this rustic cabin offers a peaceful retreat. Ideal for hiking enthusiasts and those seeking tranquility. Features a cozy fireplace and panoramic mountain views.',
    amenities: ['Fireplace', 'Wi-Fi', 'Kitchen', 'Heating', 'Mountain View'],
    rating: 4.8,
    maxOccupancy: 4,
  },
  {
    id: 4,
    name: 'Chic Parisian Apartment',
    location: 'Paris, France',
    pricing: { nightly: 280, monthly: 7000 },
    imageUrl: 'https://picsum.photos/seed/paris/800/600',
    description: 'Experience the charm of Paris in this elegant apartment. Located in a historic neighborhood, it\'s just a short walk from famous landmarks and quaint cafes. A true romantic escape.',
    amenities: ['Wi-Fi', 'Kitchen', 'Elevator', 'TV', 'Historic Building'],
    rating: 4.7,
    maxOccupancy: 2,
  },
  {
    id: 5,
    name: 'Modern Lakeside House',
    location: 'Queenstown, New Zealand',
    pricing: { nightly: 380, monthly: 10000 },
    imageUrl: 'https://picsum.photos/seed/lakehouse/800/600',
    description: 'A stunning modern house with direct access to the lake. Floor-to-ceiling windows provide spectacular views of the water and surrounding mountains. Perfect for adventure and relaxation.',
    amenities: ['Lake Access', 'Wi-Fi', 'Full Kitchen', 'Patio', 'Free Parking'],
    rating: 4.9,
    maxOccupancy: 6,
  },
  {
    id: 6,
    name: 'Serene Japanese Ryokan',
    location: 'Kyoto, Japan',
    pricing: { nightly: 400 },
    imageUrl: 'https://picsum.photos/seed/kyoto/800/600',
    description: 'Immerse yourself in traditional Japanese culture at this authentic ryokan. Features tatami mat floors, a private onsen (hot spring), and exquisite kaiseki dining options.',
    amenities: ['Onsen', 'Wi-Fi', 'Garden View', 'Traditional Breakfast', 'Air Conditioning'],
    rating: 5.0,
    maxOccupancy: 2,
  },
];

export const GUEST_HOUSES_DATA: Room[] = [
  {
    id: 7,
    name: 'The Garden View Guesthouse',
    location: 'Savannah, USA',
    pricing: { nightly: 180, hourly: 25 },
    imageUrl: 'https://picsum.photos/seed/guesthouse1/800/600',
    description: 'Charming guesthouse with a beautiful private garden. Enjoy a peaceful stay with southern hospitality.',
    amenities: ['Wi-Fi', 'Garden View', 'Free Parking', 'Kitchenette'],
    rating: 4.9,
    maxOccupancy: 2,
  },
  {
    id: 8,
    name: 'Lakeside Retreat Guesthouse',
    location: 'Lake Como, Italy',
    pricing: { nightly: 280 },
    imageUrl: 'https://picsum.photos/seed/guesthouse2/800/600',
    description: 'A cozy guesthouse offering stunning views of Lake Como. Perfect for a romantic getaway.',
    amenities: ['Wi-Fi', 'Lake Access', 'Patio', 'Air Conditioning'],
    rating: 4.8,
    maxOccupancy: 3,
  },
  {
    id: 9,
    name: 'The Artist\'s Loft Guesthouse',
    location: 'Amsterdam, Netherlands',
    pricing: { nightly: 220, monthly: 5500 },
    imageUrl: 'https://picsum.photos/seed/guesthouse3/800/600',
    description: 'Stay in a unique loft-style guesthouse in the vibrant heart of Amsterdam, surrounded by canals and art.',
    amenities: ['Wi-Fi', 'Kitchen', 'Historic Building', 'TV'],
    rating: 4.7,
    maxOccupancy: 2,
  },
  {
    id: 10,
    name: 'Coastal Charm Guesthouse',
    location: 'Cornwall, UK',
    pricing: { nightly: 195 },
    imageUrl: 'https://picsum.photos/seed/guesthouse4/800/600',
    description: 'A delightful guesthouse just steps from the rugged Cornish coast. Ideal for walkers and beach lovers.',
    amenities: ['Wi-Fi', 'Beach Access', 'Fireplace', 'Free Parking'],
    rating: 4.9,
    maxOccupancy: 2,
  },
];


const ALL_ROOMS = [...ROOMS_DATA, ...GUEST_HOUSES_DATA];
export const ALL_ROOMS_MAP = new Map(ALL_ROOMS.map(room => [room.id, room]));


// Dynamically generate a list of all unique amenities from the data
const allAmenities = new Set<string>();
ALL_ROOMS.forEach(room => room.amenities.forEach(amenity => allAmenities.add(amenity)));
export const ALL_AMENITIES = Array.from(allAmenities).sort();

// Dynamically find the maximum price for the filter slider based on nightly rates
export const MAX_PRICE = Math.ceil(Math.max(...ALL_ROOMS.map(r => r.pricing.nightly || 0)) / 10) * 10;

// New constants for sign-up flow
export const ALL_SERVICES: Service[] = ['Plumbing', 'Electrical', 'Cleaning', 'Gardening', 'General Repairs', 'Painting', 'HVAC'];
export const ALL_PROPERTY_TYPES: PropertyType[] = ['Private Rooms', 'Guest Houses', 'Entire Houses', 'Apartments'];


// --- MOCK DATA FOR DASHBOARDS ---
export const MOCK_LANDLORD_ID = 'landlord-abc';

// Simplified basic tenant info for general use (e.g., trustee selection)
export const MOCK_TENANTS = [
    { id: 'tenant-456', name: 'John Smith', email: 'john.smith@example.com' },
    { id: 'tenant-789', name: 'Alice Johnson', email: 'alice.j@example.com' },
    { id: 'tenant-101', name: 'Bob Williams', email: 'b.williams@example.com' },
    { id: 'student-123', name: 'Jane Doe', email: 'jane.doe@university.edu' },
    { id: 'another-tenant', name: 'Chris Green', email: 'chris.g@example.com' },
    { id: 'applicant-1', name: 'Emily White', email: 'emily.white@example.com' },
    { id: 'applicant-2', name: 'Michael Brown', email: 'michael.b@example.com' },
];

export const ALL_TENANTS_MAP = new Map(MOCK_TENANTS.map(t => [t.id, t]));

export const MOCK_SERVICE_PROVIDERS_LIST = [
    { id: 'sp-plumb-1', name: 'FlowRight Plumbers' },
    { id: 'sp-general-1', name: 'HandyMan Services' },
    { id: 'sp-hvac-1', name: 'CoolBreeze HVAC' },
];

export const MOCK_BOOKING_APPLICATIONS: BookingApplication[] = [
    {
        id: 'app-1',
        tenantId: 'applicant-1', // Emily White
        roomId: 1, // Cozy Downtown Loft
        status: 'Pending',
        applicationDate: '2024-08-01',
        messageToLandlord: 'Hi, I\'m a quiet and clean professional looking for a place for the next 6 months. Your loft looks perfect!',
        numberOfAdults: 1,
        numberOfChildren: 0,
    },
    {
        id: 'app-2',
        tenantId: 'applicant-2', // Michael Brown
        roomId: 4, // Chic Parisian Apartment
        status: 'Pending',
        applicationDate: '2024-07-31',
        messageToLandlord: 'Interested in renting for a month. Could you confirm if high-speed internet is available?',
        numberOfAdults: 2,
        numberOfChildren: 0,
    },
    {
        id: 'app-3',
        tenantId: 'tenant-101', // Bob Williams
        roomId: 5,
        status: 'Approved',
        applicationDate: '2024-07-20',
        numberOfAdults: 1,
        numberOfChildren: 1,
    }
];

export const COMPLAINTS_DATA: Complaint[] = [
    {
        id: 'comp-1',
        filedById: 'student-123',
        filedAgainst: { id: 'landlord-abc', name: 'Property Manager', type: 'Landlord' },
        reason: 'The landlord has not responded to my maintenance requests for over a week.',
        status: 'Pending',
        date: '2024-07-28',
    },
    {
        id: 'comp-2',
        filedById: 'tenant-456',
        filedAgainst: { id: 'student-123', name: 'Jane Doe', type: 'Tenant' },
        reason: 'Loud music played late at night on multiple occasions.',
        status: 'Resolved',
        date: '2024-07-15',
    },
    {
        id: 'comp-3',
        filedById: 'landlord-abc',
        filedAgainst: { id: 'another-tenant', name: 'Chris Green', type: 'Tenant' },
        reason: 'Unauthorized guest staying over for an extended period.',
        status: 'Pending',
        date: '2024-07-30',
    }
];

// --- Full Mock User Accounts ---

// Calculate future dates for lease end and rent due
const getDateInFuture = (months = 0, days = 0) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
};

const getRentDueDate = () => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
};


export const MOCK_TENANT_USERS: TenantUser[] = [
    // Jane Doe (Student) - Rents room 2 (not from this landlord)
    {
      id: 'student-123',
      name: 'Jane Doe',
      email: 'jane.doe@university.edu',
      userType: 'Student',
      leasedRoomId: 2, // Beachfront Paradise Villa
      leaseStartDate: getDateInFuture(-3),
      leaseEndDate: getDateInFuture(3),
      rentAmount: 12000,
      rentDueDate: getRentDueDate(),
      rentStatus: 'Paid',
      warnings: [],
      leaseExtensionRequest: null,
      nextTenant: { name: 'Alex Ray' },
      trustees: [ 
          { id: 'tenant-456', name: 'John Smith', email: 'john.smith@example.com' }, 
          { id: 'tenant-789', name: 'Alice Johnson', email: 'trustee.alice@example.com' } 
      ],
      events: [
        { id: 'evt-1', title: 'Calculus II Lecture', category: 'Timetable', date: getDateInFuture(0, 2), startTime: '10:00', endTime: '11:30' },
        { id: 'evt-2', title: 'History Paper Due', category: 'Assignment', date: getDateInFuture(0, 5) },
      ],
      goals: [{
          id: 'goal-1', title: 'Ace Midterm Exams', description: 'Prepare for midterms.',
          tasks: [ { id: 'task-1-1', text: 'Review all Calculus lecture notes', completed: true }, { id: 'task-1-2', text: 'Complete history reading list', completed: false } ]
      }],
      bookingHistory: [{ bookingId: 'hist-1', roomId: 1, roomName: 'Cozy Downtown Loft', landlordId: 'landlord-abc', startDate: '2024-03-10', endDate: '2024-03-15', reviewed: false }],
      rating: 4.8,
      feedbackFromLandlords: [{ landlordName: 'Property Manager', rating: 5, comment: 'Jane has been an excellent tenant.', date: '2024-06-15' }]
    },
    // John Smith - Rents room 1 (from this landlord) - Rent is OVERDUE
    {
      id: 'tenant-456',
      name: 'John Smith',
      email: 'john.smith@example.com',
      userType: 'General Tenant',
      leasedRoomId: 1, // Cozy Downtown Loft
      leaseStartDate: getDateInFuture(-6),
      leaseEndDate: getDateInFuture(6),
      rentAmount: 6000,
      rentDueDate: getRentDueDate().replace(/\d{4}/, (new Date().getFullYear() - 1).toString()), // Due last month
      rentStatus: 'Overdue',
      warnings: [],
      leaseExtensionRequest: null,
      nextTenant: null,
      trustees: [], events: [], goals: [], bookingHistory: [],
      rating: 4.2,
      feedbackFromLandlords: []
    },
    // Alice Johnson - Rents room 4 (from this landlord) - Pending lease extension
    {
      id: 'tenant-789',
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      userType: 'General Tenant',
      leasedRoomId: 4, // Chic Parisian Apartment
      leaseStartDate: getDateInFuture(-11),
      leaseEndDate: getDateInFuture(1),
      rentAmount: 7000,
      rentDueDate: getRentDueDate(),
      rentStatus: 'Paid',
      warnings: [],
      leaseExtensionRequest: { status: 'Pending', requestedEndDate: getDateInFuture(13) }, // Request to extend by 12 months
      nextTenant: null,
      trustees: [{id: 'trustee-1', name: 'Sarah Connor', email: 'sarah.c@example.com'}], events: [], goals: [], bookingHistory: [],
      rating: 4.9,
      feedbackFromLandlords: []
    },
    // Chris Green - Rents room 5 (from this landlord) - Has a warning
    {
      id: 'another-tenant',
      name: 'Chris Green',
      email: 'chris.g@example.com',
      userType: 'General Tenant',
      leasedRoomId: 5, // Modern Lakeside House
      leaseStartDate: getDateInFuture(-2),
      leaseEndDate: getDateInFuture(10),
      rentAmount: 10000,
      rentDueDate: getRentDueDate(),
      rentStatus: 'Paid',
      warnings: ['First warning issued for noise complaint on 2024-07-25.'],
      leaseExtensionRequest: null,
      nextTenant: null,
      trustees: [], events: [], goals: [], bookingHistory: [],
      rating: 3.8,
      feedbackFromLandlords: []
    }
];


export const MOCK_LANDLORD_USER_ACCOUNT: LandlordUser = {
    id: 'landlord-abc',
    name: 'Peter Jones',
    email: 'peter.jones@propertymgmt.com',
    userType: 'Landlord',
    propertyTypes: ['Private Rooms', 'Apartments'],
    managedProperties: [1, 4, 5], // IDs for Cozy Downtown Loft, Chic Parisian Apartment, Modern Lakeside House
    reviews: [],
};

export const MOCK_SERVICE_PROVIDER_USER_ACCOUNT: ServiceProviderUser = {
    id: 'sp-general-1',
    name: 'HandyMan Services',
    email: 'contact@handyman.com',
    userType: 'Service Provider',
    services: ['General Repairs', 'Painting'],
    averageRating: 4.7,
    serviceFeedback: [
        {
            clientName: 'Peter Jones (Landlord)',
            rating: 5,
            comment: 'Very professional and fixed the issue quickly. Highly recommend.',
            date: '2024-07-22',
        },
        {
            clientName: 'Jane Doe (Tenant)',
            rating: 4.5,
            comment: 'They did a good job with the repairs, though they arrived a bit later than scheduled.',
            date: '2024-07-21',
        }
    ]
};

export const ALL_MOCK_USERS = [...MOCK_TENANT_USERS, MOCK_LANDLORD_USER_ACCOUNT, MOCK_SERVICE_PROVIDER_USER_ACCOUNT];
export const ALL_USERS_MAP = new Map(ALL_MOCK_USERS.map(u => [u.id, u]));

export const ANNOUNCEMENTS_DATA: Announcement[] = [
    {
        id: 'anno-1',
        author: 'Get.A.Room',
        title: 'Platform Maintenance Scheduled',
        content: 'We will be performing scheduled maintenance on Sunday from 2 AM to 3 AM. The platform may be temporarily unavailable.',
        date: '2024-07-28',
    },
    {
        id: 'anno-2',
        author: 'Landlord', // This would be the landlord's name in a real app
        title: 'Quarterly Pest Control',
        content: 'Please be advised that pest control services will be conducted in all units on August 5th between 10 AM and 4 PM.',
        date: '2024-07-25',
    }
];

export const FAULT_TICKETS_DATA: FaultTicket[] = [
    {
        id: 'ticket-1',
        roomId: 2,
        tenantId: 'student-123',
        landlordId: MOCK_LANDLORD_ID,
        description: 'The kitchen sink is leaking from the faucet base. It\'s a constant drip.',
        category: 'Plumbing',
        status: 'Pending Approval',
        reportedAt: '2024-07-29',
        bids: [
            { id: 'bid-1', serviceProviderId: 'sp-plumb-1', serviceProviderName: 'FlowRight Plumbers', amount: 120, notes: 'Can fix this tomorrow morning. Includes parts and labor.' },
            { id: 'bid-2', serviceProviderId: 'sp-general-1', serviceProviderName: 'HandyMan Services', amount: 95, notes: 'Available this afternoon. Standard faucet repair.' },
        ],
        tenantConfirmedResolved: false,
        landlordConfirmedResolved: false,
    },
    {
        id: 'ticket-2',
        roomId: 2,
        tenantId: 'student-123',
        landlordId: MOCK_LANDLORD_ID,
        description: 'The main bedroom light fixture is flickering and sometimes doesn\'t turn on.',
        category: 'Electrical',
        status: 'Reported',
        reportedAt: '2024-07-28',
        bids: [],
        tenantConfirmedResolved: false,
        landlordConfirmedResolved: false,
    },
    {
        id: 'ticket-3',
        roomId: 2,
        tenantId: 'student-123',
        landlordId: MOCK_LANDLORD_ID,
        description: 'The air conditioning unit is making a loud rattling noise.',
        category: 'General Repairs',
        status: 'In Progress',
        reportedAt: '2024-07-20',
        bids: [
             { id: 'bid-3', serviceProviderId: 'sp-hvac-1', serviceProviderName: 'CoolBreeze HVAC', amount: 250, notes: 'Sounds like a fan blade issue. We are on our way.' },
        ],
        tenantConfirmedResolved: false,
        landlordConfirmedResolved: false,
    },
     {
        id: 'ticket-4',
        roomId: 5,
        tenantId: 'another-tenant',
        landlordId: MOCK_LANDLORD_ID,
        description: 'Front door lock is stiff and difficult to turn.',
        category: 'General Repairs',
        status: 'Resolved',
        reportedAt: '2024-07-15',
        bids: [],
        tenantConfirmedResolved: true,
        landlordConfirmedResolved: true,
    },
     {
        id: 'ticket-5',
        roomId: 1,
        tenantId: 'tenant-456',
        landlordId: MOCK_LANDLORD_ID,
        description: 'Wi-Fi is not connecting in the living room area.',
        category: 'Other',
        status: 'Pending Confirmation',
        reportedAt: '2024-07-25',
        bids: [],
        tenantConfirmedResolved: true,
        landlordConfirmedResolved: false,
    },
];