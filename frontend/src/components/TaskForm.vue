<template>
  <form @submit.prevent="handleSubmit" class="task-form">
    <h3>Creare Task Nou</h3>
    
    <AppInput 
      v-model="form.title" 
      label="Titlu Task" 
      placeholder="Ex: Raport lunar" 
      required 
    />

    <div class="form-group">
      <label>Descriere</label>
      <textarea v-model="form.description" class="custom-textarea" rows="3"></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>Asignează către</label>
        <select v-model="form.assignedTo" @change="updateEmployeeName" required>
          <option value="">Selectează un angajat</option>
          <option v-for="emp in employees" :key="emp.uid" :value="emp.uid">
            {{ emp.fullName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Prioritate</label>
        <select v-model="form.priority">
          <option value="low">Scăzută</option>
          <option value="medium">Medie</option>
          <option value="high">Ridicată</option>
        </select>
      </div>
    </div>

    <AppInput 
      v-model="form.dueDate" 
      type="date" 
      label="Data Limită" 
    />

    <AppButton type="submit" :disabled="loading">
      {{ loading ? 'Se salvează...' : 'Creează Task' }}
    </AppButton>
  </form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import apiService from '@/services/apiService';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';

const taskStore = useTaskStore();
const employees = ref([]);
const loading = ref(false);

const form = ref({
  title: '',
  description: '',
  assignedTo: '',
  assignedToName: '',
  priority: 'medium',
  dueDate: ''
});

onMounted(async () => {
  try {
    const res = await apiService.getEmployees();
    employees.value = res.data;
  } catch (err) {
    console.error("Nu am putut încărca angajații", err);
  }
});

const updateEmployeeName = () => {
  if (!employees.value.length) return;
  const selected = employees.value.find(e => e.uid === form.value.assignedTo);
  form.value.assignedToName = selected ? selected.fullName : '';
  console.log("Angajat selectat:", form.value.assignedToName);
}
const handleSubmit = async () => {
  loading.value = true;
  try {
    await taskStore.addTask({ ...form.value });
    form.value = { title: '', description: '', assignedTo: '', assignedToName: '', priority: 'medium', dueDate: '' };
    alert("Task creat cu succes!");
  } catch (err) {
    alert("Eroare la crearea task-ului.");
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
</style>