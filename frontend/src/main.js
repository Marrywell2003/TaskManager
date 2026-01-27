import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { auth } from '@/firebaseConfig'
import { signOut } from 'firebase/auth'
import { useAuthStore } from '@/stores/authStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
const authStore = useAuthStore(pinia);

app.mount('#app')
