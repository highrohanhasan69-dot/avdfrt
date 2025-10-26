<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";

const orders = ref([]);
const loading = ref(false);
const activeTab = ref("Pending");
const tabs = ["Pending", "Processing", "Delivered"];

const shortId = (id) => id.slice(0, 8);
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ✅ Fetch all orders
const fetchOrders = async () => {
  try {
    loading.value = true;
    const res = await axios.get("http://localhost:5000/api/checkout/admin/all");
    orders.value = (res.data.orders || []).map((o) => ({
      ...o,
      newStatus: o.status, // নতুন temporary status রাখছি
      items:
        typeof o.items === "string"
          ? JSON.parse(o.items)
          : o.items || [],
      customer:
        typeof o.customer === "string"
          ? JSON.parse(o.customer)
          : o.customer || {},
    }));
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
  } finally {
    loading.value = false;
  }
};

// ✅ Filter orders by active tab
const filteredOrders = computed(() =>
  orders.value
    .filter((o) => o.status?.toLowerCase() === activeTab.value.toLowerCase())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
);

// ✅ Update status function (click করলে)
const updateStatus = async (order) => {
  try {
    if (order.newStatus === order.status) {
      alert("⚠️ No change detected!");
      return;
    }

    await axios.put(
      `http://localhost:5000/api/checkout/admin/${order.id}/status`,
      { status: order.newStatus }
    );

    alert(`✅ Order ${shortId(order.id)} updated to ${order.newStatus}`);
    fetchOrders(); // update এর পর list refresh হবে
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    alert("Update failed. Please try again!");
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div class="admin-orders">
    <h1 class="title">📦 Manage Orders</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t"
        :class="['tab-btn', activeTab === t ? 'active' : '']"
        @click="activeTab = t"
      >
        {{ t }}
      </button>
    </div>

    <!-- Table -->
    <div class="table-container" v-if="filteredOrders.length && !loading">
      <table class="orders-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer Info</th>
            <th>Address</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(o, i) in filteredOrders" :key="i">
            <td>#{{ shortId(o.id) }}</td>
            <td>{{ formatDate(o.created_at) }}</td>
            <td>
              <div class="customer-info">
                <p><b>{{ o.customer.name }}</b></p>
                <p>📞 {{ o.customer.phone }}</p>
              </div>
            </td>
            <td>
              {{ o.customer.address }}
              <div v-if="o.customer.district" class="sub-addr">
                {{ o.customer.district }}, {{ o.customer.upazila }},
                {{ o.customer.thana }}
              </div>
            </td>
            <td>{{ o.payment_method }}</td>
            <td class="total">৳{{ o.total }}</td>
            <td>
              <select v-model="o.newStatus" class="status-select">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
              </select>
            </td>
            <td>
              <button class="update-btn" @click="updateStatus(o)">
                Update
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loader -->
    <div v-else-if="loading" class="loading">
      <p>Loading orders...</p>
    </div>

    <!-- Empty -->
    <div v-else class="empty">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty"
      />
      <p>No {{ activeTab }} orders found</p>
    </div>
  </div>
</template>

<style scoped>
.admin-orders {
  width: 95%;
  max-width: 1100px;
  margin: 90px auto;
  font-family: "Zalando Sans", sans-serif;
}

/* Title */
.title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: #eee;
  color: #444;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.tab-btn:hover {
  background: #ddd;
}
.tab-btn.active {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  box-shadow: 0 3px 10px rgba(142, 45, 226, 0.3);
}

/* Table */
.table-container {
  overflow-x: auto;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(142, 45, 226, 0.1);
}
.orders-table th,
.orders-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  text-align: center;
  font-size: 14px;
}
.orders-table th {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  font-weight: 700;
  text-transform: capitalize;
}
.customer-info p {
  margin: 0;
  line-height: 1.4;
}
.sub-addr {
  font-size: 12px;
  color: #777;
  margin-top: 2px;
}
.total {
  color: #4a00e0;
  font-weight: 800;
}
.status-select {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
.update-btn {
  padding: 6px 12px;
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 600;
}
.update-btn:hover {
  opacity: 0.9;
}

/* Loader */
.loading {
  text-align: center;
  font-size: 16px;
  color: #555;
  margin-top: 40px;
}

/* Empty */
.empty {
  text-align: center;
  margin-top: 60px;
  color: #777;
}
.empty img {
  width: 120px;
  opacity: 0.8;
  margin-bottom: 10px;
}

/* Responsive */
@media (max-width: 992px) {
  .orders-table th,
  .orders-table td {
    font-size: 13px;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .admin-orders {
    width: 96%;
    margin: 70px auto;
  }
  .tab-btn {
    padding: 8px 12px;
    font-size: 13px;
  }
  .orders-table {
    font-size: 12px;
  }
  .orders-table th {
    font-size: 13px;
  }
  .orders-table td {
    padding: 8px;
  }
}
</style>
