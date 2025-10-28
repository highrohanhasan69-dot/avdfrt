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
/* Overall container with a soft gradient background */
.category-manager {
  font-family: "Zalando Sans", "Poppins", sans-serif;
  background: linear-gradient(135deg, #f7f3ff, #f2ecff);
  min-height: 100vh;
  padding-bottom: 3rem;
}

/* Section Heading */
h2 {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
  font-weight: 800;
}

/* Form Container Styling */
form {
  border: 1.5px solid #e9d5ff;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 4px 18px rgba(147, 51, 234, 0.08);
  transition: all 0.3s ease;
}
form:hover {
  border-color: #c084fc;
  box-shadow: 0 4px 25px rgba(147, 51, 234, 0.15);
}

/* Labels */
label {
  color: #4b0082;
  font-weight: 600;
}

/* Text and File Inputs Base Style */
.custom-text-input,
.custom-file-input {
  border: 1.5px solid #d6bcfa;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.95rem;
  background: #fff;
  /* Remove outline and default focus ring to apply custom focus style */
  outline: none;
}

/* Hover and Focus for Inputs */
.custom-text-input:hover,
.custom-file-input:hover {
  border-color: #b085f5;
}
.custom-text-input:focus,
.custom-file-input:focus {
  border-color: #8e2de2;
  box-shadow: 0 0 0 3px rgba(142, 45, 226, 0.2);
}

/* File Input ::file-selector-button (the "Browse/Choose file" button) */
.custom-file-input::file-selector-button {
  background: linear-gradient(90deg, #6a00f4, #9d34e6);
  color: #fff;
  font-weight: 600;
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.custom-file-input::file-selector-button:hover {
  background: linear-gradient(90deg, #7c13ff, #a343eb);
}
/* Older WebKit (Safari) pseudo-element for file button */
.custom-file-input::-webkit-file-upload-button {
  background: linear-gradient(90deg, #6a00f4, #9d34e6);
  color: #fff;
  font-weight: 600;
  padding: 8px 16px;
  margin-right: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.custom-file-input::-webkit-file-upload-button:hover {
  background: linear-gradient(90deg, #7c13ff, #a343eb);
}

/* Preview Image Box */
.preview-image {
  width: 120px;
  height: 120px;
  margin: 0.75rem auto 0;  /* top margin and centered horizontally */
  background: #faf5ff;
  border: 2px solid #ede9fe;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Add Category Button */
.add-btn {
  background: linear-gradient(90deg, #6a00f4, #9d34e6);
  box-shadow: 0 4px 12px rgba(134, 32, 230, 0.35);
  padding: 11px 28px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  color: #fff;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
}
@media (min-width: 768px) {
  .add-btn {
    width: auto; /* on larger screens, button width adjusts to content */
  }
}
.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(134, 32, 230, 0.45);
  background: linear-gradient(90deg, #5a00d4, #8a2ac4);
}

/* Grid Layout for Category Cards */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}
.grid > div {
  background: #fff;
  border: 1.5px solid #ede9fe;
  border-radius: 18px;
  box-shadow: 0 4px 14px rgba(147, 51, 234, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}
.grid > div:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 26px rgba(147, 51, 234, 0.2);
  border-color: #c084fc;
}

/* Category Image in Card: make it square and scalable */
.grid .overflow-hidden {
  width: 100%;
  aspect-ratio: 1 / 1;          /* Ensure the container is always a square */
  position: relative;
}
.grid .overflow-hidden img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}
.grid .overflow-hidden img:hover {
  transform: scale(1.06);
}

/* Category Text */
.grid p {
  text-align: center;
  color: #4a008e;
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0;
}

/* Delete Button */
.delete-btn {
  background: linear-gradient(90deg, #ff4b2b, #ff416c);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(255, 75, 43, 0.25);
}
.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 75, 43, 0.4);
  background: linear-gradient(90deg, #e04327, #e03b60);
}

/* Empty State Text */
.category-manager p.text-center {
  color: #7e22ce;
  font-style: italic;
  font-weight: 500;
}

/* Responsive Adjustments for Mobile */
@media (max-width: 768px) {
  .category-manager {
    padding: 1.5rem;
  }
  form {
    flex-direction: column;
    padding: 1.5rem;
  }
  .add-btn {
    width: 100%;
  }
  /* Slightly smaller card image on small screens */
  .grid .overflow-hidden {
    aspect-ratio: 1 / 1;
    /* Height will auto-adjust due to aspect-ratio and width */
  }
  .grid .overflow-hidden img:hover {
    transform: none; /* disable hover zoom on small screens for usability */
  }
}
</style>
