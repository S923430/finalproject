<template>
  <div class="container py-4 ProductAll">
    <LoadingPlugin :active="isLoading"></LoadingPlugin>
    <div
      class="row row-cols-2 row-cols-lg-5 d-flex justify-content-start flex-wrap g-3 mt-2 mb-3"
    >
      <div class="col" v-for="item in filterData" :key="item.id">
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
      productsAll: [],
      pagination: {},
      filterData: [],
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
  components: { PaginationComponent },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          const all = res.data.products;
          const filtered = all.filter((p) => p.category === '滑板');

          const perPage = 8; // 依你的排版設定
          const totalPages = Math.ceil(filtered.length / perPage);

          this.pagination = {
            current_page: page,
            total_pages: totalPages,
            has_pre: page > 1,
            has_next: page < totalPages,
          };

          const start = (page - 1) * perPage;
          this.filterData = filtered.slice(start, start + perPage);
        }
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

<!-- <style>
.ratio-2x3 {
  --bs-aspect-ratio: calc(4 / 3 * 100%);
}

/* 圖片不裁切、置中呈現 */
.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 想填滿可改成 cover */
}
</style> -->
