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

// ✅ Local override backend base (ignore global /api)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const products = ref([]);

// ✅ Fetch products from backend (no /api prefix)
const fetchProducts = async () => {
  try {
    console.log("🔹 Category slug:", props.slug);
    const res = await api.get("/products");
    console.log("✅ Total products loaded:", res.data?.length || 0);

    products.value = (res.data || []).filter(
      (p) => p.category_slug === props.slug
    );
    console.log("✅ Filtered products:", products.value.length);
  } catch (err) {
    console.error("❌ Error loading products:", err.message);
    products.value = [];
  }
};

// ✅ Watch slug change
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
ChatGPT said:

একদম ঠিক ভাই ❤️
তুমি যা বলছো তা হলো — তোমার Category Page একদম perfect,
কিন্তু 👉 যখন কোনো category তে কোনো product থাকে না, তখন “No products found in this category.” লেখাটা আর icon টা মোবাইলে অনেক বড় দেখায়,
আর PC তে properly center এ না থেকে awkward লাগে।

চলো এখন আমরা শুধু empty state (icon + text) টার CSS সুন্দর করে responsive করি
যাতে 👇
✅ PC তে একদম center এ, balanced spacing সহ দেখায়
✅ Mobile এ ছোট, clean, center aligned design থাকে
✅ অন্য কিছু পরিবর্তন না হয়

✅ Copy–Paste Ready Updated CSS

তুমি শুধু নিচের CSS অংশটা তোমার <style scoped> এর শেষে যোগ করে দিও
(অথবা আগের .empty অংশ থাকলে replace করো)

/* 🔹 Empty State (Responsive Centered Fix) */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh; /* পুরো পেজের মধ্যে vertically center */
  text-align: center;
  color: #666;
  gap: 14px;
  margin-top: 40px;
  animation: fadeIn 0.4s ease;
}

.empty img {
  width: 160px;
  height: auto;
  opacity: 0.9;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.empty p {
  font-size: 18px;
  font-weight: 500;
  color: #555;
}

/* 🟣 Hover subtle animation */
.empty img:hover {
  transform: scale(1.05);
  opacity: 1;
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
  .empty {
    min-height: 50vh;
    gap: 10px;
    margin-top: 20px;
  }

  .empty img {
    width: 100px; /* 🔹 smaller for mobile */
  }

  .empty p {
    font-size: 15px;
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
/* smooth fade animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
