<template>
  <div class="task-table-container">
    <div class="table-header">
      <div class="col-title">Task</div>
      <div class="col-desc">Description</div>
      <div class="col-emp">Assigned to</div>
      <div class="col-mgr">Assigned by</div>
      <div class="col-prio">Priority</div>
      <div class="col-date">Deadline</div>
      <div class="col-status">Status</div>
    </div>

    <div v-if="loading" class="state-msg loading">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>

    <div v-else-if="tasks.length === 0" class="state-msg empty">
      <p>No tasks</p>
    </div>

    <div v-else class="table-body">
      <TaskItem 
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        @open-menu="handleOpenMenu"
      />
    </div>

    <div 
      v-if="contextMenu.visible" 
      class="custom-context-menu" 
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
    >
      <div v-if="authStore.isManager" 
        class="menu-item" 
        @click="emitEdit">
        Edit task
      </div>
      <div v-if="authStore.isManager" 
       @click.stop="handleDelete(contextMenu.task)" 
        class="menu-item delete-option">
        Delete task
      </div>
    </div>

  </div>
</template>

<script setup>
import TaskItem from './TaskItem.vue';
import { reactive, onMounted, onUnmounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore'; 
import { useAuthStore } from '@/stores/authStore';

const emit = defineEmits(['edit-task']);
const taskStore = useTaskStore(); 
const authStore = useAuthStore();



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

const contextMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  task: null
});

const handleOpenMenu = ({ event, task }) => {
  contextMenu.x = event.clientX;
  contextMenu.y = event.clientY;
  contextMenu.task = task;
  contextMenu.visible = true;
};

const emitEdit = () => {
  emit('edit-task', contextMenu.task);
  contextMenu.visible = false;
};

const handleDelete = async (task) => {
  if (!task) return;
  console.log("ID Task pentru ștergere:", task.id);
  const confirmed = window.confirm('Are you sure ?');
  if (confirmed) {
    try {
      await taskStore.deleteTask(task.id);
      contextMenu.visible = false;
    } catch (err) {
      alert("Error - delete task!");
      console.error(err);
    }
  }
};

const closeMenu = () => { contextMenu.visible = false; };

onMounted(() => window.addEventListener('click', closeMenu));
onUnmounted(() => window.removeEventListener('click', closeMenu));
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

.custom-context-menu {
  position: fixed;
  z-index: 10000;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  padding: 6px 0;
}

.delete-option {
  color: #ef4444; /* Roșu */
  border-top: 1px solid #f1f5f9;
  font-weight: 500;
}

.delete-option:hover {
  background: #fef2f2 !important; /* Fundal roșiatic la hover */
}

.menu-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #1e293b;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #f1f5f9;
}
</style>