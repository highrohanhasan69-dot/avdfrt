<template>
  <div>
    <Navbar />

    <div class="home-wrapper category-page">
      <h1 class="category-title">{{ slug }} Products</h1>

      <div v-if="products.length" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="empty">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Products"
        />
        <p>No products found in this category.</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import Footer from "../components/Footer.vue";
import ProductCard from "../components/ProductCard.vue";
import { ref, onMounted, watch } from "vue";
import axios from "axios";

// ✅ Props for category slug
const props = defineProps({
  slug: String,
});

// ✅ Auto Detect Backend (Local + Render + Cloudflare)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

const products = ref([]);

// ✅ Fetch products from backend
const fetchProducts = async () => {
  try {
    console.log("🔹 Category slug:", props.slug);
    // ✅ তোমার backend অনুযায়ী '/products' ব্যবহার করো
    const res = await axios.get("/products");
    console.log("✅ Total products loaded:", res.data?.length || 0);

    // Filter products by category_slug
    products.value = (res.data || []).filter(
      (p) => p.category_slug === props.slug
    );
    console.log("✅ Filtered products:", products.value.length);
  } catch (err) {
    console.error("❌ Error loading products:", err.message);
    products.value = [];
  }
};

// ✅ Watch slug change (route param change)
watch(
  () => props.slug,
  () => fetchProducts()
);

// ✅ Initial load
onMounted(fetchProducts);
</script>


<style scoped>
.home-wrapper {
  margin: 0 10%;
  padding: 20px 0;
  box-sizing: border-box;
  margin-top: 60px;
}

/* Category title */
.category-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #4A00E0;
  text-align: center;
}

/* Products grid: default (desktop) */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 per row on PC */
  gap: 20px;
}

/* Responsive for tablets and mobile */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr); /* tablet: 3 per row */
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* mobile: 2 per row */
  }
  .home-wrapper {
    margin: 0 5%;
  }
}

/* fallback card if ProductCard fails */
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
.product-card img {
  width: 100%;
  height: auto;
  object-fit: cover;
}
.product-card p {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
}
</style>
