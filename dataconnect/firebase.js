// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3R1hyxqJzGeHcF_8fZi4vIwdDa5MM9Ec",
  authDomain: "gen-lang-client-0682381335.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0682381335-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gen-lang-client-0682381335",
  storageBucket: "gen-lang-client-0682381335.firebasestorage.app",
  messagingSenderId: "253628174827",
  appId: "1:253628174827:web:1994d783f912fc1c4bc9ae",
  measurementId: "G-7J4VXHZH82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);