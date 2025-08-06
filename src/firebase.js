import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

let db = null;
let isFirebaseAvailable = false;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyAl5pj7KaLOD923V59K_UGmleN0jQ8zTyw",
    authDomain: "test-abb2e.firebaseio.com",
    projectId: "test-abb2e",
    storageBucket: "https://test-abb2e.firebaseio.com",
    messagingSenderId: "186458589488",
    appId: "1:186458589488:web:d043a730f12eec79ad60f5",
  };

  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseAvailable = true;
    console.log("Firebase initialized");
  } else {
    console.log("No Firebase config - running offline only");
  }
} catch (error) {
  console.log("Firebase initialization failed - running offline only");
}

export { db, isFirebaseAvailable };

export const isFirebaseReady = () => isFirebaseAvailable && db !== null;
