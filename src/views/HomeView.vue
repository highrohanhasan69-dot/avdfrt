<template>
  <div>
    <Navbar />

    <div class="home-content">
      <!-- Banner Slider -->
      <div class="banner-slider" v-if="banners.length">
        <router-link :to="banners[currentIndex].link">
          <img
            :src="banners[currentIndex].image_url"
            :alt="banners[currentIndex].title || 'Banner'"
            class="banner-image"
          />
        </router-link>
        <h2 class="banner-title">{{ banners[currentIndex].title }}</h2>
      </div>

      <!-- Top Categories -->
      <div class="categories-section" v-if="categories.length">
        <h2 class="section-title">Top Categories</h2>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
          >
            <router-link :to="`/category/${category.slug}`">
              <img
                :src="category.image_url"
                :alt="category.name"
                class="category-image"
              />
              <p>{{ category.name }}</p>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Hot Deals Section -->
      <div class="products-section" v-if="hotDeals.length">
        <h2 class="section-title">🔥 Hot Deals</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in hotDeals"
            :key="product.id"
            :product="product"
          />
        </div>
        <p class="view-all" @click="router.push('/hot-deals')">View All Hot Deals</p>
      </div>

      <!-- Top Products Section -->
      <div class="products-section" v-if="topProducts.length">
        <h2 class="section-title">⭐ Top Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in topProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <p class="view-all" @click="router.push('/top-products')">See All Top Products</p>
      </div>

      <!-- All Products Section -->
      <div class="products-section" v-if="allProducts.length">
        <h2 class="section-title">🛒 All Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in allProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <p class="view-all" @click="router.push('/all-products')">View All Products</p>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { supabase } from "../lib/supabase";
import { useRouter } from "vue-router";

const banners = ref([]);
const currentIndex = ref(0);
let intervalId = null;
const router = useRouter();

const fetchBanners = async () => {
  const { data, error } = await supabase.from("banners").select("*");
  if (!error) banners.value = data;
};
const startSlider = () => {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % banners.value.length;
  }, 4000);
};
onMounted(async () => {
  await fetchBanners();
  if (banners.value.length) startSlider();
});
onUnmounted(() => {
  clearInterval(intervalId);
});

const categories = ref([]);
const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (!error) categories.value = data;
};
onMounted(() => fetchCategories());

// Hot Deals
const hotDeals = ref([]);
const fetchHotDeals = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_hot_deal", true)
    .limit(10);
  if (!error) hotDeals.value = data;
};
onMounted(() => fetchHotDeals());

// Top Products
const topProducts = ref([]);
const fetchTopProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_top_product", true)
    .limit(10);
  if (!error) topProducts.value = data;
};
onMounted(() => fetchTopProducts());

// All Products (first 10)
const allProducts = ref([]);
const fetchAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(10);
  if (!error) allProducts.value = data;
};
onMounted(() => fetchAllProducts());
</script>

<style scoped>
@import "../views/home.css";
</style>
