<template>
  <div>
    <Navbar />
    <div class="login-container">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input v-model="loginInput" placeholder="Email or Phone" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p class="signup-text">
        Don’t have an account? <router-link to="/signup">Signup</router-link>
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
const loginInput = ref("");
const password = ref("");

// ✅ Auto-detect local or Cloudflare API base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

console.log("🔗 Using API base URL:", API_BASE);

// ✅ Handle Login
const handleLogin = async () => {
  try {
    const res = await axios.post(`${API_BASE}/auth/login`, {
      loginInput: loginInput.value,
      password: password.value,
    });
    alert(res.data.message || "Login successful!");
    router.push("/");
  } catch (err) {
    console.error("❌ Login error:", err);
    alert(err.response?.data?.message || "Login failed");
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  width: 90%;
  margin-right: 5%;
  margin-left: 5%;
  margin-top: 80px;
  padding: 30px 25px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(74, 0, 224, 0.15);
  font-family: "Zalando Sans", sans-serif;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #4A00E0;
  margin-bottom: 25px;
}

.login-form input {
  display: block;
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.login-form input:focus {
  border-color: #8E2DE2;
  box-shadow: 0 0 6px rgba(142, 45, 226, 0.2);
}

.login-form button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.25);
}

.login-form button:hover {
  background: linear-gradient(135deg, #5f18e2, #9b3ce6);
  box-shadow: 0 6px 14px rgba(142, 45, 226, 0.35);
}

.signup-text {
  margin-top: 18px;
  font-size: 14px;
  color: #555;
}

.signup-text a {
  color: #8E2DE2;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.signup-text a:hover {
  color: #4A00E0;
}

@media (max-width: 768px) {
  .navbar {
    margin-bottom: 110px;
  }
}

/* 🟣 Responsive */
@media (max-width: 500px) {
  .login-container {
    margin: 50px 20px;
    padding: 25px 20px;
  }
}
</style>
