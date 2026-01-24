<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>TaskMaster</h2>
      <p class="subtitle">Please sign in to manage your tasks</p>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email Address</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="e.g. manager@company.com" 
            required 
          />
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input 
            v-model="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div class="forgot-password">
          <a @click.prevent="handleForgotPassword" href="#">Forgot password?</a>
        </div>
        
        <button type="submit" :disabled="loading" class="btn-login">
          <span v-if="!loading">Sign In</span>
          <span v-else>Authenticating...</span>
        </button>
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

const email = ref('');
const password = ref('');
const loading = ref(false);
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/'); 
  } catch (error) {
    let errorMessage = "Invalid email or password.";
    if (error.code === 'auth/user-not-found') errorMessage = "User not found.";
    if (error.code === 'auth/wrong-password') errorMessage = "Incorrect password.";
    
    alert(errorMessage);
  } finally {
    loading.value = false;
  }
};

const handleForgotPassword = async () => {
  if (!email.value) {
    alert("Please enter your email address first to reset your password.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email.value);
    alert("Password reset email sent! Check your inbox.");
  } catch (error) {
    alert("Error: " + error.message);
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

.input-group { text-align: left; margin-bottom: 22px; }

label { 
  display: block; 
  font-size: 0.85rem; 
  margin-bottom: 8px; 
  color: #2c3e50; 
  font-weight: 600; 
}

input {
  width: 100%;
  padding: 14px;
  border: 1px solid #dfe6e9;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus { border-color: #3498db; }

.btn-login {
  width: 100%;
  padding: 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: transform 0.2s, background 0.3s;
}

.forgot-password {
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
}

.link {
  color: #3498db;
  font-weight: bold;
  text-decoration: none;
}

.btn-login:hover { background: #2980b9; transform: translateY(-1px); }
.btn-login:active { transform: translateY(0); }
.btn-login:disabled { background: #bdc3c7; cursor: not-allowed; }

.footer-text { margin-top: 25px; font-size: 0.9rem; color: #7f8c8d; }
.link { color: #3498db; text-decoration: none; font-weight: bold; }
.link:hover { text-decoration: underline; }
</style>