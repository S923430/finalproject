<template>
  <div
    class="d-flex flex-column justify-content-center align-items-center flex-grow-1 bg-light gap-4 text-center px-3"
  >
    <h1 class="display-1 fw-bold text-secondary mb-0">
      <i class="bi bi-cone-striped"></i> 404
    </h1>

    <div>
      <h2 class="fw-bold">哎呀！找不到這個頁面</h2>
      <p class="text-muted fs-5 mb-0">
        您要去的頁面可能已被移除、更名，或是暫時無法使用。
      </p>
    </div>

    <router-link to="/" class="btn btn-primary btn-lg px-5 fw-bold mx-auto">
      <i class="bi bi-house-door-fill me-2"></i> 回到首頁
    </router-link>
  </div>
</template>

<style scoped>
/* 可以添加一點背景紋理讓畫面不那麼單調 (選用) */
.bg-light {
  background-image: radial-gradient(#e2e2e2 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
