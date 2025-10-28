<script>
export default {
  name: "ProductManager",
  data() {
    return {
      API_BASE:
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://avado-backend.onrender.com",
      categories: [],
      products: [],
      loading: false,
      editingId: null,
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
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await fetch(`${this.API_BASE}/categories`);
        this.categories = await res.json();
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    },

    async fetchProducts() {
      this.loading = true;
      try {
        const res = await fetch(`${this.API_BASE}/products`);
        this.products = await res.json();
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        this.loading = false;
      }
    },

    async uploadImage(event, field) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`${this.API_BASE}/products/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.product[field] = data.image_url;
      } catch (err) {
        console.error("Image upload error:", err);
      }
    },

    async uploadOptionImage(event, vIndex, oIndex) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`${this.API_BASE}/products/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.variants[vIndex].options[oIndex].option_image_url = data.image_url;
      } catch (err) {
        console.error("Option image upload error:", err);
      }
    },

    addVariant(level) {
      this.variants.push({ level, name: "", options: [] });
    },

    addOption(vIndex) {
      this.variants[vIndex].options.push({
        option_name: "",
        option_price: null,
        option_image_url: "",
      });
    },

    async addProduct() {
      const url = this.editingId
        ? `${this.API_BASE}/products/${this.editingId}`
        : `${this.API_BASE}/products`;
      const method = this.editingId ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...this.product,
            variants: this.variants,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert("❌ Error: " + (err.message || "Server error"));
          return;
        }

        alert(this.editingId ? "✅ Product updated!" : "✅ Product added!");
        this.resetForm();
        this.fetchProducts();
      } catch (err) {
        console.error("Add/Update error:", err);
      }
    },

    editProduct(prod) {
      this.product = { ...prod };
      this.editingId = prod.id;
      this.variants = prod.variants || [];
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    async deleteProduct(id) {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        const res = await fetch(`${this.API_BASE}/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("🗑️ Product deleted!");
          this.fetchProducts();
        } else {
          const err = await res.json();
          alert("❌ Delete failed: " + (err.message || "Server error"));
        }
      } catch (err) {
        console.error("Delete error:", err);
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
      this.editingId = null;
    },
  },
};
</script>


<style scoped>
.product-manager {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
}
h2 {
  text-align: center;
  color: #4a00e0;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
}
.product-form .form-group {
  margin-bottom: 15px;
}
input,
textarea,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
input:focus,
textarea:focus,
select:focus {
  border-color: #8e2de2;
  outline: none;
}
.checkbox-group {
  display: flex;
  gap: 20px;
  align-items: center;
}
.discount-group {
  display: flex;
  gap: 15px;
}
.variant-box,
.option-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  background: #f9f9f9;
}
.variant-box h3 {
  color: #4a00e0;
  margin-bottom: 10px;
}
.uploaded {
  color: green;
  font-weight: 500;
  margin-left: 10px;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  transition: 0.3s;
}
.btn-primary {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
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
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 25px;
}
.btn-submit:hover {
  opacity: 0.9;
}

/* Table */
.product-list {
  margin-top: 50px;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}
.btn-edit {
  background: #ffd700;
  color: #333;
  margin-right: 10px;
}
.btn-delete {
  background: #ff4d4d;
  color: white;
}
.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.8;
}
.loading,
.no-products {
  text-align: center;
  color: #777;
  margin-top: 20px;
}
</style>
