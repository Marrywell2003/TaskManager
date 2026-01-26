<template>
  <div class="task-table-container">
    <div class="table-header">
      <div class="col-title">Sarcina</div>
      <div class="col-desc">Descriere</div>
      <div class="col-emp">Responsabil</div>
      <div class="col-mgr">Delegat de</div>
      <div class="col-prio">Prioritate</div>
      <div class="col-date">Termen</div>
      <div class="col-status">Status</div>
    </div>

    <div v-if="loading" class="state-msg loading">
      <div class="spinner"></div>
      <span>Se încarcă sarcinile...</span>
    </div>

    <div v-else-if="tasks.length === 0" class="state-msg empty">
      <p>Nu există nicio sarcină înregistrată.</p>
    </div>

    <div v-else class="table-body">
      <TaskItem 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
      />
    </div>
  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue';

defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.task-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  border: 1px solid #e2e8f0;
}

.table-header, 
:deep(.task-row) {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.2fr 1.2fr 0.8fr 1fr 120px;
  gap: 15px;
  padding: 16px 24px;
  align-items: center;
}

.table-header {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 700;
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  min-width: 1100px; 
}

.state-msg {
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  background: white;
  min-width: 1100px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty p {
  font-style: italic;
  font-size: 0.9rem;
}

.task-table-container::-webkit-scrollbar {
  height: 8px;
}
.task-table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>