<template>
  <div class="category-manager">
    <h2 class="title">Manage Categories</h2>

    <!-- Add Category Form -->
    <form @submit.prevent="addCategory" class="add-category-form">
      <label class="file-input-label">
        <input type="file" @change="onCategoryFileChange" accept="image/*" required />
        <span>Select Image</span>
      </label>
      <input
        v-model="newCategorySlug"
        placeholder="Slug (e.g. electronics)"
        required
        class="slug-input"
      />
      <button type="submit" class="add-btn">Add Category</button>
    </form>

    <!-- Categories List -->
    <ul class="category-list">
      <li v-for="c in categories" :key="c.id" class="category-item">
        <img :src="c.image_url" alt="category image" class="category-img" />
        <span class="category-slug">{{ c.slug }}</span>
        <button @click="deleteCategory(c.id)" class="delete-btn">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategorySlug = ref("");

const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0];
};

const fetchCategories = async () => {
  try {
    const res = await axios.get('http://localhost:5000/categories');
    categories.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const addCategory = async () => {
  if (!newCategoryFile.value || !newCategorySlug.value) return;

  const formData = new FormData();
  formData.append('image', newCategoryFile.value);
  formData.append('slug', newCategorySlug.value);

  try {
    await axios.post('http://localhost:5000/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    newCategoryFile.value = null;
    newCategorySlug.value = "";
    fetchCategories();
  } catch (err) {
    console.error(err);
  }
};

const deleteCategory = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/categories/${id}`);
    fetchCategories();
  } catch (err) {
    console.error(err);
  }
};

onMounted(() => fetchCategories());
</script>

<style scoped>
/* Container */
.category-manager {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Title */
.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #4a00e0;
  text-align: center;
}

/* Add Category Form */
.add-category-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  align-items: center;
  justify-content: center;
}

.file-input-label {
  display: inline-block;
  background-color: #4a00e0;
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}
.file-input-label:hover {
  background-color: #8e2de2;
}
.file-input-label input {
  display: none;
}

.slug-input {
  flex: 1 1 200px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.add-btn {
  background-color: #4a00e0;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}
.add-btn:hover {
  background-color: #8e2de2;
}

/* Categories List */
.category-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f5f5f5;
  padding: 12px;
  border-radius: 10px;
  transition: box-shadow 0.3s;
}
.category-item:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.category-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.category-slug {
  flex: 1;
  font-weight: 500;
  font-size: 15px;
  color: #333;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.3s;
}
.delete-btn:hover {
  background-color: #ff7875;
}

/* Responsive */
@media (max-width: 600px) {
  .add-category-form {
    flex-direction: column;
    gap: 8px;
  }
  .slug-input {
    width: 100%;
  }
  .category-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .category-img {
    width: 100%;
    height: auto;
  }
}
</style>
