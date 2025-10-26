<template>
  <div class="admin-page">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h1>

    <!-- Nav Tabs -->
    <nav class="flex flex-wrap gap-3 mb-6">
      <button
        @click="activeTab = 'banners'"
        :class="activeTab === 'banners' ? 'active-tab' : 'inactive-tab'"
      >
        Banners
      </button>

      <button
        @click="activeTab = 'categories'"
        :class="activeTab === 'categories' ? 'active-tab' : 'inactive-tab'"
      >
        Categories
      </button>

      <button
        @click="activeTab = 'products'"
        :class="activeTab === 'products' ? 'active-tab' : 'inactive-tab'"
      >
        Products
      </button>

      <button
        @click="activeTab = 'orders'"
        :class="activeTab === 'orders' ? 'active-tab' : 'inactive-tab'"
      >
        Orders
      </button>

      <button
        @click="activeTab = 'footer'"
        :class="activeTab === 'footer' ? 'active-tab' : 'inactive-tab'"
      >
        Footer
      </button>
    </nav>

    <!-- Tab Content -->
    <div class="tab-content">
      <div v-if="activeTab === 'banners'">
        <BannerManager />
      </div>

      <div v-else-if="activeTab === 'categories'">
        <CategoryManager />
      </div>

      <div v-else-if="activeTab === 'products'">
        <ProductsManager />
      </div>

      <div v-else-if="activeTab === 'orders'">
        <OrdersManager />
      </div>

      <div v-else-if="activeTab === 'footer'">
        <FooterManagement />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import BannerManager from "../components/admin/BannerManager.vue";
import CategoryManager from "../components/admin/CategoryManager.vue";
import ProductsManager from "../components/admin/ProductManager.vue";
import OrdersManager from "../components/admin/AdminOrders.vue";
import FooterManagement from "../components/FooterManagement.vue";

const activeTab = ref("banners");
</script>

<style scoped>
.admin-page {
  padding: 30px;
  max-width: 1000px;
  margin: auto;
  font-family: 'Inter', sans-serif;
  background-color: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
}

nav button {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

/* Active tab */
.active-tab {
  background: linear-gradient(to right, #4a00e0, #8e2de2);
  color: #fff;
  box-shadow: 0 4px 10px rgba(72, 0, 255, 0.3);
}

/* Inactive tab */
.inactive-tab {
  background: #e0e0e0;
  color: #555;
}

.inactive-tab:hover {
  background: #d1c4f9;
  color: #3c096c;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-content {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}
</style>
