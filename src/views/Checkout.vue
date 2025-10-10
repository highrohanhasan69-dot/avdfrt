<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">
  </head>

  <div>
    <!-- 🟣 Navbar Component -->
    <Navbar />

    <!-- 🟣 Checkout Page -->
    <div class="checkout-page">
      <h1 class="checkout-title">Checkout</h1>

      <div class="checkout-container">
        <!-- 🟣 Left: Order Items -->
        <div class="order-summary">
          <h2>Your Order</h2>

          <div v-if="cartStore.items.length">
            <div v-for="(item, i) in cartStore.items" :key="i" class="summary-item">
              <img :src="getImageUrl(item)" alt="Product Image" class="summary-img" />
              <div class="summary-details">
                <p class="name">{{ item.name }}</p>
                <p class="price">{{ item.price }}৳</p>
                <p v-if="item.selectedVariants?.length" class="variants">
                  <span v-for="(v, idx) in item.selectedVariants" :key="idx">
                    {{ v.variantName }}: {{ v.optionName }}
                  </span>
                </p>
                <p class="qty">Qty: {{ item.quantity }}</p>
              </div>
            </div>

            <p class="total">Total: {{ cartStore.totalPrice }}৳</p>
          </div>
          <div v-else class="empty">Your cart is empty.</div>
        </div>

        <!-- 🟣 Right: Checkout Form -->
        <form class="checkout-form" @submit.prevent="placeOrder">
          <h2>Billing Details</h2>

          <input v-model="customerName" placeholder="Full Name" required />
          <input v-model="customerPhone" placeholder="Phone" required />
          <input v-model="customerAddress" placeholder="Full Address" required />

          <h3>Payment Method</h3>
          <div class="payment-option">
            <label class="checkbox-label">
              <span>Cash on Delivery</span>
              <input
                type="checkbox"
                v-model="paymentMethod"
                true-value="Cash on Delivery"
                false-value=""
                checked
              />
            </label>
          </div>

          <button type="submit" :disabled="isPlacingOrder">
            {{ isPlacingOrder ? "Placing Order..." : "Confirm Order" }}
          </button>
        </form>
      </div>
    </div>

    <!-- 🟣 Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/cart.js";
import { supabase } from "@/lib/supabase";

// Components
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";

const cartStore = useCartStore();
const router = useRouter();

const customerName = ref("");
const customerPhone = ref("");
const customerAddress = ref("");
const paymentMethod = ref("Cash on Delivery");
const isPlacingOrder = ref(false);
const currentUser = ref(null);

onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user || null;
});

const getImageUrl = (item) => {
  if (item.image) return item.image;
  if (item.image_url) return item.image_url;
  if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
  return "https://via.placeholder.com/80x80?text=No+Image";
};

const placeOrder = async () => {
  if (cartStore.items.length === 0) return alert("Cart is empty!");

  // ✅ শুধু Name, Phone, Address validate
  if (!customerName.value || !customerPhone.value || !customerAddress.value)
    return alert("Please fill all details!");

  isPlacingOrder.value = true;

  try {
    let userId;
    if (currentUser.value) {
      userId = currentUser.value.id;
    } else {
      const email = `${customerPhone.value}@avado.com`;
      const password = customerPhone.value;

      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError && loginError.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: customerName.value, phone: customerPhone.value } },
        });
        if (signUpError) throw signUpError;

        const { error: loginError2 } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError2) throw loginError2;

        currentUser.value = signUpData.user;
        userId = currentUser.value.id;
      } else if (loginData.user) {
        currentUser.value = loginData.user;
        userId = currentUser.value.id;
      }
    }

    const orderData = {
      items: cartStore.items,
      total: cartStore.totalPrice,
      customer: {
        name: customerName.value,
        phone: customerPhone.value,
        address: customerAddress.value,
      },
      payment_method: paymentMethod.value,
      status: "Pending",
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("orders").insert(orderData);
    if (error) throw error;

    cartStore.clearCart();
    alert("Order placed successfully!");
    router.push("/orders");
  } catch (err) {
    console.error(err);
    alert("Failed to place order. Try again.");
  } finally {
    isPlacingOrder.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  font-family: "Zalando Sans";
  padding: 40px 10%;
  background: #f9f9ff;
  margin-top: 70px;
}

.checkout-title {
  text-align: center;
  color: #4a00e0;
  font-weight: 700;
  margin-bottom: 30px;
}

.checkout-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.order-summary {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.order-summary h2 {
  margin-bottom: 15px;
  color: #4a00e0;
  font-size: 18px;
}
.summary-item {
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #f0f0f0;
  padding: 10px 0;
}
.summary-img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}
.summary-details { flex: 1; }
.name { font-weight: 600; }
.price { color: #8E2DE2; font-size: 15px; }
.variants { font-size: 13px; color: #666; }
.qty { font-size: 13px; color: #444; }
.total {
  text-align: right;
  margin-top: 15px;
  font-weight: bold;
  color: #4A00E0;
}
.empty {
  text-align: center;
  color: #999;
  padding: 20px 0;
}

.checkout-form {
  flex: 1;
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.checkout-form h2 {
  color: #4A00E0;
  margin-bottom: 15px;
}
.checkout-form input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 10px;
  outline: none;
  transition: border 0.2s;
}
.checkout-form input:focus {
  border-color: #8E2DE2;
  box-shadow: 0 0 4px rgba(142,45,226,0.2);
}
.payment-option {
  margin: 15px 0;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  cursor: pointer;
  font-size: 15px;
  flex-direction: row-reverse;
}
.checkbox-label input[type="checkbox"] {
  accent-color: #8E2DE2;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

button[type="submit"] {
  width: 100%;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}
button[type="submit"]:hover {
  opacity: 0.9;
}

@media (max-width: 900px) {
  .checkout-container {
    flex-direction: column;
  }
}
</style>
