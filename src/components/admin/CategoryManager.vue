<template>
  <div class="category-manager max-w-6xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-900">
      Manage Categories
    </h2>

    <!-- Add Category Form -->
    <form @submit.prevent="addCategory" class="flex flex-col md:flex-row items-start gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg">
      <!-- File Input & Preview Column -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-700 mb-2 font-medium">Select Category Image</label>
        <!-- Custom Styled File Input -->
        <input
          type="file"
          @change="onCategoryFileChange"
          accept="image/*"
          required
          class="border rounded-md px-3 py-2 w-full transition custom-file-input"
        />
        <!-- Image Preview (shown if a new image is selected) -->
        <div v-if="newCategoryFilePreview" class="preview-image">
          <img :src="newCategoryFilePreview" alt="Preview" />
        </div>
      </div>

      <!-- Slug Input -->
      <div class="flex flex-col w-full md:w-1/2">
        <label class="text-gray-700 mb-2 font-medium">Category Slug</label>
        <input
          v-model="newCategorySlug"
          placeholder="Slug (e.g. electronics)"
          required
          class="border rounded-md px-3 py-2 w-full transition custom-text-input"
        />
      </div>

      <!-- Add Button -->
      <div class="flex items-end w-full md:w-auto">
        <button type="submit" class="add-btn">
          Add Category
        </button>
      </div>
    </form>

    <!-- Category List Grid -->
    <div v-if="categories.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="c in categories" :key="c.id"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
      >
        <!-- Category Image (square thumbnail) -->
        <div class="overflow-hidden">
          <img :src="c.image_url" alt="Category" class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        </div>
        <!-- Category Info -->
        <div class="p-4 flex flex-col gap-2">
          <p class="text-lg font-semibold text-gray-800 text-center">{{ c.slug }}</p>
          <button @click="deleteCategory(c.id)" class="delete-btn">
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-8">
      No categories available. Add one above!
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Auto detect backend (Local + Render)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategoryFilePreview = ref(null);
const newCategorySlug = ref("");

// Handle file selection and preview generation
const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0] || null;
  newCategoryFilePreview.value = newCategoryFile.value
    ? URL.createObjectURL(newCategoryFile.value)
    : null;
};

// Fetch categories on component mount
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    categories.value = res.data;
  } catch (err) {
    console.error("❌ Fetch categories error:", err);
  }
};

// Add a new category (send form data with image and slug)
const addCategory = async () => {
  if (!newCategoryFile.value || !newCategorySlug.value) return;
  const formData = new FormData();
  formData.append("image", newCategoryFile.value);
  formData.append("slug", newCategorySlug.value);
  try {
    await axios.post(`${API_BASE}/categories`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // Reset form inputs
    newCategoryFile.value = null;
    newCategoryFilePreview.value = null;
    newCategorySlug.value = "";
    // Refresh the category list
    await fetchCategories();
  } catch (err) {
    console.error("❌ Add category error:", err);
  }
};

// Delete a category by ID
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
.footer-manager {
  max-width: 1100px;
  margin: 70px auto;
  padding: 10px;
  font-family: "Zalando Sans", sans-serif;
}

.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 25px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ==== Section Card ==== */
.section-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 18px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 28px;
  border-left: 5px solid #8e2de2;
  transition: 0.3s;
}
.section-card:hover {
  transform: translateY(-2px);
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 15px;
}

/* ==== Inputs ==== */
.input-row,
.input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}
.input-row input,
.input-grid input {
  flex: 1;
  min-width: 150px;
  padding: 9px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  outline: none;
  transition: 0.3s;
}
.input-row input:focus,
.input-grid input:focus {
  border-color: #8e2de2;
  box-shadow: 0 0 6px rgba(142, 45, 226, 0.3);
}

/* ==== Buttons ==== */
.add-btn,
.update-btn,
.delete-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.25s ease;
}
.add-btn {
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
}
.update-btn {
  background: #4a00e0;
  color: white;
}
.delete-btn {
  background: #ff4d4d;
  color: white;
}
.add-btn:hover,
.update-btn:hover,
.delete-btn:hover {
  opacity: 0.9;
}
.full-btn {
  margin-top: 10px;
  width: 100%;
}

/* ==== Table (Desktop) ==== */
.responsive-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #eee;
  padding: 10px;
  text-align: left;
  font-size: 14px;
}
th {
  background: #f9f8ff;
  font-weight: 700;
  color: #4a00e0;
}
.icon-img {
  height: 40px;
  border-radius: 6px;
}

/* ==== Mobile Card Layout ==== */
@media (max-width: 768px) {
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
  }

  thead {
    display: none;
  }

  tbody tr {
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 12px;
    margin-bottom: 12px;
    padding: 12px;
    box-shadow: 0 2px 6px rgba(142, 45, 226, 0.08);
  }

  td {
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13.5px;
    padding: 6px 0;
  }

  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #4a00e0;
  }

  td input[type="text"],
  td input[type="file"] {
    flex: 1;
    margin-left: 8px;
    border-radius: 6px;
    padding: 6px;
    border: 1px solid #ccc;
  }

  .action-cell {
    display: flex;
    gap: 6px;
    justify-content: flex-end;
    margin-top: 6px;
  }

  .action-cell button {
    flex: 1;
    font-size: 12px;
    padding: 6px 8px;
  }

  .icon-img {
    height: 35px;
  }

  .input-row,
  .input-grid {
    flex-direction: column;
  }

  .add-btn,
  .update-btn,
  .delete-btn {
    width: 100%;
    font-size: 14px;
  }
}
</style>
