<template>
  <div>
    <Navbar />
    <h2 class="page-title">⭐ Top Products</h2>
    <div class="products-grid">
      <ProductCard
        v-for="product in topProducts"
        :key="product.id"
        :product="product"
      />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";

const topProducts = ref([]);
const fetchTopProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_top_product", true);
  if (!error) topProducts.value = data;
};
onMounted(() => fetchTopProducts());
</script>

<style scoped>
/* Two side 10% margin */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 20px;
}

/* Page title gradient & underline */
.page-title {
  margin-left: 10%;
  margin-top: 100px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  margin-top: 6px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  border-radius: 2px;
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ✅ Mobile - Always 2 per row */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .page-title {
    margin: 20px 5%;
  }
}

/* Very small screens - keep 2 per row */
@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
