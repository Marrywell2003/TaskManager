<template>
  <span :class="['badge', type]">
    <slot></slot> </span>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'pending' // pending, urgent, done
  }
})
</script>

<style scoped>
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: inline-block;
}

.urgent { background-color: #fee2e2; color: #dc2626; }
.pending { background-color: #fef3c7; color: #d97706; }
.done { background-color: #dcfce7; color: #16a34a; }
</style>