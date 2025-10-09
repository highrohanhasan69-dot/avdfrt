<template>
  <div>
    <!-- 🟣 Navbar Component -->
     <div class="navbar">
    <Navbar />
</div>
    <!-- 🟣 Login Page -->
    <div class="login-container">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <input v-model="loginInput" placeholder="Email or Phone" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <p class="signup-text">
        Don’t have an account?
        <router-link to="/signup">Signup</router-link>
      </p>
    </div>

    <!-- 🟣 Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { useRouter } from "vue-router";

// Navbar + Footer import
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

const router = useRouter();
const loginInput = ref(""); // email or phone
const password = ref("");

// নতুন function: phone number দিয়ে login
async function loginWithPhone(phoneNumber, passwordToUse) {
  const email = `${phoneNumber}@avado.com`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: passwordToUse,
  });

  if (error) {
    console.error("Login failed:", error.message);
    alert("Login failed. Try again.");
    return null;
  }

  alert("Login successful!");
  return data.user;
}

// handleLogin function
const handleLogin = async () => {
  // যদি input phone number হয়
  if (/^\d{10,15}$/.test(loginInput.value)) {
    const user = await loginWithPhone(loginInput.value, password.value);
    if (user) {
      router.push("/"); // ✅ Home page redirect
    }
  } else {
    // Normal email login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginInput.value,
      password: password.value,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      router.push("/"); // ✅ Home page redirect
    }
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


  .navbar{
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
