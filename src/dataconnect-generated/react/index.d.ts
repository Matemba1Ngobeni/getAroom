import { CreateSampleUserData, GetRoomByIdData, GetRoomByIdVariables, CreateBookingData, CreateBookingVariables, ListAvailableRoomsData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateSampleUser(options?: useDataConnectMutationOptions<CreateSampleUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateSampleUserData, undefined>;
export function useCreateSampleUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSampleUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateSampleUserData, undefined>;

export function useGetRoomById(vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;
export function useGetRoomById(dc: DataConnect, vars: GetRoomByIdVariables, options?: useDataConnectQueryOptions<GetRoomByIdData>): UseDataConnectQueryResult<GetRoomByIdData, GetRoomByIdVariables>;

export function useCreateBooking(options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;
export function useCreateBooking(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBookingData, FirebaseError, CreateBookingVariables>): UseDataConnectMutationResult<CreateBookingData, CreateBookingVariables>;

export function useListAvailableRooms(options?: useDataConnectQueryOptions<ListAvailableRoomsData>): UseDataConnectQueryResult<ListAvailableRoomsData, undefined>;
export function useListAvailableRooms(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableRoomsData>): UseDataConnectQueryResult<ListAvailableRoomsData, undefined>;
