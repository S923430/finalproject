import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: { title: '首頁' },
  },
  {
    path: '/product',
    name: 'product',
    component: () => import('../views/ProductView.vue'),
    children: [
      {
        path: 'all',
        component: () => import('../views/ProductAll.vue'),
        meta: { title: '所有商品' },
      },
      {
        path: 'skateboard',
        component: () => import('../views/ProductSkateBoard.vue'),
        meta: { title: '滑板' },
      },
      {
        path: 'protectivegear',
        component: () => import('../views/ProductProtectiveGear.vue'),
        meta: { title: '護具' },
      },
      {
        path: 'skateshoes',
        component: () => import('../views/ProductSkateShoes.vue'),
        meta: { title: '滑板鞋' },
      },
      {
        path: 'accessories',
        component: () => import('../views/ProductAccessories.vue'),
        meta: { title: '配件' },
      },
    ],
  },
  {
    path: '/cart',
    component: () => import('../views/UserCart.vue'),
    meta: { title: '我的購物車' },
  },
  {
    path: '/product/:productId',
    component: () => import('../views/UserProducts.vue'),
    meta: { title: '商品詳情' },
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: () => import('../views/AboutPage.vue'),
    meta: { title: '關於我們' },
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: () => import('../views/LoginPage.vue'),
    meta: {
      layout: 'admin',
      title: '後台登入',
    },
  },
  {
    path: '/dashboard',
    name: 'DashBoard',
    component: () => import('../views/DashBoard.vue'),
    meta: {
      layout: 'admin',
      title: '後台首頁',
    },
    children: [
      {
        path: 'products',
        component: () => import('../views/ProductPage.vue'),
        meta: {
          layout: 'admin',
          title: '後台商品',
        },
      },
      {
        path: 'orders',
        component: () => import('../views/OrdersView.vue'),
        meta: {
          layout: 'admin',
          title: '後台訂單',
        },
      },
      {
        path: 'coupons',
        component: () => import('../views/CouponsPage.vue'),
        meta: {
          layout: 'admin',
          title: '後台優惠券',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '查無此頁' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  linkActiveClass: 'active',
  routes,
});

// ✅ 加入導航守衛
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | SlideX`;
  } else {
    document.title = 'SlideX 專業滑板';
  }
  next();
});

export default router;
