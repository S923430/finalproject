<template>
  <isLoading :active="isLoading"></isLoading>
  <SwiperComponent />

  <!-- 一串文字敘述 -->
  <div class="container mb-5">
    <p class="lead text-center">
      歡迎來到我們的網站，這裡有最新、最熱門的商品推薦，讓您的購物體驗更美好！
    </p>
    <div class="text-center mt-4">
      <router-link to="/product/all" class="btn btn-lg btn-secondary">
        立即前往購物 <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>
  </div>
  <RandomProducts />
</template>

<script>
import SwiperComponent from '@/components/SwiperComponent.vue';
import RandomProducts from '@/components/RandomProducts.vue';

export default {
  components: {
    SwiperComponent,
    RandomProducts,
  },
  name: 'HomePage',
};
</script>
