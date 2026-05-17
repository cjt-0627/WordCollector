
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { initializeAuth, indexedDBLocalPersistence, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnvT5n2wUB9WAFuHIrsXT8bDFEP6fb6OY",
  authDomain: "word-collector-62657.firebaseapp.com",
  projectId: "word-collector-62657",
  storageBucket: "word-collector-62657.firebasestorage.app",
  messagingSenderId: "607973663178",
  appId: "1:607973663178:web:f801b8cac8e954bffcef33"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: indexedDBLocalPersistence
});

export const googleProvider = new GoogleAuthProvider();