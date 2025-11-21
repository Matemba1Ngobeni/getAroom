// IMPORTANT: Replace the placeholder values below with your own Firebase project configuration.
// You can find this in your Firebase project settings.

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3R1hyxqJzGeHcF_8fZi4vIwdDa5MM9Ec",
  authDomain: "gen-lang-client-0682381335.firebaseapp.com",
  projectId: "gen-lang-client-0682381335",
  storageBucket: "gen-lang-client-0682381335.firebasestorage.app",
  messagingSenderId:" Y2253628174827",
  appId: "1:253628174827:web:1994d783f912fc1c4bc9ae"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
