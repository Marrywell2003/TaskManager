<template>
  <div class="task-row" @contextmenu.prevent="onRightClick">
    <div class="col-title font-bold">{{ task.title }}</div>
    
    <div class="col-desc text-truncate" :title="task.description">
      {{ task.description }}
    </div>
    
    <div class="col-emp">
       <span class="user-tag">{{ task.assignedToName || 'Neasignat' }}</span>
    </div>
    
    <div class="col-mgr">
      <span class="manager-text">{{ task.createdByName || 'Admin' }}</span>
    </div>
    
    <div class="col-prio">
      <span :class="['prio-badge', task.priority || 'medium']">
        {{ task.priority || 'medium' }}
      </span>
    </div>
    
    <div class="col-date">
      {{ formatDate(task.dueDate) }}
    </div>
    
    <div class="col-status">
      <div class="status-wrapper">
        <StatusBadge :status="task.status || 'todo'" />
        <select 
          v-if="canChangeStatus"
          :value="task.status || 'todo'" 
          @change="handleStatusChange"
          class="status-overlay-select"
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>    
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';
import { useTaskStore } from '@/stores/taskStore'; 
import { useAuthStore } from '@/stores/authStore';
import { computed } from 'vue';

const emit = defineEmits(['open-menu']);
const taskStore = useTaskStore();
const authStore = useAuthStore();

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const canChangeStatus = computed(() => {
  const isCorrectEmployee = authStore.uid === props.task.assignedTo;
  const isEmployeeRole = authStore.userRole?.toLowerCase() === 'employee';
  return isCorrectEmployee && isEmployeeRole;});

// console.log("Task:", props.task.title, "Asignat la:", props.task.assignedTo);
// console.log("Eu sunt:", authStore.uid, "Rol:", authStore.role);
// console.log("Pot schimba?", canChangeStatus.value);

const handleStatusChange = async (event) => {
  const newStatus = event.target.value;
  try {
    await taskStore.updateTask(props.task.id, { status: newStatus });
    console.log(`Status changed in: ${newStatus}`);
  } catch (err) {
    console.error("Error-update status:", err);
    alert("Error- at saving ");
  }
};

const onRightClick = (event) => {
  emit('open-menu', { event, task: props.task });
};

const formatDate = (ts) => {
      //verif de ce imi da invalid date
  if (!ts) return '—';
  try {
    let date;
    const seconds = ts?.seconds || ts?._seconds;
    if (typeof seconds === 'number') {
      date = new Date(seconds * 1000);
    } 
    else if (typeof ts.toDate === 'function') {
      date = ts.toDate();
    } 
    else {
      date = new Date(ts);
    }
    if (isNaN(date.getTime())) {
      try {
        const raw = JSON.parse(JSON.stringify(ts));
        if (raw && raw.seconds) {
          date = new Date(raw.seconds * 1000);
        }
      } catch (innerErr) {
        return 'Unknown format';
      }
    }
    if (isNaN(date.getTime())) return 'Invalid date';


    return date.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    console.error("Error-date:", e);
    return 'Error at form';
  }
};
</script>

<style scoped>
.task-row {
  display: grid;
  grid-template-columns: 1.5fr 2fr 1.2fr 1.2fr 0.8fr 1fr 120px;
  gap: 15px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.85rem;
  min-width: 1100px; 
  background: white;
  transition: background 0.2s ease;
  align-items: center;
}
.task-row:hover {
  background-color: #f8fafc;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #64748b;
}
.font-bold {
  font-weight: 600;
  color: #1e293b;
}
.user-tag {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}
.manager-text {
  color: #64748b;
  font-style: italic;
  font-size: 0.8rem;
}
.prio-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  display: inline-block;
  text-align: center;
  min-width: 70px;
}

.status-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
}

.status-overlay-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; 
  cursor: pointer;
  z-index: 10;
  border: none;
  background: transparent;
}

.status-wrapper:has(select):hover {
  filter: brightness(0.9);
}

.high { background: #fee2e2; color: #dc2626; }
.medium { background: #fef3c7; color: #d97706; }
.low { background: #dcfce7; color: #16a34a; }
</style>