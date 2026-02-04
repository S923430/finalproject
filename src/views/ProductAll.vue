<template>
  <div class="container py-4 ProductAll">
    <div ref="topAnchor" class="scroll-anchor"></div>
    <LoadingPlugin :active="isLoading"></LoadingPlugin>
    <div
      class="row row-cols-2 row-cols-lg-5 d-flex justify-content-start flex-wrap g-3 mt-2 mb-3"
    >
      <div class="col" v-for="item in products" :key="item.id">
        <div class="card h-100">
          <a href="#" @click.prevent="getProduct(item.id)">
            <div class="ratio ratio-2x3 overflow-hidden">
              <img :src="item.imageUrl" class="card-img-top" alt="產品圖示" />
            </div>
          </a>
          <div class="card-body">
            <h5 class="card-title text-dark m-0">{{ item.title }}</h5>
          </div>
          <div class="card-footer border-0">
            <button
              type="button"
              class="btn btn-primary w-100 text-nowrap px-0"
              @click="addCart(item.id)"
              :disabled="this.status.loadingItem === item.id"
            >
              <div
                v-if="this.status.loadingItem === item.id"
                class="spinner-border text-warning spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <PaginationComponent
        :pages="pagination"
        @emit-pages="getProducts"
      ></PaginationComponent>
    </div>
  </div>
</template>

<script>
import PaginationComponent from '@/components/PaginationComponent.vue';
import emitter from '@/methods/emitter';

import { mapActions } from 'pinia';
import { useCartStore } from '@/stores/cartStore';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      isLoading: false,
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
  components: {
    PaginationComponent,
  },
  methods: {
    // 保險版：捲回頂端（扣掉 navbar 高度），同時處理多個瀏覽器/容器
    _scrollBackToTop() {
      const navbar = document.querySelector('.main-navbar');
      const navH = navbar ? navbar.offsetHeight : 0;
      const anchor = this.$refs.topAnchor;

      // 目前捲動位置（相容各瀏覽器）
      const currentY =
        window.pageYOffset ??
        document.documentElement.scrollTop ??
        document.body.scrollTop ??
        0;

      // 目標位置：錨點的絕對座標 - navbar 高度 - 一點間距
      let targetY = 0;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        targetY = rect.top + currentY - navH - 8;
      }
      targetY = Math.max(0, targetY);

      // 先用 window（大多數瀏覽器）
      try {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      } catch (e) {
        // 有些環境不支援 smooth，就用同步版
        window.scrollTo(0, targetY);
      }

      // iOS/Safari 等相容性：再直接設兩個 root 的 scrollTop
      document.documentElement.scrollTop = targetY;
      document.body.scrollTop = targetY;
    },
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/?page=${page}`;
      this.isLoading = true;
      this.$http
        .get(api)
        .then((res) => {
          this.isLoading = false;
          if (res.data.success) {
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
        })
        .finally(() => {
          this.$nextTick(() => {
            this._scrollBackToTop(); // 👈 換頁後捲到最上
          });
        });
    },
    getProduct(id) {
      this.$router.push(`/product/${id}`);
    },

    ...mapActions(useCartStore, ['addToCart']),

    addCart(id) {
      this.status.loadingItem = id;

      // 這裡呼叫的是 store 裡的 addToCart，它會幫你發 API 並跳通知
      this.addToCart(id, 1).then(() => {
        this.status.loadingItem = '';
      });
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style scoped>
.scroll-anchor {
  position: absolute;
  top: 0;
  height: 0;
  overflow: hidden;
}
</style>
