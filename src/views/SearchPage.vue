<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Main Search Content -->
    <div class="search-page-wrapper">
      <h1 class="search-title">Search Results for "{{ query }}"</h1>

      <div v-if="loading" class="loading-text">Loading...</div>

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
import { supabase } from "@/lib/supabase";

import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import ProductCard from "@/components/ProductCard.vue";

// Reactive variables
const route = useRoute();
const query = ref(route.query.q || "");
const products = ref([]);
const loading = ref(false);

// Fetch products function
const fetchProducts = async (searchTerm) => {
  loading.value = true;
  try {
    if (!searchTerm) {
      products.value = [];
      loading.value = false;
      return;
    }
    const { data, error } = await supabase
      .from("products")
      .select("id, name, image_url, price")
      .ilike("name", `%${searchTerm}%`)
      .order("name", { ascending: true });
    if (error) throw error;
    products.value = data;
  } catch (err) {
    console.error("Search Error:", err.message);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch query param changes
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = newQuery || "";
    fetchProducts(query.value);
  },
  { immediate: true }
);

// Initial fetch
onMounted(() => {
  fetchProducts(query.value);
});
</script>

<style scoped>
.search-page-wrapper {
  max-width: 1200px;
  margin: 120px auto 50px auto; /* navbar height accounted */
  padding: 0 20px;
}

.search-title {
  font-size: 28px;
  font-family: "Abril Fatface", serif;
  color: #4a00e0;
  margin-bottom: 30px;
}

.loading-text {
  font-size: 18px;
  text-align: center;
  color: #333;
  margin-top: 40px;
}

.no-results {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 50px;
}

/* Desktop grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Mobile responsive: 2 products per row */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}
</style>
