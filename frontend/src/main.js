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
// // deconectare fortata si curatare date
// signOut(auth).then(() => {
//   authStore.clearSession(); // ACUM folosim store-ul ,in loc de localStorage direct
//   console.log("App started: Session cleared via Pinia Store");
// });

app.mount('#app')
