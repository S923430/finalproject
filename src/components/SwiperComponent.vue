<template>
  <div class="swiper-container-wrapper" ref="swiperContainer">
    <!-- 🌀 Loading Spinner -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <Swiper
      v-show="!loading"
      class="mySwiper"
      :modules="[Autoplay, Pagination, Navigation]"
      :autoplay="{ delay: 5000 }"
      :loop="true"
    >
      <SwiperSlide v-for="(slide, index) in slides" :key="index">
        <div class="slide-wrapper">
          <img
            v-if="slide.image"
            :src="slide.image"
            class="slide-image"
            :alt="slide.alt || '幻燈片圖片'"
            @load="onImageLoad"
          />
          <div class="slide-caption" v-if="slide.title || slide.text">
            <h5>{{ slide.title }}</h5>
            <p>{{ slide.text }}</p>
            <router-link to="/product/all" class="btn btn-warning cta-btn"
              >前往購物</router-link
            >
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <!-- ↓箭頭按鈕 -->
    <button class="scroll-down-btn" @click="scrollDown">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="white"
        viewBox="0 0 24 24"
      >
        <path d="M12 13.5L6 7.5l1.4-1.4L12 10.7l4.6-4.6 1.4 1.4z" />
        <path d="M12 19.5L6 13.5l1.4-1.4L12 16.7l4.6-4.6 1.4 1.4z" />
      </svg>
    </button>
  </div>

  <div ref="scrollTarget" class="content-below" :class="{ show: revealed }">
    <LatestNews />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import LatestNews from '@/components/LatestNews.vue';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import img1 from '@/assets/img/carousel-1.jpg';
import img2 from '@/assets/img/carousel-2.jpg';
import img3 from '@/assets/img/1.jpg';

const swiperContainer = ref(null);
const loading = ref(true);
const loadedCount = ref(0);
const revealed = ref(false);
const scrollTarget = ref(null);

const slides = [
  {
    image: img1,
    alt: '熱賣新款滑板',
    title: '熱賣新款滑板',
    text: '全新上市！立即搶購你的專屬滑板！',
  },
  {
    image: img2,
    alt: '專業滑板配件',
    title: '專業滑板配件',
    text: '強化配件，滑行更順暢！',
  },
  {
    image: img3,
    alt: '潮流穿搭',
    title: '潮流穿搭',
    text: '帥氣服飾等你來挑！',
  },
];

// ✅ 每張圖片載入完成都觸發
function onImageLoad() {
  loadedCount.value++;
  if (loadedCount.value >= slides.length) {
    loading.value = false;
  }
}

// ✅ 捲動到 Swiper 下方
function scrollDown() {
  scrollTarget.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  revealed.value = true;
}

onMounted(() => {
  if (window.innerWidth < 768) {
    // 小螢幕直接顯示
    revealed.value = true;
    return;
  }

  let timeoutId = null;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (timeoutId) clearTimeout(timeoutId);

      if (entry.isIntersecting) {
        // 進入時立即顯示
        revealed.value = true;
      } else {
        // 離開時延遲 200ms 再隱藏，避免快速滾動時閃爍
        timeoutId = setTimeout(() => {
          revealed.value = false;
        }, 200);
      }
    },
    {
      threshold: 0.4, // ✅ 25% 可見時切換
      rootMargin: '-100px 0px', // ✅ 上下各預留 100px 緩衝
    },
  );

  if (scrollTarget.value) {
    observer.observe(scrollTarget.value);
  }
});
</script>
