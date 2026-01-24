import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const categories = ref(['General', 'Personal', 'Work'])
  const loading = ref(false)

  function addTask(task) {
    tasks.value.push(task)
  }

  function deleteTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  return { tasks, categories, loading, addTask, deleteTask }
})
