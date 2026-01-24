<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Create <span>Account</span></h2>
      <p class="subtitle">Join TaskMaster to manage your team</p>
      
      <form @submit.prevent="handleRegister">
        <div class="name-row">
          <div class="input-group">
            <label>First Name</label>
            <input v-model="firstName" type="text" placeholder="e.g. Maria" required />
          </div>
          <div class="input-group">
            <label>Last Name</label>
            <input v-model="lastName" type="text" placeholder="e.g. Popescu" required />
          </div>
        </div>

        <div class="input-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="maria@example.com" required />
        </div>
        
        <div class="input-group">
          <label>Select Role</label>
          <select v-model="role" required class="role-select">
            <option value="" disabled selected>Who are you?</option>
            <option value="Manager">Manager (Team leader)</option>
            <option value="Employee">Employee (Team member)</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Min. 6 characters" required />
        </div>

        <div class="input-group">
          <label>Confirm password</label>
          <input v-model="confirmPassword" type="password" placeholder="Repeat password" required />
        </div>
        
        <button type="submit" :disabled="loading" class="btn-register">
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>
      
      <p class="footer-text">
        Already have an account? 
        <router-link to="/login" class="link">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const role = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!");
    return;
  }

  loading.value = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid, 
      firstName: firstName.value,
      lastName: lastName.value,
      fullName: `${firstName.value} ${lastName.value}`,
      email: email.value,
      role: role.value,
      createdAt: new Date().toISOString()
    });

    alert("Account created! Please log in with your credentials.");
    
    await signOut(auth);
    router.push('/login');

  } catch (error) {
    console.error("Error during registration:", error);
    let msg = "Error: " + error.message;
    if (error.code === 'auth/email-already-in-use') msg = "This email is already registered.";
    alert(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 500px;
}

h2 { margin-bottom: 10px; color: #2d3436; }
h2 span { color: #3498db; }
.subtitle { color: #636e72; margin-bottom: 30px; font-size: 0.9rem; }

.name-row {
  display: flex;
  gap: 15px;
}

.input-group {
  text-align: left;
  margin-bottom: 18px;
  flex: 1;
}

label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 6px;
  color: #2d3436;
  text-transform: uppercase;
}

input, .role-select {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #dfe6e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus, .role-select:focus {
  border-color: #3498db;
  outline: none;
}

.btn-register {
  width: 100%;
  padding: 14px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
}

.btn-register:hover { background-color: #2980b9; }
.btn-register:disabled { background-color: #b2bec3; cursor: not-allowed; }

.footer-text { margin-top: 25px; font-size: 0.9rem; color: #636e72; }
.link { color: #3498db; text-decoration: none; font-weight: 700; }
</style>