<template>
  <div class="manager-tasks-page">
    <div class="header-actions">
      <h1>Manage tasks</h1>
      <AppButton @click="toggleCreate" variant="primary">
        {{ showForm ? '✖ Close form' : '+ Add new task' }}
      </AppButton>
    </div>

    <transition name="slide">
      <div v-if="showForm" class="form-wrapper">
        <TaskForm 
        :task-to-edit="selectedTask"
        @task-created="handleSuccess"
        @task-updated="handleSuccess"
        @cancel="closeForm" />
      </div>
    </transition>

    <div class="list-section">
      <div class="filters-bar">
        <h3>List of tasks</h3>
        </div>
      
      <TaskList 
      :tasks="taskStore.tasks" 
      :loading="taskStore.loading"
      @edit-task="handleEdit" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import TaskForm from '@/components/TaskForm.vue';
import TaskList from '@/components/TaskList.vue';
import AppButton from '@/components/AppButton.vue';

const taskStore = useTaskStore();
const showForm = ref(false); 
const authStore=useAuthStore();
const selectedTask = ref(null);

const toggleCreate = () => {
  selectedTask.value = null; 
  showForm.value = !showForm.value;
};

const handleEdit = (task) => {
  selectedTask.value = { ...task }; 
  showForm.value = true;     
  window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

const handleSuccess = () => {
  showForm.value = false;
  selectedTask.value = null;
};

const closeForm = () => {
  showForm.value = false;
  selectedTask.value = null;
};

onMounted(() => {
  if (authStore.uid) {
    taskStore.fetchUserTasks(authStore.uid, 'manager');
  } else {
    console.error("Manager not logged");
  }
});
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.form-wrapper {
  margin-bottom: 30px;
  border-bottom: 2px solid #edf2f7;
  padding-bottom: 30px;
}

.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>