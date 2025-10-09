<template>
  <div>
    <h2>All Orders</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Date & Time</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>District</th>
          <th>Upazila</th>
          <th>Thana</th>
          <th>Payment</th>
          <th>Total</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.id }}</td>
          <!-- Date & Time -->
          <td>{{ formatDate(o.created_at) }}</td>
          <td>{{ o.customer.name }}</td>
          <td>{{ o.customer.phone }}</td>
          <td>{{ o.customer.address }}</td>
          <td>{{ o.customer.district }}</td>
          <td>{{ o.customer.upazila }}</td>
          <td>{{ o.customer.thana }}</td>
          <td>{{ o.payment_method }}</td>
          <td>{{ o.total }}৳</td>
          <td>
            <!-- Status dropdown -->
            <select v-model="o.status">
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
            </select>
          </td>
          <td>
            <button @click="updateStatus(o)">Update</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/lib/supabase";

// orders রাখার জন্য ref
const orders = ref([]);

// Date formatting function
function formatDate(datetime) {
  const d = new Date(datetime);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

// Supabase থেকে orders আনা
onMounted(async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (!error) orders.value = data;
});

// Order status update function
const updateStatus = async (order) => {
  const { error } = await supabase
    .from("orders")
    .update({ status: order.status })
    .eq("id", order.id);

  if (error) {
    alert("❌ Failed to update status!");
    console.error(error);
  } else {
    alert(`✅ Order #${order.id} updated to ${order.status}`);
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
th {
  background: #4A00E0;
  color: white;
}
select {
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  padding: 6px 12px;
  background: #8E2DE2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background: #4A00E0;
}
</style>
