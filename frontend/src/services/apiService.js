import axios from 'axios';
import { auth } from '@/firebaseConfig';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// interceptor pentru Token-ul din fiecare request
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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
  },
  registerUser(userData) {
    return apiClient.post('/users/register', userData);
  },
  getUserProfile(uid) {
    return apiClient.get(`/users/profile/${uid}`);
  }
};