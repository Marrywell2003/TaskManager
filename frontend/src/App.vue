<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="logo">TaskMaster <span>Pro</span></div>
      
      <nav class="nav-links">
        <router-link to="/">Dashboard</router-link>

        <template v-if="userRole === 'manager'">
          <router-link to="/team-tasks">Echipă</router-link>
          <router-link to="/reports">Rapoarte</router-link>
        </template>

        <template v-if="userRole === 'user'">
          <router-link to="/my-tasks">Task-urile mele</router-link>
        </template>

        <router-link to="/about">Despre</router-link>
      </nav>

      <div class="user-control">
        <p>Rol: <strong>{{ userRole }}</strong></p>
        <button @click="toggleRole" class="btn-toggle">Schimbă în {{ userRole === 'manager' ? 'User' : 'Manager' }}</button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const userRole = ref('manager');

const toggleRole = () => {
  userRole.value = userRole.value === 'manager' ? 'user' : 'manager';
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
  padding: 25px;
  position: fixed; 
  height: 100vh;
}

.logo { font-size: 1.5rem; font-weight: bold; margin-bottom: 40px; color: #3498db; }
.logo span { color: white; }

.nav-links { display: flex; flex-direction: column; gap: 10px; flex-grow: 1; }
.nav-links a {
  color: #bdc3c7;
  text-decoration: none;
  padding: 12px;
  border-radius: 6px;
  transition: 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-active {
  background: #34495e;
  color: white;
}

.user-control { border-top: 1px solid #34495e; padding-top: 20px; font-size: 0.8rem; }
.btn-toggle {
  margin-top: 10px;
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.main-content { margin-left: 260px; flex-grow: 1; padding: 30px; }

@media (max-width: 768px) {
  .sidebar { width: 70px; padding: 10px; align-items: center; }
  .logo, .nav-links a span, .user-control { display: none; }
  .main-content { margin-left: 70px; }
}
</style>