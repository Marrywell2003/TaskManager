// import { db } from '../firebaseConfig';
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import apiService from '@/services/apiService';
//const tasksCollection = collection(db, 'tasks');

export const taskService = {
  async addTask(taskData) {
    const response = await apiService.createTask(taskData);
    return response.data.id;
    // try {
    //   const docRef = await addDoc(tasksCollection, taskData);
    //   return docRef.id;
    // } catch (error) {
    //   console.error("Error - add task: ", error);
    //   throw error;
    // }
  },

  async getTasks() {
    const response = await apiService.getAllTasks();
    return response.data;
    // try {
    //   const snapshot = await getDocs(tasksCollection);
    //   return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // } catch (error) {
    //   console.error("Error- get task: ", error);
    //   throw error;
    // }
  }
};