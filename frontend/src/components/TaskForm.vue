<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <h3>Create new task</h3>
    
    <AppInput 
      v-model="form.title" 
      label="Task title" 
      placeholder="Ex: Weekly raport" 
      required 
    />

    <div class="form-group">
      <label>Descriere</label>
      <textarea v-model="form.description" class="custom-textarea" rows="3"></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Direct to</label>
        <select v-model="form.assignedTo" @change="updateEmployeeName" required>
          <option value="">Select an employee</option>
          <option v-for="emp in employees" :key="emp.uid" :value="emp.uid">
            {{ emp.fullName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Priority</label>
        <select v-model="form.priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>

    <AppInput 
      v-model="form.dueDate" 
      type="date" 
      label="Deadline"
      :min="today"
      required
    />
    <p v-if="errors.dueDate" class="error-text">{{ errors.dueDate }}</p>

    <AppButton type="submit" :disabled="loading">
      {{ loading ? 'Saving...' : 'Create task' }}
    </AppButton>
  </form>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import apiService from '@/services/apiService';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import { useAuthStore } from '@/stores/authStore';


const emit = defineEmits(['task-created']);
const authStore=useAuthStore();
const taskStore = useTaskStore();
const employees = ref([]);
const loading = ref(false);

const errors = ref({
  dueDate: ''
});

const form = ref({
  title: '',
  description: '',
  assignedTo: '',
  assignedToName: '',
  priority: 'medium',
  dueDate: ''
});

const today = computed(() => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`; 
});

onMounted(async () => {
  try {
    const res = await apiService.getEmployees();
    employees.value = res.data;
  } catch (err) {
    console.error("There s a problem in loading the employees", err);
  }
});

const updateEmployeeName = () => {
  if (!employees.value.length) return;
  const selected = employees.value.find(e => e.uid === form.value.assignedTo);
  form.value.assignedToName = selected ? selected.fullName : '';
  console.log("Selected employee :", form.value.assignedToName);
};

const isPastDate = (yyyy_mm_dd) => {
  if (!yyyy_mm_dd) return false;
  const selected = new Date(yyyy_mm_dd + 'T00:00:00');
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return selected < todayStart;
};

const validate = () => {
  errors.value.dueDate = '';

  if (!form.value.dueDate) {
    errors.value.dueDate = 'Please choose another deadline';
    return false;
  }

  if (isPastDate(form.value.dueDate)) {
    errors.value.dueDate = 'The deadline can not be in the past!';
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validate()) return;

  loading.value = true;
  try {
    const finalTaskData = {
      ...form.value,
      createdBy: authStore.uid, 
      status: 'todo',           
      createdAt: new Date().toISOString()
    };

    //await taskStore.addTask({ ...form.value });
    await taskStore.addTask(finalTaskData);

    form.value = {
      title: '',
      description: '',
      assignedTo: '',
      assignedToName: '',
      priority: 'medium',
      dueDate: ''
    };

    emit('task-created'); 
    alert("Task created successfully");
  } catch (err) {
    console.error(err);
    alert("Error - create task");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.task-form { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.custom-textarea { border: 1px solid #ddd; border-radius: 8px; padding: 10px; font-family: inherit; }
select { padding: 10px; border-radius: 8px; border: 1px solid #ddd; background: white; }

.error-text {
  margin: -8px 0 12px;
  font-size: 0.9rem;
  color: #e74c3c;
}
</style>
