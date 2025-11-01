<template>
  <div class="footer-manager">
    <h2>Footer Manager</h2>

    <!-- SUPPORT SECTION -->
    <section>
      <h3>Support Section</h3>
      <div class="add-item">
        <input v-model="newSupport.label" placeholder="Label" />
        <input v-model="newSupport.value" placeholder="Value" />
        <button @click="addSupport">Add</button>
      </div>
      <table>
        <tr v-for="item in supportItems" :key="item.id">
          <td><input v-model="item.label" /></td>
          <td><input v-model="item.value" /></td>
          <td>
            <button @click="updateSupport(item)">Update</button>
            <button @click="deleteSupport(item.id)">Delete</button>
          </td>
        </tr>
      </table>
    </section>

    <!-- ABOUT US -->
    <section>
      <h3>About Us (3 Columns)</h3>
      <div class="columns">
        <div v-for="(column, index) in aboutColumns" :key="index" class="about-column">
          <h4>Column {{ index + 1 }}</h4>
          <div class="add-item">
            <input v-model="newAbout.label" placeholder="Label" />
            <input v-model="newAbout.link" placeholder="Link" />
            <button @click="addAbout(index)">Add</button>
          </div>
          <table>
            <tr v-for="item in column" :key="item.id">
              <td><input v-model="item.label" /></td>
              <td><input v-model="item.link" /></td>
              <td>
                <button @click="updateAbout(item)">Update</button>
                <button @click="deleteAbout(item.id, index)">Delete</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </section>

    <!-- STAY CONNECTED -->
    <section>
      <h3>Stay Connected</h3>
      <input v-model="stayConnected.name" placeholder="Name" />
      <input v-model="stayConnected.address" placeholder="Address" />
      <input v-model="stayConnected.email" placeholder="Email" />
      <button @click="updateStayConnected">Update</button>
    </section>

    <!-- APP LINKS -->
    <section>
      <h3>App Links</h3>
      <div class="add-item">
        <input v-model="newApp.link" placeholder="App Link" />
        <input type="file" @change="handleAppIcon" />
        <button @click="addAppLink">Add</button>
      </div>
      <table>
        <tr v-for="item in appLinks" :key="item.id">
          <td><input v-model="item.link" /></td>
          <td><img :src="item.icon" height="40" /></td>
          <td><input type="file" @change="e => handleUpdateAppIcon(e, item)" /></td>
          <td>
            <button @click="updateAppLink(item)">Update</button>
            <button @click="deleteAppLink(item.id)">Delete</button>
          </td>
        </tr>
      </table>
    </section>

    <!-- SOCIAL LINKS -->
    <section>
      <h3>Social Links</h3>
      <div class="add-item">
        <input v-model="newSocial.link" placeholder="Social Link" />
        <input type="file" @change="handleSocialIcon" />
        <button @click="addSocialLink">Add</button>
      </div>
      <table>
        <tr v-for="item in socialLinks" :key="item.id">
          <td><input v-model="item.link" /></td>
          <td><img :src="item.icon" height="40" /></td>
          <td><input type="file" @change="e => handleUpdateSocialIcon(e, item)" /></td>
          <td>
            <button @click="updateSocialLink(item)">Update</button>
            <button @click="deleteSocialLink(item.id)">Delete</button>
          </td>
        </tr>
      </table>
    </section>

    <!-- FOOTER TEXT -->
    <section>
      <h3>Footer Texts</h3>
      <input v-model="appText" placeholder="App Text" />
      <input v-model="copyright" placeholder="Copyright" />
      <input v-model="poweredBy" placeholder="Powered By" />
      <button @click="updateFooterTexts">Update</button>
    </section>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

// ✅ Backend baseURL auto-detect (localhost vs render)
const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api/footer"
  : "https://avado-backend.onrender.com/api/footer"; // 🔹 তোমার Render backend URL বসাও

// ========== STATES ==========
const supportItems = ref([]);
const aboutColumns = ref([[], [], []]);
const stayConnected = ref({ name: "", address: "", email: "" });
const appLinks = ref([]);
const socialLinks = ref([]);
const appText = ref("");
const copyright = ref("");
const poweredBy = ref("");

const newSupport = ref({ label: "", value: "" });
const newAbout = ref({ label: "", link: "" });
const newApp = ref({ link: "", icon: "" });
const newSocial = ref({ link: "", icon: "" });

// ========== FETCH ALL ==========
const fetchAll = async () => {
  try {
    const [support, about, stay, app, social, texts] = await Promise.all([
      axios.get(`${BASE_URL}/support`),
      axios.get(`${BASE_URL}/about`),
      axios.get(`${BASE_URL}/stay-connected`),
      axios.get(`${BASE_URL}/app-links`),
      axios.get(`${BASE_URL}/social-links`),
      axios.get(`${BASE_URL}/texts`),
    ]);

    supportItems.value = support.data || [];
    aboutColumns.value = [[], [], []];
    (about.data || []).forEach((item) =>
      aboutColumns.value[item.column_order - 1].push(item)
    );
    stayConnected.value = stay.data || {};
    appLinks.value = app.data || [];
    socialLinks.value = social.data || [];
    if (texts.data) {
      appText.value = texts.data.app_text;
      copyright.value = texts.data.copyright;
      poweredBy.value = texts.data.powered_by;
    }
  } catch (err) {
    console.error("❌ Footer fetch failed:", err);
  }
};

onMounted(fetchAll);

// ========== SUPPORT ==========
const addSupport = async () => {
  if (!newSupport.value.label || !newSupport.value.value)
    return alert("Fill all fields");
  const res = await axios.post(`${BASE_URL}/support`, newSupport.value);
  supportItems.value.push(res.data);
  newSupport.value = { label: "", value: "" };
};
const updateSupport = async (item) => {
  await axios.put(`${BASE_URL}/support/${item.id}`, item);
};
const deleteSupport = async (id) => {
  await axios.delete(`${BASE_URL}/support/${id}`);
  supportItems.value = supportItems.value.filter((i) => i.id !== id);
};

// ========== ABOUT ==========
const addAbout = async (colIndex) => {
  const item = { ...newAbout.value, column_order: colIndex + 1 };
  const res = await axios.post(`${BASE_URL}/about`, item);
  aboutColumns.value[colIndex].push(res.data);
  newAbout.value = { label: "", link: "" };
};
const updateAbout = async (item) => {
  await axios.put(`${BASE_URL}/about/${item.id}`, item);
};
const deleteAbout = async (id, colIndex) => {
  await axios.delete(`${BASE_URL}/about/${id}`);
  aboutColumns.value[colIndex] = aboutColumns.value[colIndex].filter(
    (i) => i.id !== id
  );
};

// ========== STAY CONNECTED ==========
const updateStayConnected = async () => {
  if (!stayConnected.value.id) {
    await axios.post(`${BASE_URL}/stay-connected`, stayConnected.value);
  } else {
    await axios.put(
      `${BASE_URL}/stay-connected/${stayConnected.value.id}`,
      stayConnected.value
    );
  }
};

// ========== APP LINKS ==========
const handleAppIcon = (e) => (newApp.value.iconFile = e.target.files[0]);
const handleUpdateAppIcon = (e, item) => (item.iconFile = e.target.files[0]);

const addAppLink = async () => {
  const form = new FormData();
  form.append("link", newApp.value.link);
  if (newApp.value.iconFile) form.append("icon", newApp.value.iconFile);
  const res = await axios.post(`${BASE_URL}/app-links`, form);
  appLinks.value.push(res.data);
  newApp.value = { link: "" };
};
const updateAppLink = async (item) => {
  const form = new FormData();
  form.append("link", item.link);
  if (item.iconFile) form.append("icon", item.iconFile);
  await axios.put(`${BASE_URL}/app-links/${item.id}`, form);
};
const deleteAppLink = async (id) => {
  await axios.delete(`${BASE_URL}/app-links/${id}`);
  appLinks.value = appLinks.value.filter((i) => i.id !== id);
};

// ========== SOCIAL ==========
const handleSocialIcon = (e) => (newSocial.value.iconFile = e.target.files[0]);
const handleUpdateSocialIcon = (e, item) =>
  (item.iconFile = e.target.files[0]);

const addSocialLink = async () => {
  const form = new FormData();
  form.append("link", newSocial.value.link);
  if (newSocial.value.iconFile) form.append("icon", newSocial.value.iconFile);
  const res = await axios.post(`${BASE_URL}/social-links`, form);
  socialLinks.value.push(res.data);
  newSocial.value = { link: "" };
};
const updateSocialLink = async (item) => {
  const form = new FormData();
  form.append("link", item.link);
  if (item.iconFile) form.append("icon", item.iconFile);
  await axios.put(`${BASE_URL}/social-links/${item.id}`, form);
};
const deleteSocialLink = async (id) => {
  await axios.delete(`${BASE_URL}/social-links/${id}`);
  socialLinks.value = socialLinks.value.filter((i) => i.id !== id);
};

// ========== TEXTS ==========
const updateFooterTexts = async () => {
  await axios.put(`${BASE_URL}/texts`, {
    app_text: appText.value,
    copyright: copyright.value,
    powered_by: poweredBy.value,
  });
};
</script>

<style scoped>
.footer-manager {
  padding: 20px;
}
section {
  margin-bottom: 40px;
}
.add-item input {
  margin-right: 5px;
}
.add-item button {
  margin-left: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
table th, table td {
  border: 1px solid #ccc;
  padding: 5px;
}
img {
  max-height: 40px;
}
</style>
