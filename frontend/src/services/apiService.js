import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

export default {
  getStats() {
    return apiClient.get('/stats/summary');
  },
  getStatus() {
    return apiClient.get('/status');
  },
  getActivities() {
    return apiClient.get('/activity');
  }
};