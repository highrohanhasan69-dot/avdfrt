<template>
  <div v-if="product">
    <img :src="product.image_url" alt="Product Image" />
    <h1>{{ product.name }}</h1>
    <p>{{ product.price }}৳</p>
    <p>{{ product.description }}</p>
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/lib/supabase";

const route = useRoute();
const product = ref(null); // Initially null

onMounted(async () => {
  const id = route.params.id;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log(error);
  } else {
    product.value = data; // set product after fetch
  }
});
</script>
