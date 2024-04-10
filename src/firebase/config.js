import {initializeApp} from 'firebase/app'
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBcGZlPLbjiggPG87NW3RCwrHK2444N4fA",
  authDomain: "socialmedia-dd727.firebaseapp.com",
  projectId: "socialmedia-dd727",
  storageBucket: "socialmedia-dd727.appspot.com",
  messagingSenderId: "893589073761",
  appId: "1:893589073761:web:b1ddf052ee14b2d6019f20",
  measurementId: "G-QWGRZ33HWC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();

