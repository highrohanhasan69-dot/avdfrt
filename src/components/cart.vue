<template>
  <div class="cart-panel" :class="{ open: cartStore.isCartOpen }">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="close-btn" @click="cartStore.toggleCart">✕</button>
    </div>

    <ul>
      <li v-for="(item, index) in cartStore.items" :key="index">
        {{ item.name }} - {{ item.price }}৳
        <button @click="cartStore.removeItem(index)">Remove</button>
      </li>
    </ul>

    <p v-if="cartStore.items.length === 0">Cart is empty</p>
    <p v-else>Total: {{ cartStore.totalPrice }}৳</p>

    <button v-if="cartStore.items.length > 0" @click="checkout">Checkout</button>
  </div>
</template>

<script setup>
import { useCartStore } from "@/components/cart.js"; // <-- Pinia store import
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

const checkout = () => {
  cartStore.toggleCart();
  router.push("/checkout"); // Checkout page route
}
</script>

<style scoped>
.cart-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 8px rgba(0,0,0,0.2);
  padding: 20px;
  transition: right 0.3s ease;
  z-index: 999;
}
.cart-panel.open {
  right: 0;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

button {
  cursor: pointer;
}
</style>
