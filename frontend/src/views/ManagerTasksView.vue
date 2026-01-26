<template>
  <div class="manager-tasks-page">
    <div class="header-actions">
      <h1>Gestionare Sarcini</h1>
      <AppButton @click="showForm = !showForm" variant="primary">
        {{ showForm ? '✖ Închide Formular' : '+ Adaugă Task Nou' }}
      </AppButton>
    </div>

    <transition name="slide">
      <div v-if="showForm" class="form-wrapper">
        <TaskForm @task-created="showForm = false" />
      </div>
    </transition>

    <div class="list-section">
      <div class="filters-bar">
        <h3>Lista Sarcinilor</h3>
        </div>
      
      <TaskList :tasks="taskStore.tasks" :loading="taskStore.loading" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import TaskForm from '@/components/TaskForm.vue';
import TaskList from '@/components/TaskList.vue';
import AppButton from '@/components/AppButton.vue';

const taskStore = useTaskStore();
const showForm = ref(false); // Implicit, formularul este ascuns

onMounted(() => {
  taskStore.fetchTasks();
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

/* Animație pentru deschidere lină */
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-20px); }
</style>