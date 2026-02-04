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
  </div>
</template>

<script>
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
  components: {},
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          this.productsAll = res.data.products;
          this.filterData = this.productsAll.filter(
            (item) => item.category === '配件'
          );
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
  computed: {},
  mounted() {
    this.getProducts();
  },
};
</script>
