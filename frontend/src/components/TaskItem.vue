<template>
  <div class="task-row">
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
      <StatusBadge :status="task.status || 'todo'" />
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  task: {
    type: Object,
    required: true
  }
});

const formatDate = (ts) => {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return 'Data invalidă';
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

.high { background: #fee2e2; color: #dc2626; }
.medium { background: #fef3c7; color: #d97706; }
.low { background: #dcfce7; color: #16a34a; }
</style>