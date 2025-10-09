<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
      rel="stylesheet"
    />
  </head>

  <div class="product-card" @click="goToProductPage">
    <div class="image-box">
      <img :src="product.image_url || placeholder" :alt="product.name" />
      <div v-if="product.discount_percent" class="discount-badge">
        -{{ product.discount_percent }}%
      </div>
    </div>

    <h2 class="product-name">{{ product.name }}</h2>

    <div class="price-section">
      <template v-if="product.discount_percent">
        <span class="discounted-price">
          {{
            (product.price - (product.price * product.discount_percent) / 100).toFixed(2)
          }}৳
        </span>
        <span class="original-price">{{ product.price }}৳</span>
      </template>
      <template v-else>
        <span class="product-price">{{ product.price }}৳</span>
      </template>
    </div>

    <div class="button-group">
      <button class="btn" @click.stop="addToCart(product)">Add to cart</button>
      <button class="btn buy-now" @click.stop="buyNow(product)">Buy Now</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/components/cart.js";

const props = defineProps({
  product: Object,
});
const cartStore = useCartStore();
const router = useRouter();

const placeholder = ref("https://via.placeholder.com/240x168.png?text=No+Image");

const goToProductPage = () => {
  if (props.product.id) router.push(`/product/${props.product.id}`);
};

// ✅ এখানে discount থাকলে discounted price হিসাব করে cart এ পাঠানো হবে
const getFinalPrice = (product) => {
  if (product.discount_percent) {
    return (product.price - (product.price * product.discount_percent) / 100).toFixed(2);
  }
  return product.price;
};

const addToCart = (product) => {
  const finalPrice = getFinalPrice(product);
  cartStore.addItem({ ...product, price: finalPrice });
};

const buyNow = (product) => {
  const finalPrice = getFinalPrice(product);
  cartStore.addItem({ ...product, price: finalPrice });
  router.push("/checkout");
};
</script>

<style scoped>
.product-card {
  font-family: "Zalando Sans";
  width: 260px;
  height: 380px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 16px rgba(74, 0, 224, 0.15);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  padding: 12px;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(142, 45, 226, 0.25);
}

.image-box {
  height: 65%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .image-box img {
  transform: scale(1.05);
}

/* 🔥 Discount Badge */
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff4d4d, #ff9900);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #4a00e0;
  text-align: center;
  margin: 10px 0 4px;
  line-height: 1.3;
}

/* ✅ Price Section */
.price-section {
  text-align: center;
  margin-bottom: 8px;
}

.discounted-price {
  font-size: 16px;
  font-weight: bold;
  color: #e67e22;
  margin-right: 6px;
}

.original-price {
  font-size: 14px;
  color: #888;
  text-decoration: line-through;
}

.product-price {
  font-size: 15px;
  font-weight: bold;
  color: #e67e22;
  margin-bottom: 8px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: auto;
  width: 100%;
  justify-content: center;
}

.btn {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(to right, #a100ff, #ff00ff);
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 3px 10px rgba(142, 45, 226, 0.3);
}

.btn:hover {
  background: linear-gradient(135deg, #5f18e2, #9b3ce6);
  box-shadow: 0 6px 14px rgba(142, 45, 226, 0.4);
}

.buy-now {
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
}
/* Desktop layout আগের মতো রাখা হয়েছে */

/* -------------------------
   Mobile Responsive
--------------------------*/

/* Tablet view (<=1024px) */
@media (max-width: 1024px) {
  .product-card {
    width: 220px;
    height: 340px;
    padding: 10px;

  }

  .image-box {
    height: 60%;
  }

  .product-name {
    font-size: 15px;
  }

  .discounted-price, .product-price {
    font-size: 14px;
  }

  .original-price {
    font-size: 12px;
  }

  .btn {
    font-size: 12px;
    padding: 6px 0;
  }
}

/* Mobile view (<=768px) */
@media (max-width: 768px) {
  .product-card {
    width: 45%; /* দুই card per row */
    height: auto;
    padding: 8px;

  }

  .image-box {
    height: 120px;
  }

  .product-name {
    font-size: 14px;
  }

  .discounted-price, .product-price {
    font-size: 13px;
  }

  .original-price {
    font-size: 11px;
  }

  .btn {
    font-size: 11px;
    padding: 5px 0;
  }
}

/* Extra small phones (<=480px) */
@media (max-width: 480px) {
  .product-card {
    width: 90%; /* এক card per row */
    height: auto;
    padding: 6px;
    margin: 6px auto;
  }

  .image-box {
    height: 100px;
  }

  .product-name {
    font-size: 13px;
  }

  .discounted-price, .product-price {
    font-size: 12px;
  }

  .original-price {
    font-size: 10px;
  }

  .btn {
    font-size: 10px;
    padding: 4px 0;
  }
}

</style>
