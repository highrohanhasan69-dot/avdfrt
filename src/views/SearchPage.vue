<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Main Search Content -->
    <div class="search-page-wrapper">
      <h1 class="search-title">Search Results for "{{ query }}"</h1>

      <!-- Loading State -->
      <div v-if="loading" class="loading-text">Loading...</div>

      <!-- Results -->
      <div v-else>
        <div v-if="products.length" class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-else class="no-results">
          <p>No products found for "{{ query }}"</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import ProductCard from "@/components/ProductCard.vue";

// ===============================
// 🔹 Reactive Variables
// ===============================
const route = useRoute();
const query = ref(route.query.q || "");
const products = ref([]);
const loading = ref(false);

// ===============================
// 🔍 Fetch Products (Node.js API)
// ===============================
const fetchProducts = async (searchTerm) => {
  loading.value = true;
  try {
    if (!searchTerm.trim()) {
      products.value = [];
      loading.value = false;
      return;
    }

    // ✅ Fetch from Node backend
    const res = await axios.get(
      `http://localhost:5000/products/search?q=${encodeURIComponent(
        searchTerm
      )}`
    );

    products.value = res.data || [];
  } catch (err) {
    console.error("❌ Search Error:", err.message);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// ===============================
// 🧠 Watch for query param change
// ===============================
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = newQuery || "";
    fetchProducts(query.value);
  },
  { immediate: true }
);

// ===============================
// 🚀 Initial Fetch on Mount
// ===============================
onMounted(() => {
  fetchProducts(query.value);
});
</script>

<style scoped>
/* =============================== */
/* 🔹 Page Layout */
/* =============================== */
.search-page-wrapper {
  max-width: 1200px;
  margin: 120px auto 50px auto; /* navbar height offset */
  padding: 0 20px;
  min-height: 70vh;
}

/* 🔹 Title */
.search-title {
  font-size: 28px;
  font-family: "Abril Fatface", serif;
  color: #4a00e0;
  margin-bottom: 30px;
  text-align: center;
}

/* 🔹 Loading & No Result */
.loading-text,
.no-results {
  font-size: 18px;
  text-align: center;
  margin-top: 40px;
}
.loading-text {
  color: #333;
}
.no-results {
  color: #888;
}

/* 🔹 Product Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* 🔹 Responsive */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>
