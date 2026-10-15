// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3eoWbhFiYV0wkS4YiFMb8KC-W5GspWKk",
  authDomain: "health-wise-b1842.firebaseapp.com",
  projectId: "health-wise-b1842",
  storageBucket: "health-wise-b1842.firebasestorage.app",
  messagingSenderId: "705837986202",
  appId: "1:705837986202:web:94bf3cb7d905266b984a23",
  measurementId: "G-66MT740STL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
