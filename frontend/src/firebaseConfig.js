import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Baza de date cerută în Etapa 3
import { getAuth } from "firebase/auth";       // Pentru autentificarea de mai târziu

const firebaseConfig = {
  apiKey: "AIzaSyAxcBUSE1-qKTgPkN9a7U8yYByGcb5fdKY",
  authDomain: "taskmanager---proiect-tic.firebaseapp.com",
  projectId: "taskmanager---proiect-tic",
  storageBucket: "taskmanager---proiect-tic.firebasestorage.app",
  messagingSenderId: "243917092210",
  appId: "1:243917092210:web:057691d26d551cf8b219eb",
  measurementId: "G-MB6EBVVK6Z"
};

// Inițializăm aplicația
const app = initializeApp(firebaseConfig);

// Inițializăm serviciile și le exportăm pentru a fi folosite în componente
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;