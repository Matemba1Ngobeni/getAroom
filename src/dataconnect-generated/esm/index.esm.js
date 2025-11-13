import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'getaroom',
  location: 'europe-central2'
};

export const createSampleUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSampleUser');
}
createSampleUserRef.operationName = 'CreateSampleUser';

export function createSampleUser(dc) {
  return executeMutation(createSampleUserRef(dc));
}

export const getRoomByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoomById', inputVars);
}
getRoomByIdRef.operationName = 'GetRoomById';

export function getRoomById(dcOrVars, vars) {
  return executeQuery(getRoomByIdRef(dcOrVars, vars));
}

export const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';

export function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
}

export const listAvailableRoomsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableRooms');
}
listAvailableRoomsRef.operationName = 'ListAvailableRooms';

export function listAvailableRooms(dc) {
  return executeQuery(listAvailableRoomsRef(dc));
}

