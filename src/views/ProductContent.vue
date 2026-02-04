<template>
  <div class="container">
    <div class="row align-items-start">
      <div class="col-lg-3">
        <div class="ms-2 px-3 mt-4">
          <div class="list-group ProductList">
            <h1 class="fs-3 text-dark text-center mb-0 fw-bold">商品一覽</h1>
            <hr class="text-light my-3" />
            <div class="rounded-3">
              <router-link
                to="/product/all"
                href="#"
                class="list-group-item list-group-item-action list-style fw-bold"
                aria-current="true"
              >
                所有商品
              </router-link>
              <router-link
                to="/product/skateboard"
                href="#"
                class="list-group-item list-group-item-action list-style fw-bold"
                >滑板</router-link
              >
              <router-link
                to="/product/protectivegear"
                href="#"
                class="list-group-item list-group-item-action list-style fw-bold"
                >護具</router-link
              >
              <router-link
                to="/product/skateshoes"
                href="#"
                class="list-group-item list-group-item-action list-style fw-bold"
                >滑板鞋</router-link
              >
              <router-link
                to="/product/accessories"
                href="#"
                class="list-group-item list-group-item-action list-style fw-bold"
                >配件</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style>
.product-content {
  --nav-h: 56px;
  --footer-h: 116.2px;
  min-height: calc(100vh - var(--nav-h) - var(--footer-h));
}
</style>
