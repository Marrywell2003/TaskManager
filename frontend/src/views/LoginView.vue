<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Autentificare</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Parolă" required />
        <button type="submit">Intră în cont</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const router = useRouter();

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); 
  } catch (error) {
    alert("Eroare: " + error.message);
  }
};
</script>

<style scoped>
.auth-wrapper { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
.auth-card { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); width: 350px; }
input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; }
button { width: 100%; padding: 12px; background: #2c3e50; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
</style>