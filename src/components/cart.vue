<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  </head>

  <div class="cart-panel" :class="{ open: open }">
    <div class="cart-header">
      <h2>My Cart</h2>
      <button class="close-cart" @click="$emit('close')">×</button>
    </div>

    <div v-if="cartStore.items.length">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <div class="item-info">
          <img :src="getImageUrl(item)" alt="Product Image" class="item-img" />
          <div class="details">
            <p class="name">{{ item.name }}</p>
            <p class="price">{{ item.price }}৳</p>
            <p v-if="item.selectedVariants?.length" class="variants">
              <span v-for="(v, i) in item.selectedVariants" :key="i">
                {{ v.variantName }}: {{ v.optionName }}
              </span>
            </p>
          </div>
        </div>

        <div class="item-actions">
          <div class="quantity-control">
            <button @click="decrease(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increase(item)">+</button>
          </div>
          <button class="remove-btn" @click="remove(item)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>

      <div class="cart-footer">
        <p>Total: {{ cartStore.totalPrice }}৳</p>
        <button class="checkout-btn" @click="goToCheckout">Checkout</button>
      </div>
    </div>
    <div v-else>No items in cart.</div>
  </div>
</template>

<script setup>
import { useCartStore } from "@/components/cart.js";
import { useRouter } from "vue-router";
import { reactive } from "vue";

const cartStore = useCartStore();
const router = useRouter();
defineProps({ open: Boolean });

const getImageUrl = (item) => {
  if (item.image) return item.image;
  if (item.image_url) return item.image_url;
  if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
  return "https://via.placeholder.com/60x60?text=No+Image";
};

const goToCheckout = () => router.push("/checkout");

// ✅ Delete function
const remove = (item) => {
  if(confirm(`Remove "${item.name}" from cart?`)) {
    cartStore.removeItem(item);
  }
};

// ✅ Increase/Decrease quantity
const increase = (item) => cartStore.increaseQuantity(item);
const decrease = (item) => cartStore.decreaseQuantity(item);
</script>

<style scoped>
.cart-panel {
   font-family: "Zalando Sans";
  position: fixed;
  top: 0;
  right: -400px;
  width: 350px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.2);
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 99989999;
}
.cart-panel.open { right: 0; }

.cart-header { display: flex; justify-content: space-between; align-items: center; }
.close-cart { background: #8E2DE2; color: white; border: none; border-radius: 4px; padding: 4px 10px; cursor: pointer; font-size: 20px; }

.cart-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
.item-info { display: flex; gap: 10px; }
.item-img { width: 50px; height: 50px; border-radius: 6px; object-fit: cover; }
.details { display: flex; flex-direction: column; font-size: 14px; }
.name { font-weight: bold; }
.price { color: #8E2DE2; font-size: 14px; }
.variants { font-size: 12px; color: #555; }

.item-actions { display: flex; align-items: center; gap: 10px; }

.quantity-control { display: flex; align-items: center; gap: 6px; }
.quantity-control button {
  padding: 4px 8px;
  background: #8E2DE2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.remove-btn {
  background: #ff4d4f;
  border: none;
  color: white;
  padding: 5px 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
.remove-btn i { pointer-events: none; }

.cart-footer { margin-top: 20px; text-align: center; }
.checkout-btn { background: #8E2DE2; color: #fff; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; }
</style>
