 <template>
  <head><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet"></head>
  <div class="product-manager">
    <h2>Add Product</h2>

    <form @submit.prevent="addProduct" class="product-form">
      <!-- Basic Info -->
      <div class="form-group">
        <input v-model="product.name" placeholder="Product Name" required />
      </div>
      <div class="form-group">
        <input v-model.number="product.price" type="number" placeholder="Price" required />
      </div>
      <div class="form-group">
        <textarea v-model="product.description" placeholder="Description"></textarea>
      </div>
      <div class="form-group">
        <input v-model="product.category_slug" placeholder="Category Slug" />
      </div>

      <!-- Primary Image Upload -->
      <div class="form-group">
        <label>Primary Image:</label>
        <input type="file" @change="uploadImage($event, 'image_url')" />
      </div>

      <!-- Secondary Image Upload -->
      <div class="form-group">
        <label>Secondary Image:</label>
        <input type="file" @change="uploadImage($event, 'secondary_image_url')" />
      </div>

      <!-- Flags -->
      <div class="form-group checkbox-group">
        <label>
          <input type="checkbox" v-model="product.is_top_product" /> Top Product
        </label>
        <label>
          <input type="checkbox" v-model="product.is_hot_deal" /> Hot Deal
        </label>
      </div>

      <!-- Discount -->
      <div class="form-group discount-group">
        <input v-model.number="product.discount_percent" type="number" placeholder="Discount (%)" />
        <input v-model="product.offer_end_date" type="datetime-local" />
      </div>

      <!-- Variants -->
      <div v-for="(variant, vIndex) in variants" :key="vIndex" class="variant-box">
        <h3>{{ variant.level === 1 ? 'Primary Variant' : 'Secondary Variant' }}</h3>
        <div class="form-group">
          <input v-model="variant.name" placeholder="Variant Name" />
        </div>

        <!-- Variant Options -->
        <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="option-box">
          <div class="form-group">
            <input v-model="option.option_name" placeholder="Option Name" />
            <input v-model.number="option.option_price" type="number" placeholder="Option Price" />
            <input type="file" @change="uploadOptionImage($event, vIndex, oIndex)" />
            <span v-if="option.option_image_url" class="uploaded">Uploaded ✅</span>
          </div>
        </div>

        <button type="button" class="btn-secondary" @click="addOption(vIndex)">+ Add Option</button>
      </div>

      <div class="variant-buttons">
        <button type="button" class="btn-primary" @click="addVariant(1)">+ Add Primary Variant</button>
        <button type="button" class="btn-primary" @click="addVariant(2)">+ Add Secondary Variant</button>
      </div>

      <button type="submit" class="btn-submit">Save Product</button>
    </form>
  </div>
</template>

<script>
import { supabase } from "@/lib/supabase";

export default {
  name: "ProductManager",
  data() {
    return {
      product: {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      },
      variants: [],
    };
  },
  methods: {
    async uploadImage(event, field) {
      const file = event.target.files[0];
      if (!file) return;

      const { data, error } = await supabase.storage
        .from("banners")
        .upload(`products/${Date.now()}-${file.name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("banners")
        .getPublicUrl(data.path);

      this.product[field] = publicUrl.publicUrl;
    },

    async uploadOptionImage(event, vIndex, oIndex) {
      const file = event.target.files[0];
      if (!file) return;

      const { data, error } = await supabase.storage
        .from("banners")
        .upload(`variants/${Date.now()}-${file.name}`, file);

      if (error) {
        console.error(error);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("banners")
        .getPublicUrl(data.path);

      this.variants[vIndex].options[oIndex].option_image_url = publicUrl.publicUrl;
    },

    addVariant(level) {
      this.variants.push({
        level,
        name: "",
        options: [],
      });
    },

    addOption(vIndex) {
      this.variants[vIndex].options.push({
        option_name: "",
        option_price: null,
        option_image_url: "",
      });
    },

    async addProduct() {
      try {
        // 1. insert product
        const { data: productData, error: productError } = await supabase
          .from("products")
          .insert([this.product])
          .select()
          .single();

        if (productError) throw productError;

        // 2. insert variants
        for (const variant of this.variants) {
          const { data: variantData, error: variantError } = await supabase
            .from("product_variants")
            .insert([
              {
                product_id: productData.id,
                variant_level: variant.level,
                name: variant.name,
              },
            ])
            .select()
            .single();

          if (variantError) throw variantError;

          // 3. insert variant options
          for (const option of variant.options) {
            await supabase.from("product_variant_options").insert([
              {
                variant_id: variantData.id,
                option_name: option.option_name,
                option_price: option.option_price,
                option_image_url: option.option_image_url,
              },
            ]);
          }
        }

        alert("✅ Product saved successfully!");
        this.resetForm();
      } catch (err) {
        console.error(err);
        alert("❌ Error saving product");
      }
    },

    resetForm() {
      this.product = {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      };
      this.variants = [];
    },
  },
};
</script>

<style>
/* Container */
.product-manager {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
}

/* Headings */
.product-manager h2 {
  text-align: center;
  color: #4A00E0;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
}

/* Form Groups */
.product-form .form-group {
  margin-bottom: 15px;
}

.product-form input,
.product-form textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: 0.3s;
}

.product-form input:focus,
.product-form textarea:focus {
  border-color: #8E2DE2;
  outline: none;
}

/* Checkboxes */
.checkbox-group {
  display: flex;
  gap: 20px;
  align-items: center;
}

/* Discount group */
.discount-group {
  display: flex;
  gap: 15px;
}

/* Variant & Option Boxes */
.variant-box, .option-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  background: #f9f9f9;
}

.variant-box h3 {
  color: #4A00E0;
  margin-bottom: 10px;
}

/* Uploaded label */
.uploaded {
  color: green;
  font-weight: 500;
  margin-left: 10px;
}

/* Buttons */
button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  transition: 0.3s;
}

.btn-primary {
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  color: #fff;
  margin-right: 10px;
}

.btn-primary:hover {
  opacity: 0.9;
}

.btn-secondary {
  background: #eee;
  color: #333;
  margin-top: 10px;
}

.btn-secondary:hover {
  background: #ddd;
}

.btn-submit {
  display: block;
  width: 100%;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 25px;
}

.btn-submit:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 600px) {
  .discount-group {
    flex-direction: column;
  }

  .checkbox-group {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
