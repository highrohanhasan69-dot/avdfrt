<template>
  <div class="product-card" @click="goToProductPage">
    <div class="image-box">
      <img :src="product.image_url" alt="Product Image" />
    </div>

    <h2 class="product-name">{{ product.name }}</h2>
    <p class="product-price">{{ product.price }}৳</p>

    <div class="button-group">
      <button class="btn" @click.stop="addToCart(product)">Add to cart</button>
      <button class="btn" @click.stop="buyNow(product)">Buy Now</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { useCartStore } from "@/components/cart.js";
import { useRouter } from "vue-router";

const props = defineProps({ product: Object });
const cartStore = useCartStore();
const router = useRouter();

// Card click -> product detail page
const goToProductPage = () => {
  router.push(`/product/${props.product.id}`);
};

// Cart functions
const addToCart = (product) => {
  cartStore.addItem(product);
}

const buyNow = (product) => {
  cartStore.addItem(product);
  router.push("/checkout");
}
</script>

<style scoped>
.product-card {
  width: 240px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 350px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer; /* Add cursor pointer */
}

.image-box {
  border: 1px solid #ddd;
  margin-right: 2.5%;
  margin-left: 2.5%;
  height: 70%;
  border-radius: 4px;
  margin-bottom: 1px;
  width: 95%;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 18px;
  font-weight: 500;
  color: #8800cc;
  margin: 4px 0 2px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #e77c01;
  margin-bottom: 6px;
}

.button-group {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.btn {
  flex: 1;
  padding: 6px 0;
  font-size: 12px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  color: #fff;
  background: linear-gradient(to right, #a100ff, #ff00ff);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100px;
  height: 35px;
}

.btn:hover {
  background: linear-gradient(to right, #8800cc, #cc00cc);
}
</style>
