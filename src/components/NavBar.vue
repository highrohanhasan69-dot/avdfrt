<template>
  <div class="navbarcontainer">
    <div class="logo">
      <div class="logoimg">
        <img src="@/assets/logo.png" alt="AVADO Logo" />
      </div>
      <div class="logoname">AVADO</div>
    </div>

    <div class="hamburger" @click="toggleMenu">
      <span :class="{ 'bar1': true, 'change': isOpen }"></span>
      <span :class="{ 'bar2': true, 'change': isOpen }"></span>
      <span :class="{ 'bar3': true, 'change': isOpen }"></span>
    </div>

    <div class="navmenu">
      <ul :class="['nav-links', { 'open': isOpen }]">
        <!-- Offer Button -->
        <li @click="goHotDeals">
          <img :src="giftIcon" alt="Gift Icon" class="icon" />
          <span class="icon-text">Offer</span>
        </li>

        <!-- Orders -->
        <li @click="goOrders">
          <img :src="bagIcon" alt="Bag Icon" class="icon" />
          <span class="icon-text">Order</span>
        </li>

        <!-- Cart -->
        <li @click="cartStore.toggleCart">
          <div class="cart-wrapper">
            <img :src="cartIcon" alt="Cart Icon" class="icon" />
            <span class="icon-text">Cart</span>
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </div>
        </li>

        <!-- Account -->
        <li @click="goAccount">
          <img :src="userIcon" alt="User Icon" class="icon" />
          <span class="icon-text">
            {{ currentUser ? (currentUser.user_metadata?.name || currentUser.email) : 'Account' }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Slide Cart -->
    <Cart />
  </div>
</template>

<script setup>
import giftIcon from '@/assets/icons/gift.svg'
import bagIcon from '@/assets/icons/shopping-bag.svg'
import cartIcon from '@/assets/icons/shopping-cart.svg'
import userIcon from '@/assets/icons/circle-user-round.svg'

import { useCartStore } from "@/components/cart.js";
import Cart from "./cart.vue";
import { useRouter } from 'vue-router';
import { supabase } from "@/lib/supabase";
import { ref, onMounted } from "vue";

const cartStore = useCartStore();
const router = useRouter();
const currentUser = ref(null);

const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user;
};

const goOrders = () => router.push('/orders');
const goAccount = () => {
  if (currentUser.value) router.push('/account');
  else router.push('/signup'); // first show signup
};

// ✅ New function for Offer button
const goHotDeals = () => router.push('/hot-deal'); // Hot Deal page route

onMounted(() => getUser());
</script>

<script>
export default {
  name: 'NavBar',
  data() {
    return { isOpen: false }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped>
/* Navbar fix */
.navbarcontainer {
  margin: 0;
  position: sticky;
  top: 0;
  width: 100%;
  height: 80px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 5%;
  padding-right: 5%;
  box-sizing: border-box; /* ✅ prevent overflow */
  z-index: 999999;
}
.logo { display: flex; align-items: center; color: white; gap: 10px;  }
.logoimg img { width: 70px; height: 85%; }
.logoname { font-size: 30px; color: white; text-transform: uppercase; }

.icon { margin-bottom: 5px; width: 25px; height: 25px; filter: brightness(0) invert(1); }
.nav-links { list-style: none; display: flex; gap: 30px; align-items: center; }
.nav-links li { display: flex; flex-direction: column; align-items: center; cursor: pointer; }
.icon-text { font-size: 17px; color: white; }
.cart-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
.cart-badge { position: absolute; top: -5px; right: -10px; background: red; color: white; font-size: 12px; border-radius: 50%; padding: 2px 6px; }
.cart-panel { position: fixed; top: 0; right: -400px; width: 300px; height: 100%; background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.2); padding: 20px; transition: right 0.3s ease; z-index: 999; }
.cart-panel.open { right: 0; }
</style>
