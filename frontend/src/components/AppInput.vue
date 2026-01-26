<template>
  <div class="app-input-group">
    <label v-if="label">{{ label }}</label>
    <input
      v-bind="$attrs" 
      :type="type" 
      :placeholder="placeholder" 
      :value="modelValue"
      :required="required"
      @input="$emit('update:modelValue', $event.target.value)"
      class="custom-input"
    />
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  modelValue: [String, Number],
  required: { type: Boolean, default: false }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.app-input-group {
  text-align: left;
  margin-bottom: 22px;
}

label { 
  display: block; 
  font-size: 0.85rem; 
  margin-bottom: 8px; 
  color: #2c3e50; 
  font-weight: 600; 
}

.custom-input {
  width: 100%;
  padding: 14px;
  border: 1px solid #dfe6e9;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-input:focus { 
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
</style>