import { defineStore } from 'pinia';
import apiService from '@/services/apiService';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false
  }),
  actions: {
    async fetchUserTasks(userId, role) {
     this.loading = true;
     try {
        const res = await apiService.getTasksByRole(userId, role);
        this.tasks = res.data;
     } catch (err) {
        console.error("Error at loading the tasks!!", err);
        //this.tasks = [];
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
    },

    async updateTask(taskId, updatedData) {
     try {
        const response = await apiService.updateTask(taskId, updatedData);
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
         //this.tasks[index] = { ...this.tasks[index], ...updatedData };
         if (response.data && response.data.id) {
            this.tasks[index] = response.data;
          } else {
            this.tasks[index] = { 
              ...this.tasks[index], 
              ...updatedData,
            };
          }
        }
      } catch (error) {
        console.error("Error updating task in store:", error);
        throw error;
      }
    },

    async deleteTask(taskId) {
     try {
       await apiService.deleteTask(taskId);
       this.tasks = this.tasks.filter(task => task.id !== taskId);
       return true;
      } catch (error) {
         console.error("Store error at deletion:", error);
         throw error;
        }
    },


  }
});