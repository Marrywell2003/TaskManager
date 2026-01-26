<template>
  <div class="employee-tasks-page">
    <div class="header-section">
      <h1>Asignated tasks</h1>
      <p class="welcome-msg">Hi, <strong>{{ authStore.userName }}</strong>! Your list of tasks !</p>
    </div>

    <div class="list-section">
      <TaskList 
        :tasks="activeTasks" 
        :loading="taskStore.loading" 
      />
      
      <div v-if="!taskStore.loading && activeTasks.length === 0" class="no-tasks">
        <p>Not a single task in sight.Just relax!! ☕</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted,computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import TaskList from '@/components/TaskList.vue';

const taskStore = useTaskStore();
const authStore = useAuthStore();

const activeTasks = computed(() => {
  return taskStore.tasks.filter(t => t.status !== 'done');
});

onMounted(async () => {
  const currentUid = authStore.uid || localStorage.getItem('uid');
  if (currentUid) {
    await taskStore.fetchUserTasks(currentUid, 'employee');
  } else {
    console.error();
  }
});
</script>

<style scoped>
.employee-tasks-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  margin-bottom: 30px;
}

.welcome-msg {
  color: #64748b;
  font-size: 1.1rem;
  margin-top: 5px;
}

.list-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden; 
}

.no-tasks {
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-style: italic;
}

h1 {
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 700;
}
</style>