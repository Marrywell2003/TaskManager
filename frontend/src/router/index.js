import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true } 
    },
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const user = await getCurrentUser();

  // onAuthStateChanged(auth, (user) => {
  //   if (requiresAuth && !user) {
  //     next({ name: 'login' });
  //   } else if ((to.name === 'login' || to.name === 'register') && user) {
  //     next({ name: 'home' });
  //   } else {
  //     next();
  //   }
  // });

  if (requiresAuth && !user) {
    next({ name: 'login' });
  } else if ((to.name === 'login' || to.name === 'register') && user) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router