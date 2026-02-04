<template>
  <LoadingPlugin :active="isLoading"></LoadingPlugin>
  <div class="body mt-3">
    <div class="container">
      <div
        class="row row-cols-lg-10 d-flex justify-content-center py-lg-4"
        v-if="cart.carts && cart.carts.length > 0"
      >
        <div class="col-12 col-lg-7 my-3 my-lg-0">
          <div class="bg-light px-2 py-3 rounded-3">
            <h4 class="ps-2 fw-bold text-dark">購物車內容</h4>
            <table class="">
              <thead>
                <tr class="text-center">
                  <th width="150" class="d-none d-lg-block"></th>
                  <th width="140">產品名稱</th>
                  <th width="120">尺寸</th>
                  <th width="75">數量</th>
                  <th width="120">單價</th>
                  <th width="50"></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="text-center"
                  v-for="item in cart.carts"
                  :key="item.id"
                >
                  <img
                    :src="item.product.imageUrl"
                    class="cart-img d-none d-lg-block"
                    alt="產品圖"
                  />
                  <td>{{ item.product.title }}</td>
                  <td class="px-3">
                    <select class="form-select">
                      <option v-for="item in productSize" :key="item.choose">
                        {{ item.choose }}
                      </option>
                    </select>
                  </td>
                  <td class="text-right">
                    <div class="input-group mt-lg-1">
                      <input
                        type="number"
                        class="form-control text-center"
                        aria-label="Example text with button addon"
                        aria-describedby="button-addon1"
                        v-model.number="item.qty"
                        min="1"
                        :disabled="item.id === this.status.loadingItem"
                        @change="updateCart(item)"
                      />
                    </div>
                  </td>
                  <td>
                    <span class="text-danger"
                      >${{ $filters.currency(item.product.price) }}</span
                    >
                  </td>
                  <td>
                    <button
                      class="btn btn-outline-danger btn-sm"
                      type="button"
                      @click="removeCartItem(item.id)"
                      :disabled="item.id === status.loadingItem"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="text-end pe-4" v-if="this.qtyWarning == true">
              <p class="text-end text-danger fs-4">商品數量上限為50</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 sticky-top z-1" style="height: 100%; top: 80px">
          <div class="bg-light rounded-3 px-2 py-3 mb-3">
            <h5 class="ps-2 fw-bold text-dark">優惠碼</h5>
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                placeholder="請輸入優惠碼"
                aria-label="請輸入優惠碼"
                aria-describedby="btnGroupAddon"
                v-model="coupon_code"
              />
              <button
                class="input-group-text btn btn-primary"
                id="btnGroupAddon"
                @click="addCouponCode"
              >
                套用優惠碼
              </button>
            </div>
          </div>
          <div class="bg-light rounded-3 px-2 mb-3 py-3">
            <h5 class="ps-2 fw-bold text-dark">小記明細</h5>
            <table class="table align-middle">
              <tbody>
                <tr>
                  <th colspan="2" class="text-dark">商品金額</th>
                  <td class="text-end text-dark">
                    ${{ $filters.currency(cart.total) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="2" class="text-dark">總計</th>
                  <td class="text-end text-danger fs-3">
                    ${{ $filters.currency(cart.final_total) }}
                  </td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                  <th colspan="2" class="text-dark"></th>
                  <td class="text-end text-success">已套用優惠券</td>
                </tr>
              </tfoot>
            </table>
            <a
              class="btn btn-outline-primary w-100"
              @click.prevent="cartNext"
              :class="{ disabled: cartWarning == true }"
              >下一步</a
            >
          </div>
        </div>
      </div>

      <div v-else-if="!isLoading" class="text-center py-5">
        <div class="mb-3">
          <i class="bi bi-cart-x text-muted" style="font-size: 5rem"></i>
        </div>
        <h3 class="fw-bold mb-3">您的購物車目前沒有商品</h3>
        <p class="text-muted mb-4">快去選購喜歡的滑板吧！</p>
        <router-link to="/product/all" class="btn btn-primary btn-lg">
          前往購物 <i class="bi bi-arrow-right"></i>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style>
.cart-img {
  width: 240px; /* 固定寬度 */
  height: 240px; /* 固定高度 */
  object-fit: cover; /* 確保不變形，超出裁切 */
  border-radius: 6px; /* (可選) 圓角 */
}
</style>

<script>
import AOS from 'aos';
import emitter from '@/methods/emitter';
import { mapState, mapActions } from 'pinia';
import { useCartStore } from '@/stores/cartStore';

export default {
  data() {
    return {
      isLoading: true,
      status: {
        loadingItem: '',
      },
      coupon_code: '',
      productSize: [
        // { choose: 'XS' },
        // { choose: 'S' },
        { choose: 'M' },
        // { choose: 'L' },
        // { choose: 'XL' },
      ],
      qtyWarning: false,
    };
  },
  provide() {
    return {
      emitter,
    };
  },
  inject: ['emitter', 'reload'],
  computed: {
    //  映射 Store 的購物車資料
    ...mapState(useCartStore, ['cart']),

    // 自動判斷購物車是否為空 (控制 "下一步" 按鈕)
    cartWarning() {
      // 如果沒有 carts 陣列，或是長度為 0，或是總金額為 0，就鎖住按鈕
      return (
        !this.cart.carts ||
        this.cart.carts.length === 0 ||
        this.cart.total === 0
      );
    },
  },
  methods: {
    ...mapActions(useCartStore, {
      getCartAction: 'getCart',
      removeCartItemAction: 'removeCartItem',
      updateCartItemAction: 'updateCartItem',
    }),
    getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.isLoading = false;
        if (res.data.success) {
          this.cart = res.data.data;
          if (this.cart.total === 0) {
            this.cartWarning = true;
          } else {
            this.cartWarning = false;
          }
        }
      });
    },

    updateCart(item) {
      if (item.qty >= 51) {
        this.qtyWarning = true;
        return;
      }
      this.status.loadingItem = item.id;
      this.updateCartItemAction(item).then(() => {
        this.status.loadingItem = '';
        this.qtyWarning = false;
      });
    },

    removeCartItem(id) {
      this.status.loadingItem = id;
      // 使用 Store 的方法刪除，Store 會處理 API 並更新 cart 資料
      this.removeCartItemAction(id).then(() => {
        this.status.loadingItem = '';
      });
    },

    addCouponCode() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = { code: this.coupon_code };
      this.isLoading = true;
      this.$http.post(url, { data: coupon }).then(() => {
        // 成功後，呼叫 Store 重新抓取資料
        this.getCartAction();
        this.coupon_code = '';
        this.isLoading = false;
      });
    },

    cartNext() {
      this.$router.push('/order');
    },
  },
  // created() {
  //   emitter.on('updateCart', () => {
  //     this.getCart();
  //   });
  // },
  mounted() {
    this.getCartAction().then(() => {
      // 如果 Store 的 getCart 有回傳 Promise 這裡才會執行
      // 如果沒回傳也沒關係，Store 更新後 computed 會自動反應
      this.isLoading = false;
    });
    // 保險起見，手動關閉 loading (因為目前 store 的 getCart 可能沒回傳 promise)
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);

    AOS.init();
  },
};
</script>
