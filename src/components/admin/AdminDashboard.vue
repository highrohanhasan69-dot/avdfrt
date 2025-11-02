<template>
  <div class="admin-dashboard">
    <h1 class="title">📊 Dashboard Overview</h1>

    <!-- ===== Top Summary Cards ===== -->
    <div class="cards-grid">
      <div v-for="card in cards" :key="card.title" class="card">
        <div class="card-icon">
          <i :class="card.icon"></i>
        </div>
        <div class="card-info">
          <h3>{{ card.title }}</h3>
          <p>{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- ===== Sales Chart ===== -->
    <div class="chart-container">
      <h2>📈 Monthly Sales</h2>
      <canvas id="salesChart"></canvas>
    </div>

    <!-- ===== Recent Orders ===== -->
    <div class="recent-orders">
      <h2>🧾 Recent Orders</h2>
      <div v-if="recentOrders.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o.id">
              <td>#{{ o.id.slice(0, 6) }}</td>
              <td>{{ o.customer?.name || "Guest" }}</td>
              <td>
                <span :class="['status', o.status]">{{ o.status }}</span>
              </td>
              <td>৳{{ o.total }}</td>
              <td>{{ formatDate(o.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty">No recent orders found</div>
    </div>

    <!-- ===== Top Products ===== -->
    <div class="top-products">
      <h2>🏆 Top Selling Products</h2>
      <div v-if="topProducts.length" class="product-list">
        <div v-for="p in topProducts" :key="p.id" class="product-item">
          <img :src="p.image_url" alt="" />
          <div class="info">
            <p class="name">{{ p.name }}</p>
            <p class="sales">Sold: {{ p.sold_count }}</p>
            <p class="revenue">৳{{ p.revenue }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty">No top products found</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

const cards = ref([
  { title: "Total Orders", value: 0, icon: "fas fa-shopping-bag" },
  { title: "Pending Orders", value: 0, icon: "fas fa-hourglass-half" },
  { title: "Delivered Orders", value: 0, icon: "fas fa-truck" },
  { title: "Total Revenue", value: "৳0", icon: "fas fa-sack-dollar" },
  { title: "Profit", value: "৳0", icon: "fas fa-coins" },
]);

const recentOrders = ref([]);
const topProducts = ref([]);
const monthlySales = ref([]);

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

// ==================== Fetch Dashboard Data ====================
const fetchDashboard = async () => {
  try {
    const res = await axios.get("/stats/overview");
    const data = res.data;

    // Update summary cards
    cards.value[0].value = data.totalOrders;
    cards.value[1].value = data.pendingOrders;
    cards.value[2].value = data.deliveredOrders;
    cards.value[3].value = `৳${data.totalRevenue}`;
    cards.value[4].value = `৳${data.totalProfit}`;

    recentOrders.value = data.recentOrders || [];
    topProducts.value = data.topProducts || [];
    monthlySales.value = data.monthlySales || [];

    drawChart();
  } catch (err) {
    console.error("❌ Dashboard fetch error:", err);
  }
};

// ==================== Draw Chart ====================
const drawChart = () => {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  const chartData = monthlySales.value.map((m) => m.total);
  const labels = monthlySales.value.map((m) => m.month);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Sales (৳)",
          data: chartData,
          borderColor: "#8e2de2",
          backgroundColor: "rgba(142, 45, 226, 0.15)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    },
  });
};

onMounted(fetchDashboard);
</script>

<style scoped>
.admin-dashboard {
  width: 92%;
  max-width: 1200px;
  margin: 80px auto;
  font-family: "Zalando Sans", sans-serif;
  color: #333;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== Cards Grid ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 40px;
}
.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-left: 5px solid #8e2de2;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(142, 45, 226, 0.2);
}
.card-icon {
  font-size: 30px;
  color: #8e2de2;
  margin-right: 16px;
}
.card-info h3 {
  font-size: 15px;
  color: #666;
}
.card-info p {
  font-size: 22px;
  font-weight: 700;
  color: #333;
}

/* ===== Chart ===== */
.chart-container {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
.chart-container h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #4a00e0;
}

/* ===== Recent Orders ===== */
.recent-orders {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
.recent-orders h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #4a00e0;
}
.table-wrapper {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
thead {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
}
th,
td {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.status {
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  text-transform: capitalize;
}
.status.pending {
  background: #fff7e6;
  color: #e6a100;
}
.status.delivered {
  background: #e6ffed;
  color: #0b8e00;
}
.status.processing {
  background: #e8e6ff;
  color: #4a00e0;
}

/* ===== Top Products ===== */
.top-products {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 40px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}
.top-products h2 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #4a00e0;
}
.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}
.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #faf9ff;
  padding: 10px 12px;
  border-radius: 12px;
  transition: all 0.3s;
}
.product-item:hover {
  background: #f4edff;
  box-shadow: 0 3px 10px rgba(142, 45, 226, 0.15);
}
.product-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
}
.product-item .info {
  display: flex;
  flex-direction: column;
}
.product-item .name {
  font-weight: 600;
  color: #333;
}
.product-item .sales {
  font-size: 13px;
  color: #555;
}
.product-item .revenue {
  font-size: 13px;
  color: #8e2de2;
  font-weight: 700;
}

.empty {
  text-align: center;
  color: #777;
  padding: 20px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    width: 95%;
    margin-top: 60px;
  }
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
