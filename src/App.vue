<template>
  <div id="app" :class="{ 'admin-layout': isAdminLayout }">
    <UserNavBar v-if="!isAdminLayout" />
    <ToastMessages />
    <div class="main-content">
      <router-view />
    </div>
    <MainFooter v-if="!isAdminLayout" />
  </div>
</template>

<script>
import ToastMessages from '@/components/ToastMessages.vue';
import UserNavBar from './components/MainNavBar.vue';
import MainFooter from './components/MainFooter.vue';

export default {
  components: {
    ToastMessages,
    UserNavBar,
    MainFooter,
  },
  provide() {
    // 提供 emitter，讓其他需要 inject 的頁面也可以共用同一個
    return {
      emitter: require('@/methods/emitter').default,
    };
  },
  computed: {
    isAdminLayout() {
      return this.$route.meta.layout === 'admin';
    },
  },
};
</script>

<style lang="scss">
/* 建議：和 _navbar.scss 同步一個變數高度 */
:root {
  --navbar-height: 28px;
}

html {
  scroll-padding-top: calc(var(--navbar-height) + 12px);
}

/* sticky footer 必備：讓視窗高度可被計算 */
html,
body {
  height: 100%;
  max-width: 100%;
  overflow-x: hidden;
  margin: 0;
}

/* 前台 layout：用 flex 把 footer 貼底 */
#app:not(.admin-layout) {
  min-height: calc(100vh - var(--navbar-height));
  display: flex;
  flex-direction: column;

  /* Navbar 是 fixed，需要把主體往下推開同高的內距 */
  padding-top: var(--navbar-height);

  /* 這個底色就是你截圖那條米色；可保留或改為透明 */
  background-color: rgb(231, 222, 207);
}

/* 主內容吃掉多餘空間，footer 自然貼底 */
.main-content {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

/* 可選：小螢幕時 navbar 比較矮就調整一下 */
@media (max-width: 768px) {
  :root {
    --navbar-height: 28px;
  }
}
</style>
