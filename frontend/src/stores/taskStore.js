import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false
  }),
  actions: {
    async fetchTasks() {
      this.loading = true;
      try {
        const response = await apiService.getAllTasks();
        this.tasks = response.data;
      } catch (error) {
        console.error("Error at loading the tasks!!", error);
      } finally {
        this.loading = false;
      }
    },
    async addTask(taskData) {
      try {
        const response = await apiService.createTask(taskData);
        this.tasks.push(response.data); 
      } catch (error) {
        throw error;
      }
    }
  }
});