<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
      rel="stylesheet"
    />
  </head>

  <div>
    <!-- Navbar -->
    <Navbar />

    <div class="orders">
      <h1>My Orders</h1>

      <!-- যদি লগইন না থাকে -->
      <div v-if="!currentUser" class="not-logged">
        <p>Please login first to see your orders.</p>
      </div>

      <!-- যদি লগইন থাকে -->
      <div v-else>
        <!-- ✅ Desktop Table View -->
        <table class="orders-table desktop-only" v-if="orders.length > 0">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Products</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in orders" :key="o.id">
              <td>#{{ o.id }}</td>
              <td>{{ formatDate(o.created_at) }}</td>
              <td>
                <ul class="product-list">
                  <li v-for="(p, idx) in o.items" :key="idx">
                    {{ p.name }} (x{{ p.quantity }})
                    <span v-if="p.discount_percent">
                      - {{ p.discount_percent }}% off
                    </span>
                  </li>
                </ul>
              </td>
              <td>{{ o.total }}৳</td>
              <td>{{ o.payment_method }}</td>
              <td>
                <span :class="['status', o.status.toLowerCase()]">
                  {{ o.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- ✅ Mobile Card View -->
        <div class="orders-mobile" v-if="orders.length > 0">
          <div class="order-card" v-for="o in orders" :key="o.id">
            <div class="order-header">
              <span class="order-id">#{{ o.id }}</span>
              <span class="order-date">{{ formatDate(o.created_at) }}</span>
            </div>

            <ul class="product-list">
              <li v-for="(p, idx) in o.items" :key="idx">
                {{ p.name }} (x{{ p.quantity }})
              </li>
            </ul>

            <div class="order-info">
              <p><strong>Total:</strong> {{ o.total }}৳</p>
              <p><strong>Payment:</strong> {{ o.payment_method }}</p>
              <p>
                <strong>Status:</strong>
                <span :class="['status', o.status.toLowerCase()]">
                  {{ o.status }}
                </span>
              </p>
            </div>
          </div>
        </div>

        <p v-else class="empty">No orders found.</p>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"
import Navbar from "@/components/Navbar.vue"
import Footer from "@/components/Footer.vue"

const orders = ref([])
const currentUser = ref(null)

function formatDate(datetime) {
  const d = new Date(datetime)
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  currentUser.value = user

  if (!user) return

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!error) {
    orders.value = data
  }
})
</script>

<style scoped>
.orders {
  font-family: "Zalando Sans";
  max-width: 1000px;
  margin: 30px auto;
  padding: 20px;
  margin-top: 60px;
}

h1 {
  font-size: 26px;
  margin-bottom: 20px;
  text-align: center;
  background: linear-gradient(45deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
}

.not-logged,
.empty {
  text-align: center;
  font-size: 16px;
  color: #777;
}

/* Desktop Table */
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.orders-table th,
.orders-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background: linear-gradient(45deg, #4a00e0, #8e2de2);
  color: #fff;
  font-weight: 600;
}

.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
 .orders-mobile{
  display: none;
 }
.product-list li {
  font-size: 14px;
  margin-bottom: 4px;
}

.status {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.processing {
  background: #cce5ff;
  color: #004085;
}

.status.delivered {
  background: #d4edda;
  color: #155724;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .orders {
    padding: 10px;
    margin: 15px auto;
  }

  h1 {
    font-size: 22px;
  }

  .orders-mobile {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .order-card {
    background: #fff;
    border-radius: 14px;
    padding: 15px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    border-left: 4px solid #8e2de2;
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    font-size: 15px;
    font-weight: 600;
    color: #4a00e0;
    margin-bottom: 10px;
  }

  .order-info {
    margin-top: 10px;
    font-size: 14px;
    color: #555;
  }

  .order-info p {
    margin: 4px 0;
  }

  .product-list li {
    font-size: 13px;
    color: #333;
  }

  .status {
    font-size: 13px;
    padding: 5px 8px;
  }
}
</style>
