<template>
  <div class="product-manager">
    <h2>Manage Products</h2>

    <!-- Add Product Form -->
    <form @submit.prevent="addProduct" class="add-product-form">
      <input v-model="newProductName" placeholder="Product Name" required />
      <textarea v-model="newProductDescription" placeholder="Description" required></textarea>
      <input v-model.number="newProductPrice" placeholder="Price" required />
      <select v-model="newProductCategorySlug" required>
        <option value="" disabled>Select Category</option>
        <option v-for="c in categories" :key="c.id" :value="c.slug">{{ c.slug }}</option>
      </select>
      <input type="file" @change="onProductFileChange" accept="image/*" required />

      <!-- New Columns -->
      <label>
        <input type="checkbox" v-model="newIsTopProduct" />
        Top Product
      </label>
      <label>
        <input type="checkbox" v-model="newIsHotDeal" />
        Hot Deal
      </label>
      <input type="number" v-model.number="newDiscountPercent" placeholder="Discount %" min="0" max="100" />
      <input type="datetime-local" v-model="newOfferEndDate" placeholder="Offer End Date" />

      <button type="submit">Add Product</button>
    </form>

    <!-- Product List -->
    <ul class="product-list">
      <li v-for="p in products" :key="p.id" class="product-item">
        <img :src="p.image_url" width="80" />
        <div>
          <p><strong>{{ p.name }}</strong></p>
          <p>{{ p.description }}</p>
          <p>${{ p.price }}</p>
          <p>Category: {{ getCategoryNameBySlug(p.category_slug) }}</p>
          <p v-if="p.is_top_product">Top Product</p>
          <p v-if="p.is_hot_deal">Hot Deal</p>
          <p v-if="p.discount_percent">Discount: {{ p.discount_percent }}%</p>
          <p v-if="p.offer_end_date">Offer Ends: {{ new Date(p.offer_end_date).toLocaleString() }}</p>
        </div>
        <button @click="deleteProduct(p.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

// Product state
const products = ref([]);
const categories = ref([]);

const newProductName = ref("");
const newProductDescription = ref("");
const newProductPrice = ref(0);
const newProductCategorySlug = ref("");
const newProductFile = ref(null);

// New fields
const newIsTopProduct = ref(false);
const newIsHotDeal = ref(false);
const newDiscountPercent = ref(null);
const newOfferEndDate = ref(null);

// Handle file change
const onProductFileChange = (e) => {
  newProductFile.value = e.target.files[0];
};

// Fetch categories
const fetchCategories = async () => {
  const { data, error } = await supabase.from("categories").select("*");
  if (error) console.error("Error fetching categories:", error.message);
  else categories.value = data || [];
};

// Fetch products
const fetchProducts = async () => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) console.error("Error fetching products:", error.message);
  else products.value = data || [];
};

// Add product
const addProduct = async () => {
  if (!newProductFile.value || !newProductCategorySlug.value) return;

  const fileExt = newProductFile.value.name.split(".").pop();
  const fileName = `product_${Date.now()}.${fileExt}`;

  // Upload image to 'products' bucket
  const { error: uploadError } = await supabase.storage
    .from("products")
    .upload(fileName, newProductFile.value, { upsert: true });

  if (uploadError) return console.error("Storage upload error:", uploadError.message);

  // Get public URL
  const { data: publicData } = supabase.storage.from("products").getPublicUrl(fileName);
  const publicURL = publicData.publicUrl;

  // Insert into products table
  const { error } = await supabase
    .from("products")
    .insert([
      {
        name: newProductName.value,
        description: newProductDescription.value,
        price: newProductPrice.value,
        category_slug: newProductCategorySlug.value,
        image_url: publicURL,
        is_top_product: newIsTopProduct.value,
        is_hot_deal: newIsHotDeal.value,
        discount_percent: newDiscountPercent.value,
        offer_end_date: newOfferEndDate.value,
      },
    ])
    .select();

  if (error) console.error("Insert error:", error.message);
  else {
    // Reset form
    newProductName.value = "";
    newProductDescription.value = "";
    newProductPrice.value = 0;
    newProductCategorySlug.value = "";
    newProductFile.value = null;
    newIsTopProduct.value = false;
    newIsHotDeal.value = false;
    newDiscountPercent.value = null;
    newOfferEndDate.value = null;

    fetchProducts();
  }
};

// Delete product
const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) console.error("Delete error:", error.message);
  else fetchProducts();
};

// Helper to get category name by slug
const getCategoryNameBySlug = (slug) => {
  const cat = categories.value.find((c) => c.slug === slug);
  return cat ? cat.slug : "Unknown";
};

// Load initial data
onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<style scoped>
.add-product-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.product-list {
  list-style: none;
  padding: 0;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.product-item img {
  border: 1px solid #ccc;
  padding: 5px;
}
</style>
