 <template>
  <div>
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet"
      >
    </head>

    <!-- ✅ Top Navbar -->
    <div :class="['navbarcontainer', { 'scrolled': isScrolled }]">
      <!-- Logo -->

      <div class="logo" @click="goHome" style="cursor:pointer">
        <div class="logoimg">
          <img src="@/assets/logo.png" alt="AVADO Logo" />
        </div>
        <div class="logoname">AVADO</div>
      </div>

      <!-- 🔍 Search Bar (Desktop only) -->
      <div class="searchbar-container pc-only">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          @focus="showSuggestions = true"
          @input="fetchSuggestions"
          @keydown.enter="goToSearchPage"
        />
        <div class="search-icon" @click="goToSearchPage">
          <i class="fas fa-search"></i>
        </div>

        <!-- ✅ Dropdown Suggestion Box -->
        <ul v-if="showSuggestions && suggestions.length" class="suggestions-box">
          <li
            v-for="(product, index) in suggestions"
            :key="index"
            @click="goToProduct(product.id)"
          >
            <img :src="product.image_url" alt="img" />
            <span>{{ product.name }}</span>
          </li>
        </ul>
      </div>

      <!-- 🔥 Nav Links (PC only) -->
      <ul class="nav-links pc-only">
        <li @click="goHotDeals">
          <img :src="giftIcon" alt="Gift Icon" class="icon" />
          <span class="icon-text">Offer</span>
        </li>

        <li @click="goOrders">
          <img :src="bagIcon" alt="Bag Icon" class="icon" />
          <span class="icon-text">Order</span>
        </li>

        <li class="cart-li">
          <div class="cart-wrapper" @click="toggleCart">
            <img :src="cartIcon" alt="Cart Icon" class="icon" />
            <span class="icon-text">Cart</span>
            <span v-if="cartStore.itemCount > 0" class="cart-badge">
              {{ cartStore.itemCount }}
            </span>
          </div>
        </li>

        <li @click="goAccount">
          <img :src="userIcon" alt="User Icon" class="icon" />
          <span class="icon-text">
            {{ currentUser ? (currentUser.user_metadata?.name || currentUser.email) : 'Account' }}
          </span>
        </li>
      </ul>

      <!-- ✅ Mobile Search Icon -->
      <div class="mobile-search-icon mobile-only" @click="toggleMobileSearch">
        <i class="fas fa-search"></i>
      </div>
    </div>

    <!-- ✅ Mobile Search Overlay -->
    <div v-if="mobileSearchOpen" class="mobile-search-overlay">
      <div class="mobile-search-box">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          @input="fetchSuggestions"
          @keydown.enter="goToSearchPage"
        />
        <i class="fas fa-times close-icon" @click="toggleMobileSearch"></i>
      </div>

      <ul v-if="suggestions.length" class="mobile-suggestions">
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

    <!-- ✅ Mobile Bottom Bar -->
    <ul class="bottom-bar">
       <li @click="goHome">
        <img :src="homeIcon" alt="Offer" />
        <span>Home</span>
      </li>
      <li @click="goHotDeals">
        <img :src="giftIcon" alt="Offer" />
        <span>Offer</span>
      </li>
      <li @click="goOrders">
        <img :src="bagIcon" alt="Order" />
        <span>Order</span>
      </li>
      <li @click="toggleCart">
        <img :src="cartIcon" alt="Cart" />
        <span>Cart</span>
        <span v-if="cartStore.itemCount > 0" class="cart-badge-mobile">{{ cartStore.itemCount }}</span>
      </li>
      <li @click="goAccount">
        <img :src="userIcon" alt="Account" />
        <span>Account</span>
      </li>
    </ul>

    <!-- Cart Panel -->
    <Cart :open="cartOpen" @close="toggleCart" />

  </div>
</template>

<script setup>
import homeIcon from '@/assets/icons/icons8-home-50.png'
import giftIcon from '@/assets/icons/gift.svg'
import bagIcon from '@/assets/icons/shopping-bag.svg'
import cartIcon from '@/assets/icons/shopping-cart.svg'
import userIcon from '@/assets/icons/circle-user-round.svg'
import { supabase } from "@/lib/supabase";
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Cart from "../components/cart.vue";
import { useCartStore } from "@/components/cart.js";

const cartStore = useCartStore();
const router = useRouter();

const currentUser = ref(null);
const getUser = async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user;
};
onMounted(() => getUser());

const cartOpen = ref(false);
const toggleCart = () => cartOpen.value = !cartOpen.value;

// Scroll detection
const isScrolled = ref(false);
const handleScroll = () => { isScrolled.value = window.scrollY > 30; };
onMounted(() => window.addEventListener("scroll", handleScroll));
onBeforeUnmount(() => window.removeEventListener("scroll", handleScroll));

// ✅ Search functionality
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const mobileSearchOpen = ref(false);

const fetchSuggestions = async () => {
  if (searchQuery.value.trim().length === 0) {
    suggestions.value = [];
    return;
  }
  const { data, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .ilike('name', `%${searchQuery.value}%`)
    .limit(5);
  if (!error) suggestions.value = data;
};

const goToProduct = (id) => {
  showSuggestions.value = false;
  mobileSearchOpen.value = false;
  router.push(`/product/${id}`);
};

const goToSearchPage = () => {
  if (searchQuery.value.trim().length > 0) {
    router.push({ path: '/search', query: { q: searchQuery.value } });
    showSuggestions.value = false;
    mobileSearchOpen.value = false;
  }
};

const toggleMobileSearch = () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
};

// ✅ Close on outside tap
const handleOutsideClick = (e) => {
  const overlay = document.querySelector(".mobile-search-overlay");
  const icon = document.querySelector(".mobile-search-icon");
  if (mobileSearchOpen.value && overlay && !overlay.contains(e.target) && !icon.contains(e.target)) {
    mobileSearchOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleOutsideClick);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleOutsideClick);
});

// ✅ Disable scroll when mobile search open
watch(mobileSearchOpen, (isOpen) => {
  document.body.style.overflow = isOpen ? "hidden" : "auto";
});

// Navigation
const goOrders = () => router.push('/orders');
const goAccount = () => currentUser.value ? router.push('/account') : router.push('/signup');
const goHotDeals = () => router.push('/hot-deal');
const goHome = () => router.push('/');
</script>

<style scoped>
/* Fix Cart alignment */
.cart-li .cart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ---------------- Navbar Base ---------------- */
.navbarcontainer {
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: space-between;

  z-index: 1000;
  transition: all 0.4s ease;
}
.navbarcontainer.scrolled {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 20px rgba(142, 45, 226, 0.25);
}

/* ✅ Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
  position: relative;
  z-index: 10001;
  margin-left: 10%;
}
.logoimg img { width: 70px; height: 85%; }
.logoname { font-size: 30px; color: white; font-family: "Abril Fatface", serif; }

/* ✅ Search Bar (PC) */
.searchbar-container {
  position: relative;
  width: 40%;
  background: white;
  border-radius: 50px;
  display: flex;
  align-items: center;
  padding: 5px 15px;
}
.searchbar-container input {
  border: none;
  outline: none;
  width: 100%;
  padding: 10px 10px;
  font-size: 15px;
  border-radius: 50px;
  font-family: "Zalando Sans", sans-serif;
}
.search-icon {
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  border-radius: 50%;
  color: white;
  padding: 8px;
  cursor: pointer;
}

/* ✅ Suggestion Dropdown (PC) */
.suggestions-box {
  position: absolute;
  top: 55px;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  overflow: hidden;
  z-index: 9999;
}
.suggestions-box li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  gap: 10px;
}
.suggestions-box li:hover {
  background: rgba(142,45,226,0.1);
}
.suggestions-box img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
}

/* ---------------- Nav Links ---------------- */
.nav-links {
  list-style: none;
  display: flex;
  gap: 30px;
  align-items: center;
  margin-right: 5%;
}
.nav-links li {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}
.icon { width: 25px; height: 25px; margin-bottom: 5px; filter: brightness(0) invert(1); transition: all 0.3s ease; }
.icon-text { font-size: 14px; color: white; transition: all 0.3s ease; font-family: "Zalando Sans", sans-serif; font-weight: 500; }
.nav-links li:hover .icon, .nav-links li:hover .icon-text {
  color: #8E2DE2;
  filter: brightness(0) invert(32%) sepia(84%) saturate(2800%) hue-rotate(257deg) brightness(90%) contrast(95%);
}
.nav-links li:hover { background: rgba(142, 45, 226, 0.1); }

.bottom-bar{
  display: none;
}

/* ---------------- Mobile Version ---------------- */
@media (max-width: 768px) {
  .pc-only { display: none; }
  .nav-links { display: none !important; }

  .navbarcontainer {
    justify-content: center;
    padding: 0 10px;
    z-index: 10000;
    justify-content: space-between;
    align-items: center;
  }

  /* Mobile Search Icon */
  .mobile-search-icon {
    color: white;
    font-size: 25px;
    cursor: pointer;
    background: linear-gradient(90deg, #4A00E0, #8E2DE2);
    padding: 8px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10PX;
    z-index: 10001;
  }

  /* ✅ Mobile Search Overlay */
  .mobile-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.6);
    z-index: 10000;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow-y: auto;
    backdrop-filter: blur(4px);
  }

  .mobile-search-box {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border-radius: 50px;
    padding: 10px 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);


margin-right: 10%;
    margin-left: 5%;
  }

  .mobile-search-box input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 16px;
    padding: 10px 15px;
    border-radius: 50px;
    font-family: "Zalando Sans", sans-serif;

  }

  .close-icon {
    font-size: 22px;
    cursor: pointer;
    margin-left: 10px;
    color: #4A00E0;
    transition: 0.3s;
  }
  .close-icon:hover {
    color: #8E2DE2;
    transform: rotate(90deg);
  }

  .mobile-suggestions {
    width: 100%;
    background: white;
    border-radius: 10px;
    margin-top: 15px;
    overflow: hidden;
    box-shadow: 0 6px 15px rgba(0,0,0,0.2);
  }
  .mobile-suggestions li {
    display: flex;
    align-items: center;
    padding: 12px;
    gap: 10px;
    cursor: pointer;
    transition: background 0.3s;
  }
  .mobile-suggestions li:hover {
    background: rgba(142,45,226,0.1);
  }
  .mobile-suggestions img {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
  }

  /* Bottom Bar */
  .bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 8px 0;
    list-style: none;
    z-index: 10001;
    border-top: 1px solid rgba(142,45,226,0.3);
    box-shadow: 0 -3px 10px rgba(0,0,0,0.3);
  }
  .bottom-bar li {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    font-family: "Zalando Sans", sans-serif;
    font-size: 13px;
    cursor: pointer;
    position: relative;
  }
  .bottom-bar li img {
    width: 22px;
    height: 22px;
    margin-bottom: 4px;
    filter: brightness(0) invert(1);
    transition: all 0.3s ease;
  }
  .bottom-bar li span {
    color: white;
    font-weight: 500;
  }
  .bottom-bar li:hover img,
  .bottom-bar li:hover span {
    color: #8E2DE2;
    filter: brightness(0) invert(32%) sepia(84%) saturate(2800%)
      hue-rotate(257deg) brightness(90%) contrast(95%);
  }
  .cart-badge-mobile {
    position: absolute;
    top: 0px;
    right: 12px;
    background: red;
    color: white;
    font-size: 10px;
    border-radius: 50%;
    padding: 2px 6px;
  }
}
</style>
