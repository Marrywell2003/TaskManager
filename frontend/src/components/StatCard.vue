<template>
  <div class="stat-card">
    <div class="stat-label">{{ label }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number]
})
</script>

<style scoped>
.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  text-align: center;
}
.stat-label { color: #6b7280; font-size: 0.875rem; font-weight: 500; }
.stat-value { color: #1f2937; font-size: 1.5rem; font-weight: 700; margin-top: 0.5rem; }
</style>