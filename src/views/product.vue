<template>
  <div>
    <!-- ================= Navbar ================= -->
    <Navbar />

    <!-- ================= Main Product Details ================= -->
    <div class="product-page">
      <div class="product-wrapper">
        <div class="product-container">
          <!-- Left: Main Image -->
          <div class="image-container">
            <img :src="displayImage" alt="Product Image" class="main-image" />

            <!-- Thumbnails -->
            <div class="thumbnail-container">
              <!-- product main image -->
              <img
                v-if="product.image_url"
                :src="product.image_url"
                alt="Main"
                class="thumb"
                @click="displayImageOverride = product.image_url"
              />

              <!-- product secondary images -->
              <img
                v-for="(img, idx) in product.secondary_images || []"
                :key="'sec-' + idx"
                :src="img"
                alt="Secondary"
                class="thumb"
                @click="displayImageOverride = img"
              />

              <!-- variant option images -->
              <template v-for="variant in variants" :key="'var-' + variant.id">
                <template v-for="opt in (variant.options || [])" :key="'opt-' + opt.id">
                  <img
                    v-if="opt.option_image_url"
                    :src="opt.option_image_url"
                    alt="Option Image"
                    class="thumb"
                    @click="displayImageOverride = opt.option_image_url"
                  />
                </template>
              </template>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="details-container">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-description">{{ product.description }}</p>

            <!-- Price with Discount -->
            <p class="price">
              <span v-if="product.discount_percent">
                <span class="original-price">{{ displayPriceOriginal }}৳</span>
                <span class="discounted-price">{{ displayPriceDiscounted }}৳</span>
              </span>
              <span v-else>
                {{ displayPriceDiscounted }}৳
              </span>
            </p>

            <!-- Variant Selectors -->
            <div v-for="variant in variants" :key="variant.id" class="variant-selector">
              <label class="variant-label">{{ variant.name }}</label>
              <select v-model="selectedOptions[variant.id]" @change="updateDisplay" class="variant-select">
                <option value="">-- Select {{ variant.name }} --</option>
                <option v-for="opt in (variant.options || [])" :key="opt.id" :value="opt.id">
                  {{ opt.option_name }} {{ opt.option_price ? `( +${opt.option_price}৳ )` : '' }}
                </option>
              </select>
            </div>

            <!-- Quantity -->
            <div class="quantity-box">
              <label>Quantity:</label>
              <input type="number" v-model.number="quantity" min="1" class="quantity-input" />
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button @click="addToCart" class="btn">Add to Cart</button>
              <button @click="buyNow" class="btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= Related Products ================= -->
    <div v-if="relatedProducts.length" class="related-products-page">
      <h2 class="section-title">Related Products</h2>
      <div class="related-products-container">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>

    <!-- ================= Footer ================= -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { supabase } from '@/lib/supabase';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '@/components/cart.js';
import ProductCard from '@/components/ProductCard.vue';
import Navbar from "@/components/NavBar.vue";
import Footer from '@/components/Footer.vue';

const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const productId = ref(route.params.id);
const product = ref({});
const variants = ref([]);
const selectedOptions = ref({});
const quantity = ref(1);
const displayImageOverride = ref(null);
const relatedProducts = ref([]);

// --- Display Image ---
const displayImage = computed(() => {
  if (displayImageOverride.value) return displayImageOverride.value;
  for (let v of variants.value) {
    const optId = selectedOptions.value[v.id];
    if (!optId) continue;
    const opt = (v.options || []).find(o => o.id === optId);
    if (opt?.option_image_url) return opt.option_image_url;
  }
  return product.value.image_url || '/images/no-image.png';
});

// --- Display Price ---
const displayPriceOriginal = computed(() => {
  let price = Number(product.value.price || 0);
  for (let v of variants.value) {
    const optId = selectedOptions.value[v.id];
    if (!optId) continue;
    const opt = (v.options || []).find(o => o.id === optId);
    if (opt?.option_price) price += Number(opt.option_price);
  }
  return price.toFixed(2);
});

const displayPriceDiscounted = computed(() => {
  let original = Number(displayPriceOriginal.value);
  if (product.value.discount_percent) {
    const discount = original * Number(product.value.discount_percent) / 100;
    return (original - discount).toFixed(2);
  }
  return original.toFixed(2);
});

const fetchProduct = async () => {
  if (!productId.value) return;
  const { data: pData } = await supabase.from('products').select('*').eq('id', productId.value).single();
  product.value = pData;
  const { data: vData } = await supabase
    .from('product_variants')
    .select(`id,name,variant_level,product_variant_options(id,option_name,option_price,option_image_url)`)
    .eq('product_id', productId.value);
  variants.value = (vData || []).map(v => ({
    id: v.id,
    name: v.name,
    level: v.variant_level,
    options: Array.isArray(v.product_variant_options) ? v.product_variant_options : []
  }));
  variants.value.forEach(v => { selectedOptions.value[v.id] = ""; });
  displayImageOverride.value = null;
  if (product.value.category_slug) {
    const { data: relatedData } = await supabase
      .from('products')
      .select('*')
      .eq('category_slug', product.value.category_slug)
      .neq('id', product.value.id)
      .limit(8);
    relatedProducts.value = relatedData || [];
  }
};
onMounted(fetchProduct);
watch(() => route.params.id, (newId) => { productId.value = newId; fetchProduct(); });
const getSelectedVariantDetails = () => {
  let chosen = [];
  variants.value.forEach(v => {
    const optId = selectedOptions.value[v.id];
    if (optId) {
      const opt = (v.options || []).find(o => o.id === optId);
      if (opt) {
        chosen.push({
          variantId: v.id,
          variantName: v.name,
          optionId: opt.id,
          optionName: opt.option_name,
          extraPrice: opt.option_price || 0,
        });
      }
    }
  });
  return chosen;
};
const addToCart = () => {
  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    image: displayImage.value,
    price: Number(displayPriceDiscounted.value),
    selectedVariants: getSelectedVariantDetails(),
    quantity: quantity.value
  });
};
const buyNow = () => { addToCart(); router.push("/checkout"); };
const updateDisplay = () => { displayImageOverride.value = null; };
</script>

<style scoped>
/* ======== Default Desktop Design (unchanged) ======== */
.quantity-box { margin: 15px 0; display: flex; align-items: center; gap: 10px; }
.quantity-input { width: 60px; padding: 5px; border-radius: 6px; border: 1px solid #ccc; text-align: center; }

.product-page { max-width: 80%; margin-top: 100px; margin-left: 10%; margin-right: 10%; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.product-wrapper { margin-left: 10%; margin-right: 10%; }
.product-container { display: flex; flex-wrap: wrap; gap: 30px; }
.image-container { flex: 1 1 45%; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.main-image { width: 100%; max-height: 450px; object-fit: contain; border-radius: 8px; border: 1px solid #ddd; transition: transform 0.3s ease; }
.main-image:hover { transform: scale(1.02); }
.thumbnail-container { margin-top: 15px; display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.thumb { width: 60px; height: 60px; object-fit: cover; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; transition: transform 0.2s ease; }
.thumb:hover { transform: scale(1.1); }

.details-container { flex: 1 1 50%; display: flex; flex-direction: column; }
.product-title { font-size: 2em; font-weight: 700; margin-bottom: 10px; color: #4A00E0; }
.product-description { font-size: 1em; color: #555; margin-bottom: 20px; line-height: 1.5; }

.price { font-weight: 700; font-size: 1.5em; margin-bottom: 20px; }
.original-price { text-decoration: line-through; color: #888; margin-right: 10px; font-size: 1.2em; }
.discounted-price { color: #E53935; font-weight: 700; font-size: 1.5em; }

.variant-selector { margin: 15px 0; display: flex; flex-direction: column; }
.variant-label { margin-bottom: 5px; font-weight: 600; color: #333; }
.variant-select { padding: 8px 12px; border-radius: 6px; border: 1px solid #ccc; font-size: 1em; outline: none; transition: border 0.2s ease; }
.variant-select:focus { border-color: #4A00E0; }
.button-group { display: flex; gap: 15px; margin-top: 25px; }
.btn { flex: 1; padding: 12px 20px; background: linear-gradient(to right, #a100ff, #ff00ff); color: #fff; font-weight: 700; font-size: 1em; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s ease, transform 0.2s ease; }
.btn:hover { background: linear-gradient(to right, #8800cc, #cc00cc); transform: translateY(-2px); }

.related-products-page { max-width: 90%; margin: 50px auto; padding: 20px; background: #f9f9f9; border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.05); }
.section-title { font-size: 1.8em; font-weight: 700; color: #4A00E0; margin-bottom: 20px; text-align: center; }

/* === Desktop related products grid === */
.related-products-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
}

/* ======== Mobile Version (Improved) ======== */
@media (max-width: 768px) {
  .product-page {
    margin-right: 5%;
    margin-left: 5%;
    margin-top: 90px;
    padding: 15px;
    box-shadow: 0 4px 10px rgba(74, 0, 224, 0.15);
    border-radius: 16px;
  }

  .product-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* Price styling fix for mobile */
  .price {
    font-size: 1.3em;
    margin-bottom: 15px;
  }

  .original-price {
    display: inline-block;
    text-decoration: line-through;
    color: #999;
    margin-right: 6px;
    font-size: 1em;
  }

  .discounted-price {
    display: inline-block;
    font-size: 1.4em;
    font-weight: 800;
    background: linear-gradient(90deg, #4A00E0, #8E2DE2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .image-container {
    width: 100%;
  }

  .main-image {
    max-height: 320px;
    border-radius: 10px;
    border: 2px solid #eee;
    box-shadow: 0 0 10px rgba(142, 45, 226, 0.1);
  }

  .thumbnail-container {
    margin-top: 10px;
    gap: 6px;
  }

  .thumb {
    width: 55px;
    height: 55px;
    border-radius: 8px;
  }

  .details-container {
    width: 100%;
    margin-top: 20px;
    background: linear-gradient(to bottom, #ffffff, #faf5ff);
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 0 8px rgba(138, 43, 226, 0.1);
  }

  .product-title {
    font-size: 1.6em;
    color: #4A00E0;
    font-weight: 700;
  }

  .product-description {
    font-size: 0.95em;
    color: #555;
    margin-bottom: 12px;
  }

  .button-group {
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    background: linear-gradient(90deg, #4A00E0, #8E2DE2);
    border-radius: 10px;
    padding: 14px;
    font-size: 1.1em;
    box-shadow: 0 3px 8px rgba(74, 0, 224, 0.3);
  }

  .btn:active {
    transform: scale(0.97);
  }

  .related-products-page {
    background: #fff;
    box-shadow: 0 0 10px rgba(74, 0, 224, 0.1);
    border-radius: 16px;
  }

  .section-title {
    font-size: 1.4em;
    background: linear-gradient(90deg, #4A00E0, #8E2DE2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* === Mobile related products: 2 per row, max 3 rows === */
  .related-products-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    justify-items: center;
  }

  /* Limit total rows to 3 (6 items max) */
  .related-products-container > *:nth-child(n+7) {
    display: none;
  }
}

</style>
