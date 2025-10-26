<template>
  <div class="nav">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet"
      />
    </head>

    <!-- 🔹 NAVBAR -->
    <header :class="['navbar', { scrolled: isScrolled }]">
      <div class="nav-inner">
        <!-- ✅ Logo -->
        <div class="logo" @click="goHome">
          <img src="@/assets/logo.png" alt="AVADO" />
          <h3>AVADO</h3>
        </div>

        <!-- ✅ Search Box (Desktop Only) -->
        <div class="search-box pc-only">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            @focus="showSuggestions = true"
            @input="fetchSuggestions"
            @keydown.enter="goToSearchPage"
          />
          <button class="search-btn" @click="goToSearchPage">🔍</button>

          <ul
            v-if="showSuggestions && suggestions.length"
            class="suggestion-list"
          >
            <li
              v-for="(product, index) in suggestions"
              :key="index"
              @click="goToProduct(product.id)"
            >
              <img :src="product.image_url" />
              <span>{{ product.name }}</span>
            </li>
          </ul>
        </div>

        <!-- ✅ Desktop Nav Icons -->
        <nav class="pc-only">
          <ul class="nav-items">
            <li @click="goHotDeals">
              <img :src="giftIcon" /><span>Offer</span>
            </li>
            <li @click="goOrders">
              <img :src="bagIcon" /><span>Orders</span>
            </li>

            <li @click="toggleCart" class="cart-item">
              <img :src="cartIcon" /><span>Cart</span>
              <span
                v-if="itemCount > 0"
                :class="['cart-badge', { bounce: animateCart }]"
                >{{ itemCount }}</span
              >
            </li>

            <li @click="goAccount">
              <img :src="userIcon" />
              <span>{{
                currentUser
                  ? currentUser.email || currentUser.phone
                  : "Account"
              }}</span>
            </li>
          </ul>
        </nav>

        <!-- ✅ Mobile Search Icon -->
        <button class="mobile-search-btn mobile-only" @click="toggleMobileSearch">
          🔍
        </button>
      </div>
    </header>

    <!-- 🔍 Mobile Search Overlay -->
    <div v-if="mobileSearchOpen" class="mobile-search">
      <div class="search-input">
        <input
          v-model="searchQuery"
          placeholder="Search products..."
          @input="fetchSuggestions"
          @keydown.enter="goToSearchPage"
        />
        <i class="fas fa-times close" @click="toggleMobileSearch"></i>
      </div>

      <ul v-if="suggestions.length" class="mobile-suggestion-list">
        <li
          v-for="(product, index) in suggestions"
          :key="index"
          @click="goToProduct(product.id)"
        >
          <img :src="product.image_url" />
          <span>{{ product.name }}</span>
        </li>
      </ul>
    </div>

    <!-- 📱 Mobile Bottom Bar -->
    <nav class="mobile-bottom-bar">
      <ul>
        <li @click="goHome">
          <img :src="homeIcon" /><span>Home</span>
        </li>
        <li @click="goHotDeals">
          <img :src="giftIcon" /><span>Offer</span>
        </li>
        <li @click="goOrders">
          <img :src="bagIcon" /><span>Orders</span>
        </li>
        <li @click="toggleCart" class="cart-item">
          <img :src="cartIcon" /><span>Cart</span>
          <span
            v-if="itemCount > 0"
            :class="['cart-badge-mobile', { bounce: animateCart }]"
            >{{ itemCount }}</span
          >
        </li>
        <li @click="goAccount">
          <img :src="userIcon" /><span>Account</span>
        </li>
      </ul>
    </nav>

    <!-- 🛒 Cart Drawer -->
    <CartDrawer v-if="cartOpen" @close="toggleCart" />
  </div>
</template>

<script setup>
import homeIcon from "@/assets/icons/icons8-home-50.png";
import giftIcon from "@/assets/icons/gift.svg";
import bagIcon from "@/assets/icons/shopping-bag.svg";
import cartIcon from "@/assets/icons/shopping-cart.svg";
import userIcon from "@/assets/icons/circle-user-round.svg";
import CartDrawer from "../components/cart.vue";
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useCartStore } from "../stores/cart";
import { storeToRefs } from "pinia";
import axios from "axios";

const router = useRouter();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);

const currentUser = ref(null);
const cartOpen = ref(false);
const mobileSearchOpen = ref(false);
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const isScrolled = ref(false);
const animateCart = ref(false);

const getUser = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/auth/current-user", {
      withCredentials: true,
    });
    currentUser.value = res.data.user;
  } catch {
    currentUser.value = null;
  }
};
onMounted(getUser);

const fetchSuggestions = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  try {
    const res = await axios.get(
      `http://localhost:5000/products/search?q=${encodeURIComponent(query)}`
    );
    suggestions.value = res.data || [];
    showSuggestions.value = true;
  } catch (err) {
    console.error("❌ Search failed:", err);
  }
};

const goToProduct = (id) => {
  showSuggestions.value = false;
  mobileSearchOpen.value = false;
  router.push(`/product/${id}`);
};

const goToSearchPage = () => {
  const query = searchQuery.value.trim();
  if (!query) return;
  router.push({ path: "/search", query: { q: query } });
  showSuggestions.value = false;
  mobileSearchOpen.value = false;
};

const goHome = () => router.push("/");
const goOrders = () => router.push("/orders");
const goHotDeals = () => router.push("/hot-deal");
const goAccount = () =>
  currentUser.value ? router.push("/account") : router.push("/login");
const toggleCart = () => (cartOpen.value = !cartOpen.value);
const toggleMobileSearch = () =>
  (mobileSearchOpen.value = !mobileSearchOpen.value);
const handleScroll = () => (isScrolled.value = window.scrollY > 40);

onMounted(() => window.addEventListener("scroll", handleScroll));
onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));

watch(itemCount, () => {
  animateCart.value = true;
  setTimeout(() => (animateCart.value = false), 400);
});
</script>

<style scoped>
:root {
  --purple-dark: #4a00e0;
  --purple-light: #8e2de2;
  --accent-gradient: linear-gradient(90deg, var(--purple-dark), var(--purple-light));
  --shadow: rgba(142, 45, 226, 0.3);
  --font-main: "Zalando Sans", sans-serif;
}

/* ================== VISIBILITY ================== */
.pc-only {
  display: flex;
}
.mobile-only {
  display: none;
}

/* ================== 🟪 NAVBAR ================== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: 0.3s ease;

}
.nav-inner {
  width: 100%;
padding: 0 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 🔹 দুই পাশে equal 10% gap */
  box-sizing: border-box;
}
.navbar.scrolled {
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 3px 15px var(--shadow);
}

/* ✅ Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.logo img {
  width: 70px; height: 85%;
}
.logo h3 {
  font-size: 30px;
  color: white;
  font-family: "Abril Fatface", serif;
  font-weight: 300;
}

/* ✅ Search Box */
.search-box {
  position: relative;
  width: 40%;
  display: flex;
  background: white;
  border-radius: 50px;
  padding: 5px 15px;
  box-sizing: border-box;
}
.search-box input {
  border: none;
  flex: 1;
  padding: 10px;
  font-size: 15px;
  outline: none;
  border-radius: 50px;
font-family: "Zalando Sans", sans-serif;}
.search-btn {
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
}

/* ✅ Suggestions */
.suggestion-list {
  position: absolute;
  top: 50px;
  left: 0;
  width: 95%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1001;
}
.suggestion-list li {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 10px;
  cursor: pointer;
}
.suggestion-list li:hover {
  background: rgba(142, 45, 226, 0.1);
}
.suggestion-list img {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  object-fit: cover;
}

/* ✅ Nav Items */
.nav-items {
  display: flex;
  align-items: center;
  gap: 30px;
  color: white;
font-size: 14px; color: white; transition: all 0.3s ease; font-family: "Zalando Sans", sans-serif; font-weight: 500;
}
.nav-items li {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  transition: 0.3s ease;
  position: relative;
}
.nav-items li img {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
  margin-bottom: 3px;
}
.nav-items li:hover {
  color: var(--purple-light);
}
.nav-items li:hover img {
  filter: brightness(0) invert(32%) sepia(84%) saturate(2800%)
    hue-rotate(257deg) brightness(90%) contrast(95%);
}

/* ✅ Cart Badge */
.cart-badge,
.cart-badge-mobile {
  position: absolute;
  top: -5px;
  right: -10px;
  background: red;
  color: white;
  font-size: 11px;
  border-radius: 50%;
  padding: 2px 6px;
}
.cart-badge-mobile {
  font-size: 10px;
  top: 0;
  right: 12px;
}
.cart-badge.bounce,
.cart-badge-mobile.bounce {
  transform: scale(1.3);
  transition: transform 0.3s ease;
}

/* ✅ Mobile Bottom Bar */
.mobile-bottom-bar {
  display: none;
}

/* ================== 📱 RESPONSIVE ================== */
@media (max-width: 768px) {
  .pc-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }

  .nav-inner {
    padding: 0 5%;
  }

  /* 🔹 Bottom Bar */
  .mobile-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #000;
    display: flex;
    justify-content: space-around;
    padding: 8px 0;
    border-top: 1px solid rgba(142, 45, 226, 0.4);
  }
  .mobile-bottom-bar ul {
    display: flex;
    justify-content: space-around;
    width: 100%;
    list-style: none;
  }
  .mobile-bottom-bar li {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-size: 12px;
  }
  .mobile-bottom-bar li img {
    width: 22px;
    height: 22px;
    filter: brightness(0) invert(1);
  }

  /* 🔹 Mobile Search */
  .mobile-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    z-index: 2000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }
  .search-input {
    background: white;
    border-radius: 50px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }
  .search-input input {
    border: none;
    flex: 1;
    font-size: 16px;
    outline: none;
  }
  .close {
    font-size: 22px;
    color: var(--purple-dark);
    margin-left: 8px;
    cursor: pointer;
  }
}
</style>
