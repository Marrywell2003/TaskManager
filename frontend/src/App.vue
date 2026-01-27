<template>
  <div class="app-layout">
    <aside v-if="!$route.meta.hideSidebar" class="sidebar">
      <div class="logo">TaskMaster</div>
      
      <nav class="nav-links">
        <router-link to="/">Dashboard</router-link>

        <template v-if="authStore.isManager">
          <div class="menu-label">ADMINISTRARE</div>
          <router-link to="/manage-tasks"> Manage tasks </router-link>
          <!-- <router-link to="/reports"> Raports </router-link> -->
        </template>

        <template v-if="authStore.userRole === 'Employee'">
          <div class="menu-label">TASKS</div>
          <router-link to="/my-tasks">My tasks</router-link>
          <router-link to="/history">History</router-link>        
        </template>

      </nav>

      <div class="user-control">
        <p>User: <strong>{{ authStore.userName }}</strong></p>
        <p>Role: <small>{{ authStore.userRole }}</small></p>
        
        <AppButton variant="danger" @click="handleLogout">
          Logout
        </AppButton>
      </div>
    </aside>

<main :class="{ 'main-content': !$route.meta.hideSidebar, 'auth-layout': $route.meta.hideSidebar }">      
  <router-view />
</main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import AppButton from '@/components/AppButton.vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  onAuthStateChanged(auth, async(user) => {
    if (user) {
      try {
        //const token = await user.getIdToken();

        const response = await apiService.getUserProfile(user.uid);
        authStore.saveUserSession(response.data); 
      } catch (error) {
        console.error("Error fetching user role:", error);
        if (error.response?.status === 401) {
          authStore.clearSession();
        }
      }
    } else {
      authStore.clearSession();
    }
  });
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    authStore.clearSession();
    router.push('/login');
  } catch (error) {
    console.error("Logout error :", error);
  }
};
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: sans-serif; background-color: #f4f7f6; color: #333; }

.app-layout { display: flex; min-height: 100vh; }


.sidebar {
  width: 260px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: fixed;
  height: 100vh;
  z-index: 100;
}

.logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 40px; color: #3498db; }
.logo span { color: white; }

.menu-label {
  font-size: 0.7rem;
  color: #7f8c8d;
  margin: 20px 0 10px 10px;
  letter-spacing: 1px;
}

.nav-links { display: flex; flex-direction: column; gap: 10px; flex-grow: 1; }
.nav-links a {
  color: #bdc3c7;
  text-decoration: none;
  padding: 12px 15px;
  border-radius: 8px;
  transition: 0.3s;
  font-size: 0.95rem;
}
.nav-links a:hover, .nav-links a.router-link-active {
  background: #34495e;
  color: white;
}

.user-control { border-top: 1px solid #34495e; padding-top: 20px; font-size: 0.8rem; }


.auth-layout {
  flex-grow: 1;
  display: flex;
  justify-content: center; 
  align-items: center;     
  min-height: 100vh;
  width: 100%;             
}

.main-content {
  margin-left: 260px;
  flex-grow: 1;
  padding: 30px;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .sidebar { width: 70px; padding: 10px; align-items: center; }
  .menu-label, .logo span, .user-control p, .nav-links a span { display: none; }
  .main-content { margin-left: 70px; }
  .auth-layout { margin-left: 0;}
}
</style>