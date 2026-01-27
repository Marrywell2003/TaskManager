<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>TaskMaster</h2>
      <p class="subtitle">Please sign in to manage your tasks</p>
      
      <form @submit.prevent="handleLogin">
        <AppInput 
         v-model="email" 
         label="Email Address" 
         type="email" 
          placeholder="e.g. manager@company.com" 
          required 
          />

         <AppInput 
          v-model="password" 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          required 
          />
        
        <AppButton 
             type="submit" 
             :loading="loading" 
>
                Sign In
        </AppButton>
      </form>
      
      <p class="footer-text">
        Don't have an account? 
        <router-link to="/register" class="link">Create one now</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import apiService from '@/services/apiService';
import AppButton from '@/components/AppButton.vue';
import AppInput from '@/components/AppInput.vue';
import { useAuthStore } from '@/stores/authStore';

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();
const isSubmitting = ref(false);
const authStore = useAuthStore();

const handleLogin = async () => {
  isSubmitting.value = true;
  loading.value = true;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    const response = await apiService.getUserProfile(user.uid);
    const userData = response.data;

    authStore.saveUserSession({
      uid: user.uid,
      role: userData.role,
      fullName: userData.fullName
    });
    router.push({ name: 'home' });
  } catch(error){
    console.error("Authentication error:", error);
    let errorMessage = "An unexpected error occurred";

    if (error.response) {
      errorMessage = error.response.data.message || "Could not verify user role";
    } 
    else if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No user found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password. Please try again";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid";
          break;
        default:
          errorMessage = error.message;
      }
    }
    
    alert(errorMessage);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f4f7f6 0%, #e1e8e7 100%);
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
}

h2 { color: #2c3e50; margin-bottom: 8px; font-size: 2rem; }
h2 span { color: #3498db; }

.subtitle { color: #7f8c8d; margin-bottom: 30px; font-size: 0.95rem; }




/* .forgot-password {
  text-align: right;
  margin-bottom: 20px;
  margin-top: -10px;
}

.forgot-password a {
  font-size: 0.8rem;
  color: #3498db;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
} */

.link {
  color: #3498db;
  font-weight: bold;
  text-decoration: none;
}

.footer-text { margin-top: 25px; font-size: 0.9rem; color: #7f8c8d; }
.link { color: #3498db; text-decoration: none; font-weight: bold; }
.link:hover { text-decoration: underline; }
</style>