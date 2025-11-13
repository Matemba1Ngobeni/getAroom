const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'getaroom',
  location: 'europe-central2'
};
exports.connectorConfig = connectorConfig;

const createSampleUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSampleUser');
}
createSampleUserRef.operationName = 'CreateSampleUser';
exports.createSampleUserRef = createSampleUserRef;

exports.createSampleUser = function createSampleUser(dc) {
  return executeMutation(createSampleUserRef(dc));
};

const getRoomByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoomById', inputVars);
}
getRoomByIdRef.operationName = 'GetRoomById';
exports.getRoomByIdRef = getRoomByIdRef;

exports.getRoomById = function getRoomById(dcOrVars, vars) {
  return executeQuery(getRoomByIdRef(dcOrVars, vars));
};

const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';
exports.createBookingRef = createBookingRef;

exports.createBooking = function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
};

const listAvailableRoomsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableRooms');
}
listAvailableRoomsRef.operationName = 'ListAvailableRooms';
exports.listAvailableRoomsRef = listAvailableRoomsRef;

exports.listAvailableRooms = function listAvailableRooms(dc) {
  return executeQuery(listAvailableRoomsRef(dc));
};
