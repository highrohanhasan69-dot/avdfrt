<template>
  <footer class="footer">
    <div class="footer-top">
      <!-- Support Column -->
      <div class="footer-column">
        <h4>SUPPORT</h4>
        <ul>
          <li v-for="item in supportItems" :key="item.id">
            <div class="contact-info">
              <i class="phone-icon">📞</i>
              <div class="info-details">
                <span class="hours">{{ item.label }}</span>
                <span class="number">{{ item.value }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- About Us Column (3 Sub-columns) -->
      <div class="footer-column">
        <h4>ABOUT US</h4>
        <div class="about-us-row">
          <ul v-for="(column, index) in aboutColumns" :key="index" class="sub-column">
            <li v-for="item in column" :key="item.id">
              <a :href="item.link" target="_blank">{{ item.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Stay Connected Column -->
      <div class="footer-column">
        <h4>STAY CONNECTED</h4>
        <div class="address-box" v-if="stayConnected">
          <h5>{{ stayConnected.name }}</h5>
          <p>{{ stayConnected.address }}</p>
          <p>Email: <a :href="`mailto:${stayConnected.email}`">{{ stayConnected.email }}</a></p>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- App & Social Links -->
    <div class="footer-middle">
      <div class="footer-middle-left">
        <p>{{ appText }}</p>
      </div>

      <div class="footer-middle-center">
        <div class="app-links">
          <a v-for="app in appLinks" :key="app.id" :href="app.link" target="_blank">
            <img :src="app.icon" alt="App Link" />
          </a>
        </div>
      </div>

      <div class="footer-middle-right">
        <div class="social-links">
          <a v-for="social in socialLinks" :key="social.id" :href="social.link" target="_blank">
            <img :src="social.icon" alt="Social Link" />
          </a>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-bottom">
      <p>{{ copyright }}</p>
      <p>Powered By: {{ poweredBy }}</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Backend Base URL detect automatically (Render or Localhost)
const backendURL =
  window.location.hostname.includes("localhost")
    ? "http://localhost:5000"
    : "https://your-render-backend.onrender.com"; // 🔹 তোমার Render API লিংক বসাও

// Footer state variables
const supportItems = ref([]);
const aboutColumns = ref([[], [], []]);
const stayConnected = ref(null);
const appLinks = ref([]);
const socialLinks = ref([]);
const appText = ref("");
const copyright = ref("");
const poweredBy = ref("");

// ✅ Fetch Footer Data from Node.js Backend
const fetchFooterData = async () => {
  try {
    const [support, about, stay, app, social, text] = await Promise.all([
      axios.get(`${backendURL}/api/footer/support`),
      axios.get(`${backendURL}/api/footer/about`),
      axios.get(`${backendURL}/api/footer/stay-connected`),
      axios.get(`${backendURL}/api/footer/app-links`),
      axios.get(`${backendURL}/api/footer/social-links`),
      axios.get(`${backendURL}/api/footer/texts`),
    ]);

    supportItems.value = support.data || [];
    appLinks.value = app.data || [];
    socialLinks.value = social.data || [];
    stayConnected.value = stay.data || null;

    // about data কে তিন কলামে ভাগ করা
    aboutColumns.value = [[], [], []];
    (about.data || []).forEach((item) => {
      aboutColumns.value[item.column_order - 1].push(item);
    });

    if (text.data) {
      appText.value = text.data.app_text;
      copyright.value = text.data.copyright;
      poweredBy.value = text.data.powered_by;
    }
  } catch (err) {
    console.error("❌ Footer load error:", err);
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
