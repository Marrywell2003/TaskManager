import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth";       

const firebaseConfig = {
  apiKey: "AIzaSyAxcBUSE1-qKTgPkN9a7U8yYByGcb5fdKY",
  authDomain: "taskmanager---proiect-tic.firebaseapp.com",
  projectId: "taskmanager---proiect-tic",
  storageBucket: "taskmanager---proiect-tic.firebasestorage.app",
  messagingSenderId: "243917092210",
  appId: "1:243917092210:web:057691d26d551cf8b219eb",
  measurementId: "G-MB6EBVVK6Z"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default {auth,db};