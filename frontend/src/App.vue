<template>
  <div class="app-layout">
    <aside v-if="!$route.meta.hideSidebar" class="sidebar">
      <div class="logo">TaskMaster <span>Pro</span></div>
      
      <nav class="nav-links">
        <router-link to="/">Dashboard</router-link>

        <template v-if="userRole === 'manager'">
          <div class="menu-label">ADMINISTRARE</div>
          <router-link to="/manage-tasks"> Manage tasks </router-link>
          <router-link to="/team"> My team</router-link>
          <router-link to="/reports"> Raports </router-link>
        </template>

        <template v-if="userRole === 'user'">
          <div class="menu-label">TASKS</div>
          <router-link to="/my-tasks">My tasks</router-link>
          <router-link to="/history">History</router-link>        
        </template>

        <div class="menu-label">SISTEM</div>
        <router-link to="/settings">Settings</router-link>
      </nav>

      <div class="user-control">
        <p>Logged as: <strong>{{ userRole }}</strong></p>
        <button @click="toggleRole" class="btn-toggle">Schimbă în {{ userRole === 'manager' ? 'User' : 'Manager' }}</button>
      </div>
    </aside>

<main :class="{ 'main-content': !$route.meta.hideSidebar }">      
  <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

const userRole = ref('user');//este rolul default
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (user.email.includes('admin') || user.email.includes('manager')) {
        userRole.value = 'manager';
      } else {
        userRole.value = 'user';
      }
    }
  });
});

const handleLogout = async () => {
  try {
    await signOut(auth);
    router.push('/login');
  } catch (error) {
    console.error("Eroare la logout:", error);
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
.btn-toggle {
  margin-top: 10px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
}

.main-content { margin-left: 260px; flex-grow: 1; padding: 30px; }

@media (max-width: 768px) {
  .sidebar { width: 70px; padding: 10px; align-items: center; }
  .menu-label, .logo span, .user-control p, .nav-links a span { display: none; }
  .main-content { margin-left: 70px; }
}
</style>