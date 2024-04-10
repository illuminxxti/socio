import {initializeApp} from 'firebase/app'
import {getAuth,createUserWithEmailAndPassword} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD6JV3q2QW9JpgY-JI3fyoFA8KFtBl3PkA",
  authDomain: "socialmedia-45aff.firebaseapp.com",
  projectId: "socialmedia-45aff",
  storageBucket: "socialmedia-45aff.appspot.com",
  messagingSenderId: "592834821187",
  appId: "1:592834821187:web:079e62850cf76b9a6b28f6",
  measurementId: "G-E0BG88SBH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();

