import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Referința către colecția de task-uri din baza de date
const tasksCollection = collection(db, 'tasks');

export const taskService = {
  // Funcția pentru a adăuga un task nou
  async addTask(taskData) {
    try {
      const docRef = await addDoc(tasksCollection, taskData);
      return docRef.id;
    } catch (error) {
      console.error("Eroare la adăugarea task-ului: ", error);
      throw error;
    }
  },

  // Funcția pentru a prelua toate task-urile
  async getTasks() {
    try {
      const snapshot = await getDocs(tasksCollection);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Eroare la preluarea task-urilor: ", error);
      throw error;
    }
  }
};