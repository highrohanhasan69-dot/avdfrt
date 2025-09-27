<template>
  <div class="checkout">
    <h1>Checkout</h1>

    <form @submit.prevent="placeOrder">
      <input v-model="customerName" placeholder="Full Name" required />
      <input v-model="customerPhone" placeholder="Phone" required />
      <input v-model="customerAddress" placeholder="Address" required />

      <h3>Order Summary</h3>
      <ul>
        <li v-for="(item,i) in cartStore.items" :key="i">
          {{ item.name }} - {{ item.price }}৳
        </li>
      </ul>
      <p>Total: {{ cartStore.totalPrice }}৳</p>

      <button type="submit" :disabled="isPlacingOrder">
        {{ isPlacingOrder ? "Placing Order..." : "Confirm Order" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/cart.js";
import { supabase } from "@/lib/supabase";

const cartStore = useCartStore();
const router = useRouter();

const customerName = ref("");
const customerPhone = ref("");
const customerAddress = ref("");
const isPlacingOrder = ref(false);

const currentUser = ref(null);

// onMounted: check if someone already logged in
onMounted(async () => {
  const { data } = await supabase.auth.getUser();
  currentUser.value = data.user || null;
});

const placeOrder = async () => {
  if (cartStore.items.length === 0) {
    alert("Cart is empty!");
    return;
  }
  if (!customerPhone.value || !customerName.value || !customerAddress.value) {
    alert("Please fill all details!");
    return;
  }

  isPlacingOrder.value = true;

  try {
    let userId;

    if (currentUser.value) {
      // Logged-in user → use existing account
      userId = currentUser.value.id;
    } else {
      // Check if phone number already registered
      const email = `${customerPhone.value}@avado.com`;
      const password = customerPhone.value;

      // Try login first
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError && loginError.message.includes("Invalid login credentials")) {
        // Phone number not registered → create new user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: customerName.value,
              phone: customerPhone.value,
            },
          },
        });

        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("User creation failed");

        // Auto login new user
        const { error: loginError2 } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError2) throw loginError2;

        currentUser.value = signUpData.user;
        userId = currentUser.value.id;
      } else if (loginData.user) {
        // Phone number already registered → auto login
        currentUser.value = loginData.user;
        userId = currentUser.value.id;
      } else {
        throw new Error("Failed to login or create account");
      }
    }

    // Create order
    const orderData = {
      items: cartStore.items,
      total: cartStore.totalPrice,
      customer: {
        name: customerName.value,
        phone: customerPhone.value,
        address: customerAddress.value,
      },
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const { error: orderError } = await supabase.from("orders").insert(orderData);
    if (orderError) throw orderError;

    // Clear cart
    cartStore.clearCart();

    alert("Order placed successfully!");
    router.push("/orders");
  } catch (err) {
    console.error("Order failed:", err.message);
    alert("Failed to place order. Try again.");
  } finally {
    isPlacingOrder.value = false;
  }
};
</script>
