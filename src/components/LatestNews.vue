<template>
  <div class="container my-5">
    <h2 class="mb-4 border-bottom pb-2">最新滑板消息</h2>
    <div class="row gy-4">
      <div class="col-md-6 col-12" v-for="item in products" :key="item.id">
        <div class="product-box">
          <img :src="item.image" class="product-img" :alt="item.title" />

          <div
            class="card-body flex-fill d-flex flex-column justify-content-between mt-3"
          >
            <div>
              <h5 class="card-title">{{ item.title }}</h5>
              <p class="card-subtitle mb-2 text-muted">{{ item.subtitle }}</p>
              <p class="card-text">{{ item.description }}</p>
            </div>

            <router-link to="/product/all" class="btn btn-secondary mt-3">
              {{ item.button }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkateboardList',
  data() {
    return {
      products: [
        {
          id: 1,
          title: '【最新科技】高性能電動滑板',
          subtitle: '熱銷爆款『智慧電動滑板』',
          description:
            '搭載高效電機與長效鋰電池，支援遙控與定速巡航，城市通勤首選！限量優惠中，送原廠收納背包！',
          button: '立即搶購 >>',
          image: require('@/assets/img/latestNews1.jpg'),
        },
        {
          id: 2,
          title: '初學必備選板推薦 🛹✨',
          subtitle: '新手專用『加寬防滑滑板』',
          description:
            '專為初學者設計，穩定性高，踏板加寬防滑塗層，操作簡單好上手。限時 85 折！',
          button: '前往選購 >>',
          image: require('@/assets/img/latestNews2.jpg'),
        },
      ],
    };
  },
};
</script>
