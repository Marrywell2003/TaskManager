<template>
  <div class="history-page">
    <div class="header-section">
      <h1>History of tasks</h1>
      <p>List of finished tasks</p>
    </div>

    <div class="list-section">
      <TaskList 
        :tasks="completedTasks" 
        :loading="taskStore.loading" 
      />
      
      <div v-if="!taskStore.loading && completedTasks.length === 0" class="no-data">
        <p>You don't have anything finished! Good luck with your work!!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import TaskList from '@/components/TaskList.vue';

const taskStore = useTaskStore();
const authStore = useAuthStore();

const completedTasks = computed(() => {
  return taskStore.tasks.filter(t => t.status === 'done');
});

onMounted(() => {
  if (authStore.uid) {
    taskStore.fetchUserTasks(authStore.uid, 'employee');
  }
});
</script>

<style scoped>
.history-page { padding: 20px; max-width: 1200px; margin: 0 auto; }
.header-section { margin-bottom: 25px; }
.no-data { padding: 50px; text-align: center; color: #64748b; }
</style>