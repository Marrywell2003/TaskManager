import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth' 
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/apiService';
import ManagerTasksView from '@/views/ManagerTasksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true } 
    },
  //   { 
  //    path: '/dashboard-manager', 
  //    name: 'manager-dash', 
  //    component: () => import('../views/ManagerDashboard.vue'),
  //    meta: { requiresAuth: true, role: 'Manager' } 
  //   },
  //  { 
  //    path: '/dashboard-employee', 
  //    name: 'employee-dash', 
  //    component: () => import('../views/EmployeeDashboard.vue'),
  //    meta: { requiresAuth: true, role: 'Employee' } 
  //  },
    { 
      path: '/login', 
      name: 'login', 
      component: () => import('../views/LoginView.vue'), 
      meta: { hideSidebar: true }
    },
    { 
      path: '/register', 
      name: 'register', 
      component: () => import('../views/RegisterView.vue'),
      meta: { hideSidebar: true } 
    },
    {
    path: '/manage-tasks', 
    name: 'ManageTasks',
    component: ManagerTasksView
    },
    {
    path: '/history',
    name: 'History',
    component: () => import('@/views/HistoryTasksView.vue'),
    //meta: { requiresAuth: true, role: 'Employee' }
    },
    {
    path: '/my-tasks', 
    name: 'MyTasks',
    component: () => import('@/views/EmployeeTasksView.vue'), 
    //meta: { requiresAuth: true, role: 'Employee' } 
    }
  ],

  
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      auth,
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore();
  const user = await getCurrentUser();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !user) {
    return next({ name: 'login' });
  }

  if ((to.name === 'login' || to.name === 'register') && user) {
    return next({ name: 'home' });
  }

  if (user && !authStore.userRole) {
    try {
      const response = await apiService.getUserProfile(user.uid);
      authStore.saveUserSession(response.data);
    } catch (error) {
      console.error("Error at retrieving profile:", error);
      return next({ name: 'login' });
    }
  }

  // const requiredRole = to.meta.role;
  // if (requiredRole && authStore.userRole) {
  //   alert("Access restricted !");
    
  //   const fallback = authStore.isManager ? '/manage-tasks' : '/my-tasks';
  //   return next(fallback);
  // }

  next();
});

export default router