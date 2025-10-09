import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import AdminPanel from './../views/AdminPanel.vue'
import CheckoutPage from './../views/Checkout.vue'
import OrdersPage from './../components/Orders.vue'
import LoginPage from './../views/Login.vue'
import SignupPage from '../views/Signup.vue'
import AccountPage from '@/views/Account.vue'
import ProductPage from "../views/product.vue"; // Product.vue এর page
import HotDeal from "../views/HotDeal.vue"; // Product.vue এর page
import TopProducts from "../views/TopProducts.vue";
import AllProducts from "../views/AllProducts.vue";
import Categories from '../views/categories.vue'
import SearchPage from '../views/SearchPage.vue'
const routes = [
  {
  path: '/search',
  name: 'SearchPage',
  component: () => import('../views/SearchPage.vue'),
}
,


  {
  path: "/terms-conditions",
  name: "TermsConditions",
  component: () => import("@/views/terms-conditions.vue"),
},
{
    path: '/categories',
    name: 'Categories',
    component: Categories,
  },
  {
  path: "/about-us",
  name: "AboutUs",
  component: () => import("@/views/about-us.vue"),
},
  {
  path: "/privacy-policy",
  name: "PrivacyPolicy",
  component: () => import("@/views/privacy-policy.vue"),
}
,
  {
  path: "/blog",
  name: "Blog",
  component: () => import("@/views/blog.vue"),
},
  {
  path: "/comingsoon",
  name: "ComingSoon",
  component: () => import("@/views/comingsoon.vue"),
},
  {
  path: "/return-refund-policy",
  name: "ReturnRefundPolicy",
  component: () => import("@/views/return-refund-policy.vue"),
},
  {
  path: "/delivery-policy",
  name: "DeliveryPolicy",
  component: () => import("../views/delivery-policy.vue"),
},
    {
    path: "/top-products",
    name: "TopProducts",
    component: TopProducts,
  },
  {
    path: "/all-products",
    name: "AllProducts",
    component: AllProducts,
  },
   { path: '/hot-deal', name: 'HotDeal', component: HotDeal }, // ✅ new route
   { path: "/products", component: ProductPage }, // <-- এখানে add করলাম
  { path: "/product/:id", component: ProductPage } ,// single product detail
    {
    path: '/account',
    name: 'Account',
    component: AccountPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: CategoryView,
    props: true
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
