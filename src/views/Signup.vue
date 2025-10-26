<template>
  <div>
    <Navbar />
    <div class="signup-container">
      <h2 class="signup-title">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="signup-form">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="phone" type="text" placeholder="Phone (optional)" />
        <button type="submit">Sign Up</button>
      </form>
      <p class="login-text">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Navbar from "@/components/NavBar.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const phone = ref("");

const handleSignup = async () => {
  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup", {
      email: email.value,
      password: password.value,
      phone: phone.value
    }, { withCredentials: true });
    alert(res.data.message);
    router.push("/login");
  } catch (err) {
    alert(err.response?.data?.message || "Signup failed");
  }
};
</script>
