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
.category-manager {
  font-family: "Zalando Sans", "Poppins", sans-serif;
  background: linear-gradient(135deg, #f9f8ff, #f3ecff);
  min-height: 100vh;
  border-radius: 16px;
}

h2 {
  background: linear-gradient(to right, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}

form {
  background: #fff;
  border: 2px solid #f3e8ff;
  transition: all 0.3s ease;
}
form:hover {
  border-color: #a855f7;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
}

input[type="file"],
input[type="text"],
input[type="email"],
input[type="password"] {
  border: 1.5px solid #d6bcfa;
  transition: all 0.2s ease;
}
input:focus {
  border-color: #8e2de2;
  box-shadow: 0 0 0 3px rgba(142, 45, 226, 0.15);
}

button[type="submit"] {
  background: linear-gradient(to right, #6a00f4, #9d34e6);
  box-shadow: 0 4px 10px rgba(134, 32, 230, 0.4);
  transition: all 0.3s ease;
}
button[type="submit"]:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(134, 32, 230, 0.6);
}

/* Category Cards */
.grid > div {
  border: 2px solid #f3e8ff;
  background: white;
  transition: all 0.3s ease;
}
.grid > div:hover {
  border-color: #c084fc;
  box-shadow: 0 6px 20px rgba(147, 51, 234, 0.2);
  transform: translateY(-4px);
}

.grid img {
  border-bottom: 2px solid #f3e8ff;
}

.grid p {
  font-weight: 600;
  color: #4b0082;
  letter-spacing: 0.3px;
}

.grid button {
  background: linear-gradient(to right, #ff416c, #ff4b2b);
  transition: all 0.3s ease;
}
.grid button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.4);
}

/* Empty State */
p.text-center {
  font-style: italic;
  color: #7e22ce;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .category-manager {
    padding: 1.5rem;
  }

  form {
    padding: 1rem;
  }

  button[type="submit"] {
    width: 100%;
  }

  .grid > div {
    border-radius: 14px;
  }
}
</style>
