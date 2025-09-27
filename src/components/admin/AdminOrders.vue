<template>
  <div>
    <h2>All Orders</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Customer</th><th>Total</th><th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ o.customer_name }}</td>
          <td>{{ o.total }}৳</td>
          <td>{{ o.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { supabase } from "@/lib/supabase"

const orders = ref([])

onMounted(async () => {
  const { data, error } = await supabase.from("orders").select("*")
  if (!error) orders.value = data
})
</script>
