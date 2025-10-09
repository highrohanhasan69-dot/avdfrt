<template>
  <div>
    <div class="navbar">
    <!-- 🟣 Navbar Component -->
    <Navbar />
</div>
    <!-- 🟣 Signup Page -->
    <div class="signup-container">
      <h2 class="signup-title">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="signup-form">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit">Sign Up</button>
      </form>
      <p class="login-text">
        Already have an account?
        <router-link to="/login">Login</router-link>
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
const email = ref("");
const password = ref("");

const handleSignup = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) {
    alert(error.message);
  } else {
    alert("Signup successful! Please check your email.");
    router.push("/"); // signup এর পর home এ পাঠাবে
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 80px auto 40px;
  padding: 30px 25px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 20px rgba(74, 0, 224, 0.15);
  font-family: "Zalando Sans";
  text-align: center;
  box-sizing: border-box; /* ✅ Add this */
}

.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center; /* ✅ Ensure inputs stay centered */
  gap: 15px;
  width: 100%; /* ✅ Take full container width */
}

.signup-form input,
.signup-form button {
  box-sizing: border-box; /* ✅ Prevent overflowing */
  width: 100%; /* ✅ Ensure full width */
}

.signup-title {
  font-size: 28px;
  font-weight: 700;
  color: #4A00E0;
  margin-bottom: 25px;
}

.signup-form input {
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  font-size: 14px;
  transition: all 0.25s ease;
}

.signup-form input:focus {
  border-color: #8E2DE2;
  box-shadow: 0 0 6px rgba(142, 45, 226, 0.2);
}

.signup-form button {
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

.signup-form button:hover {
  background: linear-gradient(135deg, #5f18e2, #9b3ce6);
  box-shadow: 0 6px 14px rgba(142, 45, 226, 0.35);
}

.login-text {
  margin-top: 18px;
  font-size: 14px;
  color: #555;
}

.login-text a {
  color: #8E2DE2;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.login-text a:hover {
  color: #4A00E0;
}
@media (max-width: 768px) {


  .navbar{
    margin-bottom: 110px;
  }
}
/* 🟣 Responsive */
@media (max-width: 500px) {
  .signup-container {
    margin: 50px 20px;
    padding: 25px 20px;
  }
}

</style>
