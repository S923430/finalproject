<template>
  <nav class="main-navbar">
    <div class="navbar-inner">
      <router-link class="logo" to="/">
        <img
          src="../assets/img/NavbarPic-removebg-preview.png"
          alt="Logo"
          class="logo-img"
        />
      </router-link>

      <div class="right-actions">
        <router-link to="/cart" class="icon-btn" aria-label="購物車">
          <i class="bi bi-cart-fill"></i>
          <span v-if="totalQty > 0" class="cart-badge">
            {{ totalQty }}
          </span>
        </router-link>

        <button class="menu-toggle" @click="toggleMenu" aria-label="開啟選單">
          <i class="bi" :class="menuOpen ? 'bi-x' : 'bi-list'"></i>
        </button>
      </div>

      <ul class="navbar-menu" :class="{ open: menuOpen }">
        <li>
          <router-link
            class="nav-link"
            to="/"
            exact-active-class="nav-active"
            @click="menuOpen = false"
            ><strong>首頁</strong></router-link
          >
        </li>
        <li>
          <router-link
            class="nav-link"
            to="/product/all"
            :class="{ 'nav-active': $route.path.startsWith('/product') }"
            @click="menuOpen = false"
            ><strong>商品列表</strong></router-link
          >
        </li>
        <li>
          <router-link
            class="nav-link"
            to="/about"
            exact-active-class="nav-active"
            @click="menuOpen = false"
            ><strong>關於我們</strong></router-link
          >
        </li>
      </ul>
    </div>

    <div v-if="menuOpen" class="menu-backdrop" @click="menuOpen = false"></div>
  </nav>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useCartStore } from '@/stores/cartStore';
import emitter from '@/methods/emitter';

export default {
  data() {
    return {
      menuOpen: false,
      status: {
        loadingItem: '',
      },
    };
  },
  provide() {
    return {
      emitter,
    };
  },
  inject: ['emitter'],
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
      document.documentElement.classList.toggle('no-scroll', this.menuOpen);
    },

    // 這行的意思是：「把 cartStore 裡的 getCart 動作，變成這個元件的一個 method」
    ...mapActions(useCartStore, ['getCart']),
  },
  computed: {
    // ✅ 新增：將 Store 裡的狀態 (State/Getters) 映射到這裡
    // 這樣在 template 裡就可以直接用 this.cart 和 this.totalQty
    ...mapState(useCartStore, ['cart', 'totalQty']),
  },
  watch: {
    // 跳頁時自動收起選單，避免誤以為「按鈕沒反應」
    $route() {
      this.menuOpen = false;
      document.documentElement.classList.remove('no-scroll');
    },
  },
  mounted() {
    this.getCart();
  },
};
</script>
