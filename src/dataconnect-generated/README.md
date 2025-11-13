# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetRoomById*](#getroombyid)
  - [*ListAvailableRooms*](#listavailablerooms)
- [**Mutations**](#mutations)
  - [*CreateSampleUser*](#createsampleuser)
  - [*CreateBooking*](#createbooking)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetRoomById
You can execute the `GetRoomById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getRoomById(vars: GetRoomByIdVariables): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface GetRoomByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
}
export const getRoomByIdRef: GetRoomByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getRoomById(dc: DataConnect, vars: GetRoomByIdVariables): QueryPromise<GetRoomByIdData, GetRoomByIdVariables>;

interface GetRoomByIdRef {
  ...
  (dc: DataConnect, vars: GetRoomByIdVariables): QueryRef<GetRoomByIdData, GetRoomByIdVariables>;
}
export const getRoomByIdRef: GetRoomByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getRoomByIdRef:
```typescript
const name = getRoomByIdRef.operationName;
console.log(name);
```

### Variables
The `GetRoomById` query requires an argument of type `GetRoomByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetRoomByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetRoomById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetRoomByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetRoomByIdData {
  room?: {
    id: UUIDString;
    name: string;
    address: string;
    pricePerNight: number;
    description: string;
  } & Room_Key;
}
```
### Using `GetRoomById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getRoomById, GetRoomByIdVariables } from '@dataconnect/generated';

// The `GetRoomById` query requires an argument of type `GetRoomByIdVariables`:
const getRoomByIdVars: GetRoomByIdVariables = {
  id: ..., 
};

// Call the `getRoomById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getRoomById(getRoomByIdVars);
// Variables can be defined inline as well.
const { data } = await getRoomById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getRoomById(dataConnect, getRoomByIdVars);

console.log(data.room);

// Or, you can use the `Promise` API.
getRoomById(getRoomByIdVars).then((response) => {
  const data = response.data;
  console.log(data.room);
});
```

### Using `GetRoomById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getRoomByIdRef, GetRoomByIdVariables } from '@dataconnect/generated';

// The `GetRoomById` query requires an argument of type `GetRoomByIdVariables`:
const getRoomByIdVars: GetRoomByIdVariables = {
  id: ..., 
};

// Call the `getRoomByIdRef()` function to get a reference to the query.
const ref = getRoomByIdRef(getRoomByIdVars);
// Variables can be defined inline as well.
const ref = getRoomByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getRoomByIdRef(dataConnect, getRoomByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.room);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.room);
});
```

## ListAvailableRooms
You can execute the `ListAvailableRooms` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableRooms(): QueryPromise<ListAvailableRoomsData, undefined>;

interface ListAvailableRoomsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableRoomsData, undefined>;
}
export const listAvailableRoomsRef: ListAvailableRoomsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableRooms(dc: DataConnect): QueryPromise<ListAvailableRoomsData, undefined>;

interface ListAvailableRoomsRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableRoomsData, undefined>;
}
export const listAvailableRoomsRef: ListAvailableRoomsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableRoomsRef:
```typescript
const name = listAvailableRoomsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableRooms` query has no variables.
### Return Type
Recall that executing the `ListAvailableRooms` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableRoomsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListAvailableRoomsData {
  rooms: ({
    id: UUIDString;
    name: string;
    address: string;
    pricePerNight: number;
  } & Room_Key)[];
}
```
### Using `ListAvailableRooms`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableRooms } from '@dataconnect/generated';


// Call the `listAvailableRooms()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableRooms();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableRooms(dataConnect);

console.log(data.rooms);

// Or, you can use the `Promise` API.
listAvailableRooms().then((response) => {
  const data = response.data;
  console.log(data.rooms);
});
```

### Using `ListAvailableRooms`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableRoomsRef } from '@dataconnect/generated';


// Call the `listAvailableRoomsRef()` function to get a reference to the query.
const ref = listAvailableRoomsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableRoomsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.rooms);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.rooms);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateSampleUser
You can execute the `CreateSampleUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createSampleUser(): MutationPromise<CreateSampleUserData, undefined>;

interface CreateSampleUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateSampleUserData, undefined>;
}
export const createSampleUserRef: CreateSampleUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createSampleUser(dc: DataConnect): MutationPromise<CreateSampleUserData, undefined>;

interface CreateSampleUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateSampleUserData, undefined>;
}
export const createSampleUserRef: CreateSampleUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createSampleUserRef:
```typescript
const name = createSampleUserRef.operationName;
console.log(name);
```

### Variables
The `CreateSampleUser` mutation has no variables.
### Return Type
Recall that executing the `CreateSampleUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateSampleUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateSampleUserData {
  user_insert: User_Key;
}
```
### Using `CreateSampleUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createSampleUser } from '@dataconnect/generated';


// Call the `createSampleUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createSampleUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createSampleUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createSampleUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateSampleUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createSampleUserRef } from '@dataconnect/generated';


// Call the `createSampleUserRef()` function to get a reference to the mutation.
const ref = createSampleUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createSampleUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  roomId: UUIDString;
  startDate: DateString;
  endDate: DateString;
  totalPrice: number;
  status: string;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  roomId: ..., 
  startDate: ..., 
  endDate: ..., 
  totalPrice: ..., 
  status: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ roomId: ..., startDate: ..., endDate: ..., totalPrice: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@dataconnect/generated';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  roomId: ..., 
  startDate: ..., 
  endDate: ..., 
  totalPrice: ..., 
  status: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ roomId: ..., startDate: ..., endDate: ..., totalPrice: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

