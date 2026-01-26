<template>
  <button
    v-bind="$attrs"
    :class="['custom-button', variant]"
    :disabled="loading || disabled"
    @click="emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else></slot>
  </button>
</template>

<script setup>
const emit = defineEmits(['click'])

defineProps({
  variant: {
    type: String,
    default: 'primary' 
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const onClick = (e) => {
  emit('click', e)
}
</script>

<style scoped>
.custom-button {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;        
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: auto;
}

.primary { background-color: #3498db; color: white; }
.primary:hover { background-color: #2980b9; }

.danger { background-color: #e74c3c; color: white; }
.danger:hover { background-color: #c0392b; }

.custom-button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
