<template>
  <div class="category-manager max-w-6xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-900">Manage Categories</h2>

    <!-- Add Category Form -->
    <form
      @submit.prevent="addCategory"
      class="flex flex-col md:flex-row items-start gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg"
    >
      <!-- File Input -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-700 mb-2 font-medium">Select Category Image</label>
        <input
          type="file"
          @change="onCategoryFileChange"
          accept="image/*"
          required
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <div
          v-if="newCategoryFilePreview"
          class="mt-3 w-full h-36 rounded-md overflow-hidden border border-gray-200 shadow-inner"
        >
          <img :src="newCategoryFilePreview" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Slug Input -->
      <div class="flex flex-col w-full md:w-1/2">
        <label class="text-gray-700 mb-2 font-medium">Category Slug</label>
        <input
          v-model="newCategorySlug"
          placeholder="Slug (e.g. electronics)"
          required
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      <!-- Add Button -->
      <div class="flex items-end">
        <button
          type="submit"
          class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition shadow-md hover:shadow-lg"
        >
          Add Category
        </button>
      </div>
    </form>

    <!-- Category List -->
    <div
      v-if="categories.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="c in categories"
        :key="c.id"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
      >
        <div class="overflow-hidden h-40 w-full">
          <img
            :src="c.image_url"
            alt="Category"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div class="p-4 flex flex-col gap-2">
          <p class="text-lg font-semibold text-gray-800">{{ c.slug }}</p>
          <button
            @click="deleteCategory(c.id)"
            class="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition shadow-sm hover:shadow-md w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-8">No categories available. Add one above!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Auto detect backend (Local + Render)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

console.log("🔗 Using API base:", API_BASE);

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategoryFilePreview = ref(null);
const newCategorySlug = ref("");

// File select + preview
const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0];
  newCategoryFilePreview.value = URL.createObjectURL(newCategoryFile.value);
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    categories.value = res.data;
  } catch (err) {
    console.error("❌ Fetch categories error:", err);
  }
};

// Add category
const addCategory = async () => {
  if (!newCategoryFile.value || !newCategorySlug.value) return;

  const formData = new FormData();
  formData.append("image", newCategoryFile.value);
  formData.append("slug", newCategorySlug.value);

  try {
    await axios.post(`${API_BASE}/categories`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newCategoryFile.value = null;
    newCategoryFilePreview.value = null;
    newCategorySlug.value = "";
    await fetchCategories();
  } catch (err) {
    console.error("❌ Add category error:", err);
  }
};

// Delete category
const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_BASE}/categories/${id}`);
    await fetchCategories();
  } catch (err) {
    console.error("❌ Delete category error:", err);
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
/* =========================
   THEME TOKENS (easy tweak)
========================= */
:root {
  --purple-1: #4a00e0;
  --purple-2: #8e2de2;
  --purple-3: #a855f7;
  --bg-soft: #f7f4ff;
  --card-br: 16px;
  --ring: rgba(142, 45, 226, 0.16);
  --shadow-soft: 0 6px 22px rgba(147, 51, 234, 0.14);
  --shadow-strong: 0 10px 32px rgba(147, 51, 234, 0.25);
}

/* ---------- Root Layout ---------- */
.category-manager {
  font-family: "Zalando Sans", "Poppins", system-ui, -apple-system, Segoe UI,
    Roboto, "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(135deg, var(--bg-soft), #efe9ff);
  min-height: 100vh;
  padding-bottom: 3.5rem;
}

/* ---------- Heading ---------- */
h2 {
  background: linear-gradient(90deg, var(--purple-1), var(--purple-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* ---------- Add Form ---------- */
form {
  border: 1.5px solid #eadcff;
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: var(--shadow-soft);
  backdrop-filter: saturate(120%) blur(2px);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}
form:hover {
  border-color: #d9c4ff;
  box-shadow: 0 8px 28px rgba(147, 51, 234, 0.18);
}

label {
  color: #432371;
  font-weight: 600;
  margin-bottom: 6px;
}

/* File input – modernized */
input[type="file"] {
  border: 1.5px solid #dfccff;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fcfaff;
}
input[type="file"]::file-selector-button {
  margin-right: 12px;
  border: 0;
  border-radius: 10px;
  padding: 8px 12px;
  background: linear-gradient(90deg, var(--purple-1), var(--purple-2));
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
input[type="file"]:focus {
  outline: none;
  box-shadow: 0 0 0 4px var(--ring);
  border-color: var(--purple-2);
}

/* Text input */
input[type="text"] {
  border: 1.5px solid #dfccff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 0.98rem;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
input[type="text"]:focus {
  border-color: var(--purple-2);
  box-shadow: 0 0 0 4px var(--ring);
  outline: none;
}

/* Preview */
.mt-3 {
  background: #faf7ff;
  border: 2px dashed #e6d9ff;
  height: 180px;
  border-radius: 14px;
  overflow: hidden;
  display: grid;
  place-items: center;
}
.mt-3 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Add button */
button[type="submit"] {
  background: linear-gradient(90deg, var(--purple-1), var(--purple-2));
  padding: 12px 28px;
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
  box-shadow: 0 6px 16px rgba(134, 32, 230, 0.35);
  transition: transform 0.2s ease, box-shadow 0.25s ease;
}
button[type="submit"]:hover {
  transform: translateY(-1.5px);
  box-shadow: var(--shadow-strong);
}

/* ---------- Grid ---------- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
}

/* Card */
.grid > div {
  border-radius: var(--card-br);
  border: 1.5px solid #efe6ff;
  background: linear-gradient(180deg, #ffffff, #fcfbff);
  box-shadow: 0 3px 14px rgba(86, 31, 188, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}
.grid > div:hover {
  transform: translateY(-6px);
  border-color: #dccaff;
  box-shadow: 0 10px 28px rgba(86, 31, 188, 0.18);
}

/* Image area (uniform height, safe crop) */
.grid .overflow-hidden {
  height: 220px; /* desktop default */
  position: relative;
  background: #f7f1ff;
}
.grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  transition: transform 0.45s ease;
}
.grid img:hover {
  transform: scale(1.06);
}

/* Title text */
.grid p {
  font-weight: 700;
  font-size: 1.06rem;
  color: #3b1c6e;
  text-align: center;
  margin-top: 2px;
  letter-spacing: 0.2px;
}

/* Delete button */
.grid button {
  background: linear-gradient(90deg, #ff4d5a, #e83e3e);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 11px 0;
  width: 100%;
  margin-top: 8px;
  box-shadow: 0 6px 14px rgba(232, 62, 62, 0.25);
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;
}
.grid button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(232, 62, 62, 0.34);
  filter: brightness(1.03);
}
.grid button:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(232, 62, 62, 0.18);
}

/* Empty state */
p.text-center {
  color: #6b21a8;
  font-weight: 500;
  font-style: italic;
  margin-top: 2rem;
}

/* ---------- Mobile / Tablet Tweaks ---------- */
@media (max-width: 1024px) {
  .grid .overflow-hidden {
    height: 200px;
  }
}

@media (max-width: 768px) {
  .category-manager {
    padding: 1.2rem;
  }
  form {
    flex-direction: column;
    padding: 1.25rem;
    border-radius: 18px;
  }
  button[type="submit"] {
    width: 100%;
  }
  .grid {
    gap: 1rem;
  }
  .grid .overflow-hidden {
    height: 180px; /* tighter in mobile */
  }
  .grid > div {
    border-radius: 14px;
  }
  /* Bigger tap targets */
  .grid button {
    padding: 13px 0;
    border-radius: 14px;
  }
}

/* ---------- (Optional) Subtle dark-mode respect ---------- */
@media (prefers-color-scheme: dark) {
  .category-manager {
    background: linear-gradient(135deg, #0f0a1a, #150f2a);
  }
  form,
  .grid > div {
    background: #17122a;
    border-color: #2b2050;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }
  label,
  .grid p,
  h2 {
    color: #efe9ff;
    -webkit-text-fill-color: initial;
    background: none;
  }
  input[type="text"],
  input[type="file"] {
    background: #1e1637;
    border-color: #3a2a6a;
    color: #f5f0ff;
  }
  .mt-3 {
    background: #221a40;
    border-color: #3a2a6a;
  }
}
</style>
