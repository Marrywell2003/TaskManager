
import apiService from '@/services/apiService';

export const taskService = {
  async addTask(taskData) {
    const response = await apiService.createTask(taskData);
    return response.data.id;
  },
  async getTasks() {
    const response = await apiService.getAllTasks();
    return response.data;
  }
};