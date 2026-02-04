<template>
  <LoadingPlugin :active="isLoading"></LoadingPlugin>
  <div class="bg-light product-page">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-lg-5 mx-0 mx-lg-3">
          <div class="my-4">
            <div
              id="carouselExampleControls"
              class="carousel slide"
              data-bs-ride="carousel"
            >
              <div class="carousel-inner d-flex" v-if="product.imageUrl">
                <div class="carousel-item active">
                  <img
                    :src="product.imageUrl"
                    class="d-block w-100"
                    alt="產品主圖"
                  />
                </div>
                <div
                  class="carousel-item"
                  v-for="(img, i) in product.imagesUrl || []"
                  :key="i"
                >
                  <img :src="img" class="d-block w-100" alt="產品圖示" />
                </div>
              </div>
              <button
                class="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="prev"
              >
                <span
                  class="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button
                class="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide="next"
              >
                <span
                  class="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <div class="my-4">
            <div class="text-dark">
              <h3>{{ product.title }}</h3>
              <p class="fs-4">NT${{ $filters.currency(product.price) }}</p>
            </div>
            <hr />
            <div class="my-3">
              <select class="form-select text-center" v-model="size">
                <option value="" disabled>請選擇尺寸</option>
                <option v-for="item in productSize" :key="item.choose">
                  {{ item.choose }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <div class="input-group">
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  @click="minus"
                >
                  -
                </button>
                <input
                  type="number"
                  class="form-control text-center"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  v-model="productsQty"
                  min="1"
                  disabled
                />
                <button
                  class="btn btn-outline-primary"
                  type="button"
                  @click="adder"
                >
                  +
                </button>
              </div>
            </div>
            <div class="mb-3 d-flex flex-column">
              <button
                class="btn btn-outline-primary mb-3"
                @click="addCart(product.id)"
                :disabled="this.status.loadingItem === product.id"
              >
                <div
                  v-if="this.status.loadingItem === product.id"
                  class="spinner-border text-dark spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                加入購物車
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="buyNow(product.id)"
                :disabled="this.status.loadingItemBuy === product.id"
              >
                <div
                  v-if="this.status.loadingItemBuy === product.id"
                  class="spinner-border text-dark spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                立即購買
              </button>
            </div>
            <p>{{ product.description }}</p>
            <p>
              {{ product.content }}
            </p>
          </div>
        </div>
        <div class="col-lg-9">
          <h3 class="mb-4">你可能有興趣</h3>
          <swiper-container
            slides-per-view="2"
            pagination="true"
            :breakpoints="{
              768: {
                slidesPerView: 5,
              },
            }"
            speed="500"
            class="suggest-swiper row row-cols-3 row-cols-lg-5 justify-content-center gx-2"
          >
            <swiper-slide
              class="col"
              v-for="item in filterProducts"
              :key="item.id"
            >
              <div class="card h-100">
                <a href="#" @click.prevent="goProduct(item.id)">
                  <img
                    :src="item.imageUrl"
                    class="card-img-top"
                    alt="產品圖示"
                  />
                </a>
                <div class="card-body">
                  <h5 class="card-title text-dark m-0">{{ item.title }}</h5>
                </div>
                <div class="card-footer border-0">
                  <button
                    class="btn btn-primary w-100"
                    @click="addCart(item.id)"
                    :disabled="this.status.loadingItem === item.id"
                  >
                    <div
                      v-if="this.status.loadingItem === item.id"
                      class="spinner-border text-dark spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    加入購物車
                  </button>
                </div>
              </div>
            </swiper-slide>
          </swiper-container>
        </div>
      </div>
    </div>
  </div>
  <ToastMessages></ToastMessages>
</template>

<script>
import emitter from '@/methods/emitter';
import ToastMessages from '@/components/ToastMessages.vue';
import { mapActions } from 'pinia';
import { useCartStore } from '@/stores/cartStore';

export default {
  components: { ToastMessages },
  data() {
    return {
      product: {},
      products: [],
      id: null, // 用來存當前商品 id
      filter: [],
      filterProducts: [],
      isLoading: false,
      status: { loadingItem: '', loadingItemBuy: '' },
      productsQty: 1,
      productSize: [{ choose: 'M' }],
      size: '',
    };
  },
  provide() {
    return { emitter };
  },

  watch: {
    // ✅ 監聽 productId（而不是 id）
    '$route.params.productId': {
      immediate: true,
      handler(newId) {
        this.id = newId; // ✅ 統一把路由參數丟到 this.id
        this.fetchAll();
      },
    },
  },

  methods: {
    ...mapActions(useCartStore, ['addToCart']),

    async fetchAll() {
      await this.getProduct();
      this.getProducts();
    },
    async getProduct() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.id}`;
      this.isLoading = true;
      try {
        const res = await this.$http.get(api);
        this.product =
          res.data && res.data.success ? res.data.product || {} : {};
      } finally {
        this.isLoading = false;
      }
    },
    getProducts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      // this.isLoading = true;
      this.$http
        .get(api)
        .then((res) => {
          this.isLoading = false;
          if (!res.data || !res.data.success) return;

          this.products = res.data.products || [];
          this.filter = this.products.filter(
            (p) =>
              p.category === this.product.category && p.id !== this.product.id
          );

          // 重新抽樣最多 5 個
          this.filterProducts = [];
          const limit = Math.min(this.filter.length, 5);
          const picked = new Set();
          while (picked.size < limit)
            picked.add(Math.floor(Math.random() * this.filter.length));
          picked.forEach((idx) => this.filterProducts.push(this.filter[idx]));
        })
        .catch(() => {
          this.isLoading = false;
        });
    },

    addCart(id, qty = this.productsQty) {
      this.status.loadingItem = id;

      // 呼叫 Store 的 addToCart，並傳入尺寸 (this.size)
      this.addToCart(id, qty, this.size)
        .then(() => {
          this.status.loadingItem = '';
          // 成功後 Store 會自動更新 Navbar，不需要 emit updateCart
        })
        .catch(() => {
          this.status.loadingItem = '';
        });
    },

    buyNow(id, qty = this.productsQty) {
      this.status.loadingItemBuy = id;

      // 先加入購物車，成功後跳轉
      this.addToCart(id, qty, this.size)
        .then(() => {
          this.status.loadingItemBuy = '';
          this.$router.push('/cart');
        })
        .catch(() => {
          this.status.loadingItemBuy = '';
        });
    },

    goProduct(id) {
      // 若你的 route 定義是 /product/:productId，這樣 push 字串也 OK
      this.$router.push(`/product/${id}`);
    },
    adder() {
      this.productsQty += 1;
    },
    minus() {
      this.productsQty = Math.max(1, this.productsQty - 1);
    },
  },
};
</script>

<style scoped>
.bg-light.product-page {
  /* 讓產品頁面的背景色延伸到填滿整個剩餘空間 */
  flex: 1;
  min-height: 0;
}
</style>
