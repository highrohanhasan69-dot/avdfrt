<template>
  <footer class="footer">
    <div class="footer-section">
      <div class="footer-col">
        <h3>Support</h3>
        <ul>
          <li v-for="link in supportLinks" :key="link.id">
            <a :href="link.link" target="_blank">{{ link.text }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>About</h3>
        <ul>
          <li v-for="link in aboutLinks" :key="link.id">
            <a :href="link.link" target="_blank">{{ link.text }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Stay Connected</h3>
        <ul>
          <li v-for="link in stayConnected" :key="link.id">
            <a :href="link.link" target="_blank">{{ link.text }}</a>
          </li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a v-for="social in socialLinks" :key="social.id" :href="social.link" target="_blank">
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>{{ footerText }}</p>
      <div class="app-links">
        <a v-for="app in appLinks" :key="app.id" :href="app.link" target="_blank">
          <i :class="app.icon"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// 🔗 Auto-detect local or production API base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

// Reactive data
const supportLinks = ref([]);
const aboutLinks = ref([]);
const stayConnected = ref([]);
const appLinks = ref([]);
const socialLinks = ref([]);
const footerText = ref("");

// 🔹 Fetch footer data from backend
const fetchFooterData = async () => {
  try {
    const [support, about, stay, app, social, text] = await Promise.all([
      axios.get(`${API_BASE}/footer/support`),
      axios.get(`${API_BASE}/footer/about`),
      axios.get(`${API_BASE}/footer/stay-connected`),
      axios.get(`${API_BASE}/footer/app-links`),
      axios.get(`${API_BASE}/footer/social-links`),
      axios.get(`${API_BASE}/footer/texts`),
    ]);

    supportLinks.value = support.data;
    aboutLinks.value = about.data;
    stayConnected.value = stay.data;
    appLinks.value = app.data;
    socialLinks.value = social.data;
    footerText.value = text.data?.[0]?.text || "";
  } catch (err) {
    console.error("❌ Footer fetch error:", err);
  }
};

onMounted(fetchFooterData);
</script>

<style scoped>
.footer {
  background: #111;
  color: #eee;
  padding: 40px 20px;
  font-family: "Alice", serif;
}

.footer-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-col h3 {
  color: #fff;
  margin-bottom: 15px;
  font-weight: bold;
}

.footer-col ul {
  list-style: none;
  padding: 0;
}

.footer-col ul li {
  margin: 8px 0;
}

.footer-col a {
  color: #bbb;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-col a:hover {
  color: #8e2de2;
}

.social-icons a {
  margin-right: 10px;
  color: #ccc;
  font-size: 20px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #8e2de2;
}

.footer-bottom {
  border-top: 1px solid #333;
  padding-top: 20px;
  text-align: center;
  font-size: 14px;
}

.app-links a {
  margin: 0 8px;
  color: #bbb;
  font-size: 20px;
}

.app-links a:hover {
  color: #8e2de2;
}
</style>
