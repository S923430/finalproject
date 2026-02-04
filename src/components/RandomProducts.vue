<template>
  <div class="container mb-5">
    <h3 class="text-center mb-4 fw-bold">🔥 每日精選推薦</h3>

    <div v-if="isLoading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-secondary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="item in randomProducts" :key="item.id">
        <div class="card h-100 shadow-sm border-0 product-card">
          <div class="img-container" @click="goToProduct(item.id)">
            <img
              :src="item.imageUrl"
              class="card-img-top product-img"
              :alt="item.title"
            />
            <div class="hover-overlay">
              <span class="btn btn-light btn-sm fw-bold px-3 py-2"
                >查看詳情</span
              >
            </div>
          </div>

          <div class="card-body d-flex flex-column">
            <h5 class="card-title fw-bold text-dark">{{ item.title }}</h5>
            <div
              class="d-flex justify-content-between align-items-center mt-auto"
            >
              <span class="text-danger fw-bold fs-5">
                NT$ {{ $filters.currency(item.price) }}
              </span>
              <del
                class="text-muted fs-6"
                v-if="item.origin_price > item.price"
              >
                NT$ {{ $filters.currency(item.origin_price) }}
              </del>
            </div>
            <button
              class="btn btn-outline-primary w-100 mt-3"
              @click="goToProduct(item.id)"
            >
              查看商品
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-light py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-3 text-center">
          <div class="h1 text-secondary mb-3">
            <i class="bi bi-truck"></i>
          </div>
          <h5 class="fw-bold">全館免運費</h5>
          <p class="text-muted small">消費滿 NT$ 3,000 即享免運</p>
        </div>
        <div class="col-md-3 text-center">
          <div class="h1 text-secondary mb-3">
            <i class="bi bi-shield-check"></i>
          </div>
          <h5 class="fw-bold">一年原廠保固</h5>
          <p class="text-muted small">所有滑板皆享有完整保修</p>
        </div>
        <div class="col-md-3 text-center">
          <div class="h1 text-secondary mb-3">
            <i class="bi bi-arrow-repeat"></i>
          </div>
          <h5 class="fw-bold">七天鑑賞期</h5>
          <p class="text-muted small">不滿意包退，購物無負擔</p>
        </div>
        <div class="col-md-3 text-center">
          <div class="h1 text-secondary mb-3">
            <i class="bi bi-chat-dots"></i>
          </div>
          <h5 class="fw-bold">專業線上諮詢</h5>
          <p class="text-muted small">有問題？教練線上為您解答</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RandomProducts',
  data() {
    return {
      products: [],
      randomProducts: [],
      isLoading: false,
    };
  },
  methods: {
    getProducts() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`;
      this.isLoading = true;
      this.$http
        .get(api)
        .then((res) => {
          if (res.data.success) {
            this.products = res.data.products;
            this.getRandomProducts();
          }
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    getRandomProducts() {
      if (this.products.length <= 3) {
        this.randomProducts = this.products;
        return;
      }
      const shuffled = [...this.products].sort(() => 0.5 - Math.random());
      this.randomProducts = shuffled.slice(0, 3);
    },
    goToProduct(id) {
      this.$router.push(`/product/${id}`);
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>
