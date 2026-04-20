import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcA6S77H_YiqWiuVItTtrNe2_DWtg1TQQ",
  authDomain: "end-term-project-82251.firebaseapp.com",
  projectId: "end-term-project-82251",
  storageBucket: "end-term-project-82251.firebasestorage.app",
  messagingSenderId: "106279362680",
  appId: "1:106279362680:web:e7770603f8c22cae45cd8d",
  measurementId: "G-X8LVRCJ43Z"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
