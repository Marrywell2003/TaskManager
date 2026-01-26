<template>
  <span :class="['status-badge', status]">
    {{ statusLabel }}
  </span>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps(['status']);
const statusLabel = computed(() => {
  const labels = { 'todo': 'To do', 'in-progress': 'In progress', 'done': 'Done' };
  return labels[props.status] || props.status;
});
</script>

<style scoped>
.status-badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; }
.todo { background: #cbd5e1; color: #475569; }
.in-progress { background: #bfdbfe; color: #1e40af; }
.done { background: #bbf7d0; color: #166534; }
</style>