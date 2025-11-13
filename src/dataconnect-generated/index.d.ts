import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  roomId: UUIDString;
  startDate: DateString;
  endDate: DateString;
  totalPrice: number;
  status: string;
}

export interface CreateSampleUserData {
  user_insert: User_Key;
}

export interface DigitalKey_Key {
  id: UUIDString;
  __typename?: 'DigitalKey_Key';
}

export interface GetRoomByIdData {
  room?: {
    id: UUIDString;
    name: string;
    address: string;
    pricePerNight: number;
    description: string;
  } & Room_Key;
}

export interface GetRoomByIdVariables {
  id: UUIDString;
}

export interface ListAvailableRoomsData {
  rooms: ({
    id: UUIDString;
    name: string;
    address: string;
    pricePerNight: number;
  } & Room_Key)[];
}

export interface Room_Key {
  id: UUIDString;
  __typename?: 'Room_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateSampleUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSampleUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateSampleUserData, undefined>;
  operationName: string;
}
export const createSampleUserRef: CreateSampleUserRef;

export function createSampleUser(): MutationPromise<CreateSampleUserData, undefined>;
export function createSampleUser(dc: DataConnect): MutationPromise<CreateSampleUserData, undefined>;

interface GetRoomByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
  operationName: string;
}
export const getRoomByIdRef: GetRoomByIdRef;

export function getRoomById(vars: GetRoomByIdVariables): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;
export function getRoomById(dc: DataConnect, vars: GetRoomByIdVariables): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface ListAvailableRoomsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableRoomsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableRoomsData, undefined>;
  operationName: string;
}
export const listAvailableRoomsRef: ListAvailableRoomsRef;

export function listAvailableRooms(): QueryPromise<ListAvailableRoomsData, undefined>;
export function listAvailableRooms(dc: DataConnect): QueryPromise<ListAvailableRoomsData, undefined>;

