import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDUHSeTdWUwEYtCNg-W6bN82W9Blg_-hRo",
  authDomain: "apexcharts-dea12.firebaseapp.com",
  databaseURL: "https://apexcharts-dea12-default-rtdb.firebaseio.com",
  projectId: "apexcharts-dea12",
  storageBucket: "apexcharts-dea12.firebasestorage.app",
  messagingSenderId: "534970736489",
  appId: "1:534970736489:web:62c82102c37505e8dca7f8",
  measurementId: "G-SHZ9C1CYBH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
