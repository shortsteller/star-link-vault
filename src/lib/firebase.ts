import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0Wfui0Sf0Ng14JVifFFaxE4tGCkRjGEo",
  authDomain: "uditas-creation.firebaseapp.com",
  projectId: "uditas-creation",
  storageBucket: "uditas-creation.firebasestorage.app",
  messagingSenderId: "603482346784",
  appId: "1:603482346784:web:79a8d3223ecb21c8a4b345",
  measurementId: "G-4K7152C5L4",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
