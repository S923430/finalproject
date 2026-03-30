<template>
  <div class="$navbar-active-bg">
    <div class="container">
      <div
        class="row row-cols-lg-7 d-flex justify-content-center px-2"
        v-if="order"
      >
        <div class="col-lg-7 bg-light rounded-3 my-5">
          <div class="bg-light px-2 py-3 rounded-3">
            <h4 class="ps-2 fw-bold text-dark">訂單明細</h4>
            <table class="text-nowrap w-100">
              <thead>
                <tr class="text-center">
                  <th width="100">圖片</th>
                  <th width="150">產品名稱</th>
                  <th width="80">尺寸</th>
                  <th width="100">數量</th>
                  <th width="120">價格</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="text-center"
                  v-for="item in order.products"
                  :key="item.id"
                >
                  <td class="align-middle">
                    <img
                      :src="item.product.imageUrl"
                      class="img-fluid rounded"
                      style="max-width: 100px; min-width: 70px"
                      alt="產品圖示"
                    />
                  </td>
                  <td class="align-middle text-wrap">
                    {{ item.product.title }}
                  </td>
                  <td class="align-middle text-right">M</td>
                  <td class="align-middle text-right">
                    {{ item.qty }}/{{ item.product.unit }}
                  </td>
                  <td class="align-middle">
                    <span class="text-danger">{{ item.final_total }}</span>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="2" class="text-end fs-4">總計</th>
                  <td class="text-end text-danger fs-4">{{ order.total }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <form
          class="col-lg-7 bg-light rounded-3 my-5"
          @submit.prevent="payOrder"
        >
          <h2 class="mt-3 text-center text-dark">訂購人資料</h2>
          <table class="table pay-style">
            <tbody>
              <tr>
                <th>訂單編號</th>
                <td>{{ order.id }}</td>
              </tr>
              <tr>
                <th>姓名</th>
                <td>{{ order.user.name }}</td>
              </tr>
              <tr>
                <th width="100">Email</th>
                <td>{{ order.user.email }}</td>
              </tr>
              <tr>
                <th>收件人電話</th>
                <td>{{ order.user.tel }}</td>
              </tr>
              <tr>
                <th>收件人地址</th>
                <td>{{ order.user.address }}</td>
              </tr>
              <tr>
                <th>付款方式</th>
                <td>
                  <span>{{ order.user.pay }}</span>
                </td>
              </tr>
              <tr>
                <th>付款狀態</th>
                <td>
                  <span v-if="!order.is_paid" class="text-danger"
                    >尚未付款</span
                  >
                  <span v-else>付款完成</span>
                </td>
              </tr>
              <tr>
                <th>備註</th>
                <td>
                  <span>{{ order.message }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="text-center py-3" v-if="order.is_paid === false">
            <button class="btn btn-danger" @click="payOrder">確認並付款</button>
          </div>
          <div class="text-center py-3" v-if="order.is_paid === true">
            <button type="button" class="btn btn-primary" @click="goHome">
              回首頁
            </button>
          </div>
        </form>
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
      order: {
        user: {},
      },
      orderId: '',
      isLoading: false,
    };
  },
  provide() {
    return {
      emitter,
    };
  },
  methods: {
    getOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order/${this.orderId}`;
      this.$http.get(url).then((res) => {
        if (res.data.success) {
          this.order = res.data.order;
          emitter.emit('updateCart');
        }
      });
    },
    payOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/pay/${this.orderId}`;
      this.$http.post(url).then((res) => {
        if (res.data.success) {
          this.getOrder();
        }
      });
    },

    ...mapActions(useCartStore, ['getCart']),

    goHome() {
      // 1. 重新取得購物車列表 (此時後端購物車已被清空)
      this.getCart();
      // 2. 跳轉回首頁
      this.$router.push('/');
    },
  },
  created() {
    this.orderId = this.$route.params.orderId;
    this.getOrder();
  },
};
</script>
