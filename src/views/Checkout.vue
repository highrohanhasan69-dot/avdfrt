<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <div class="checkout-page">
      <h1 class="checkout-title">Checkout</h1>

      <div class="checkout-container">
        <!-- 🟣 Left: Order Summary -->
        <div class="order-summary">
          <h2>Your Cart</h2>

          <div v-if="cart.length">
            <div v-for="item in cart" :key="item.id" class="summary-item">
              <img :src="item.image_url" alt="Product Image" class="summary-img" />
              <div class="summary-details">
                <p class="summary-name">{{ item.name }}</p>

                <!-- ✅ Discount Price Logic -->
                <p class="summary-price">
                  <template v-if="item.discount_percent">
                    <span class="discounted">
                      ৳{{ discountedPrice(item).toFixed(2) }}
                    </span>
                    <span class="original">৳{{ item.price }}</span>
                  </template>
                  <template v-else>
                    ৳{{ item.price }}
                  </template>
                  × {{ item.quantity }}
                </p>
              </div>
            </div>

            <div class="total-section">
              <h3>Total: ৳{{ totalPrice }}</h3>
            </div>
          </div>

          <div v-else>
            <p>Your cart is empty.</p>
          </div>
        </div>

        <!-- 🟣 Right: Customer Details -->
        <div class="checkout-form">
          <h2>Customer Details</h2>

          <form @submit.prevent="placeOrder">
            <input
              v-model="customer.name"
              type="text"
              placeholder="Full Name"
              required
            />
            <input
              v-model="customer.phone"
              type="text"
              placeholder="Phone Number"
              required
            />
            <input
              v-model="customer.address"
              type="text"
              placeholder="Full Address"
              required
            />
            <input
              v-model="customer.district"
              type="text"
              placeholder="District (Optional)"
            />
            <input
              v-model="customer.upazila"
              type="text"
              placeholder="Upazila (Optional)"
            />
            <input
              v-model="customer.thana"
              type="text"
              placeholder="Thana (Optional)"
            />

            <label>Payment Method</label>
            <select v-model="paymentMethod">
              <option>Cash on Delivery</option>
              <option>Online Payment</option>
            </select>

            <button type="submit" class="checkout-btn">Confirm Order</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useCart } from "@/composables/useCart";

const { cart, fetchCart } = useCart();

const customer = ref({
  name: "",
  phone: "",
  address: "",
  district: "",
  upazila: "",
  thana: "",
});

const paymentMethod = ref("Cash on Delivery");

// ✅ Discounted Price Function
const discountedPrice = (item) => {
  const price = Number(item.price);
  const discount = Number(item.discount_percent || 0);
  if (!discount) return price;
  return price - (price * discount) / 100;
};

// ✅ Total Price (discount respected)
const totalPrice = computed(() =>
  cart.value.reduce(
    (sum, item) =>
      sum + discountedPrice(item) * (item.quantity || 1),
    0
  ).toFixed(2)
);

// ✅ Place Order Function
const placeOrder = async () => {
  try {
    if (!cart.value.length) {
      alert("Your cart is empty!");
      return;
    }

    const payload = {
      items: cart.value.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        price: discountedPrice(i).toFixed(2),
        image_url: i.image_url,
        discount_percent: i.discount_percent,
      })),
      total: totalPrice.value,
      customer: customer.value,
      payment_method: paymentMethod.value,
    };

    const res = await axios.post("http://localhost:5000/api/checkout", payload, {
      withCredentials: true,
    });

    if (res.data.success) {
      alert("✅ Order placed successfully!");
      customer.value = {
        name: "",
        phone: "",
        address: "",
        district: "",
        upazila: "",
        thana: "",
      };
      await fetchCart(); // clear cart
    } else {
      alert("❌ Failed to place order!");
    }
  } catch (err) {
    console.error("❌ Checkout failed:", err);
    alert("Checkout failed. Please try again!");
  }
};

onMounted(fetchCart);
</script>

<style scoped>
.checkout-page {
  margin: 100px auto;
  width: 85%;
  max-width: 1200px;
  font-family: "Zalando Sans", sans-serif;
}

.checkout-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
}

.checkout-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

/* 🟣 Order Summary */
.order-summary {
  flex: 1;
  min-width: 350px;
  background: #fff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(142, 45, 226, 0.1);
}

.summary-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.summary-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}
.summary-details {
  flex: 1;
}
.summary-name {
  font-weight: 600;
  color: #333;
}
.summary-price {
  font-size: 15px;
  color: #555;
}
.discounted {
  color: #e67e22;
  font-weight: 600;
}
.original {
  text-decoration: line-through;
  color: #999;
  font-size: 13px;
  margin-left: 6px;
}
.total-section {
  margin-top: 15px;
  text-align: right;
}
.total-section h3 {
  color: #4a00e0;
  font-size: 20px;
  font-weight: 700;
}

/* 🟣 Checkout Form */
.checkout-form {
  flex: 1;
  min-width: 350px;
  background: #fff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(142, 45, 226, 0.1);
}

.checkout-form h2 {
  margin-bottom: 20px;
  color: #4a00e0;
}

.checkout-form input,
.checkout-form select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.checkout-btn {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s;
}
.checkout-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

/* ✅ MOBILE RESPONSIVE DESIGN */
@media (max-width: 992px) {
  .checkout-page {
    width: 95%;
    margin: 60px auto;
  }

  .checkout-title {
    font-size: 26px;
    margin-bottom: 30px;
  }

  .checkout-container {
    flex-direction: column;
    gap: 25px;
  }

  .order-summary,
  .checkout-form {
    min-width: 100%;
    padding: 20px;
  }

  .summary-item {
    align-items: flex-start;
  }

  .summary-img {
    width: 65px;
    height: 65px;
  }

  .summary-details {
    margin-left: 8px;
  }

  .summary-name {
    font-size: 15px;
  }

  .summary-price {
    font-size: 14px;
  }

  .total-section h3 {
    font-size: 18px;
  }

  .checkout-form input,
  .checkout-form select {
    font-size: 13px;
    padding: 9px;
  }

  .checkout-btn {
    font-size: 15px;
    padding: 10px 0;
  }
}

/* ✅ SMALL MOBILE (≤600px) */
@media (max-width: 600px) {
  .checkout-page {
    width: 95%;
    margin: 40px auto;
  }

  .checkout-title {
    font-size: 22px;
  }

  .order-summary,
  .checkout-form {
    padding: 16px;
    border-radius: 12px;
  }

  .summary-img {
    width: 55px;
    height: 55px;
  }

  .summary-name {
    font-size: 14px;
  }

  .summary-price {
    font-size: 13px;
  }

  .checkout-form h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .checkout-form input,
  .checkout-form select {
    padding: 8px;
    font-size: 13px;
  }

  .checkout-btn {
    font-size: 14px;
    padding: 10px 0;
  }

  .total-section h3 {
    font-size: 17px;
  }
}

/* ✅ VERY SMALL SCREEN (≤400px) */
@media (max-width: 400px) {
  .checkout-page {
    width: 100%;
    margin: 20px auto;
  }

  .checkout-container {
    gap: 20px;
  }

  .checkout-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .summary-img {
    width: 50px;
    height: 50px;
  }

  .summary-name {
    font-size: 13px;
  }

  .summary-price {
    font-size: 12px;
  }

  .checkout-form input,
  .checkout-form select {
    font-size: 12px;
    padding: 7px;
  }

  .checkout-btn {
    font-size: 13px;
    padding: 9px 0;
  }
}

</style>
