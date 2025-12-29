
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "charts-editions.firebaseapp.com",
  projectId: "charts-editions",
  storageBucket: "charts-editions.firebasestorage.app",
  messagingSenderId: "69782483955",
  appId: "1:69782483955:web:8838e53d49fa89ca945886",
  measurementId: "G-HGN2092Z96"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);