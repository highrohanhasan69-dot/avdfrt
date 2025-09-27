<template>
  <div class="category-page">
    <h1>{{ slug }} Products</h1>

    <div v-if="products.length">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image_url" :alt="product.name" />
        <p>{{ product.name }}</p>
      </div>
    </div>
    <div v-else>
      <p>No products found in this category.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";

const props = defineProps({
  slug: String
});

const products = ref([]);

const fetchProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_slug", props.slug); // slug দিয়ে filter

  if (error) console.error("Error loading products:", error.message);
  else products.value = data;
};

onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-card {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
}
</style>
