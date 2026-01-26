import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userRole: localStorage.getItem('userRole') || null,
    userName: localStorage.getItem('userName') || null,
    uid: localStorage.getItem('uid') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.userRole,
    isManager: (state) => state.userRole?.toLowerCase() === 'manager'
  },

  actions: {
    saveUserSession(userData) {
      this.userRole = userData.role;
      this.userName = userData.fullName;
      this.uid = userData.uid;

      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userName', userData.fullName);
      localStorage.setItem('uid', userData.uid); 
    },

    clearSession() {
      this.userRole = null;
      this.userName = null;
      this.uid = null;
      //localStorage.removeItem('userRole');
      //localStorage.removeItem('userName');
      localStorage.clear();
    }
  }
});