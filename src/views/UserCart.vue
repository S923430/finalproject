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
            <div class="table-responsive mt-3 d-none d-md-block">
              <table class="table align-middle text-nowrap mb-0">
                <thead>
                  <tr class="text-center">
                    <th width="100">圖片</th>
                    <th width="140">產品名稱</th>
                    <th width="100">尺寸</th>
                    <th width="100">數量</th>
                    <th width="120">單價</th>
                    <th width="50">刪除</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="text-center"
                    v-for="item in cart.carts"
                    :key="item.id"
                  >
                    <td>
                      <img
                        :src="item.product.imageUrl"
                        class="img-fluid rounded"
                        style="
                          max-width: 80px;
                          min-width: 60px;
                          object-fit: cover;
                        "
                        alt="產品圖"
                      />
                    </td>
                    <td class="text-wrap text-start" style="min-width: 130px">
                      {{ item.product.title }}
                    </td>
                    <td class="px-2">
                      <select class="form-select form-select-sm">
                        <option v-for="size in productSize" :key="size.choose">
                          {{ size.choose }}
                        </option>
                      </select>
                    </td>
                    <td>
                      <div class="d-flex justify-content-center">
                        <input
                          type="number"
                          class="form-control form-control-sm text-center"
                          style="min-width: 60px; max-width: 80px"
                          v-model.number="item.qty"
                          min="1"
                          :disabled="item.id === status.loadingItem"
                          @change="updateCart(item)"
                        />
                      </div>
                    </td>
                    <td>
                      <span class="text-danger fw-bold"
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
            </div>

            <div class="mt-3 d-md-none">
              <div
                class="card mb-3 border-0 shadow-sm"
                v-for="item in cart.carts"
                :key="item.id"
              >
                <div class="row g-0 align-items-center p-2">
                  <div class="col-4 text-center">
                    <img
                      :src="item.product.imageUrl"
                      class="img-fluid rounded"
                      style="max-height: 100px; object-fit: cover"
                      alt="產品圖"
                    />
                  </div>

                  <div class="col-8">
                    <div class="card-body p-2 position-relative">
                      <button
                        type="button"
                        class="btn-close position-absolute top-0 end-0 mt-2 me-2"
                        @click="removeCartItem(item.id)"
                        :disabled="item.id === status.loadingItem"
                      ></button>

                      <h6 class="card-title text-truncate pe-4 mb-2">
                        {{ item.product.title }}
                      </h6>

                      <div class="mb-2 d-flex align-items-center">
                        <span class="text-muted small me-2">尺寸</span>
                        <select class="form-select form-select-sm w-auto py-0">
                          <option
                            v-for="size in productSize"
                            :key="size.choose"
                          >
                            {{ size.choose }}
                          </option>
                        </select>
                      </div>

                      <div
                        class="d-flex justify-content-between align-items-center"
                      >
                        <input
                          type="number"
                          class="form-control form-control-sm text-center"
                          style="width: 70px"
                          v-model.number="item.qty"
                          min="1"
                          :disabled="item.id === status.loadingItem"
                          @change="updateCart(item)"
                        />
                        <span class="text-danger fw-bold fs-5">
                          ${{ $filters.currency(item.product.price) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-end pe-4 mt-2" v-if="qtyWarning == true">
              <p class="text-danger fs-5 mb-0">商品數量上限為50</p>
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
                  <td class="text-end text-success">
                    已套用優惠券：{{ cart.carts[0]?.coupon?.title }}
                  </td>
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
      productSize: [{ choose: 'M' }],
      qtyWarning: false,
    };
  },
  provide() {
    return { emitter };
  },
  inject: ['emitter', 'reload'],
  computed: {
    ...mapState(useCartStore, ['cart']),
    cartWarning() {
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
      autoApplyCoupon: 'autoApplyCoupon', // 引入 Store 的自動套用方法
    }),

    async getCart() {
      this.isLoading = true;
      try {
        // 進入畫面時，確保先背景套用一次優惠碼，再抓資料
        await this.autoApplyCoupon();
        await this.getCartAction();
      } catch (err) {
        console.error('取得購物車失敗:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async updateCart(item) {
      if (item.qty >= 51) {
        this.qtyWarning = true;
        return;
      }
      this.status.loadingItem = item.id;
      // 直接呼叫聰明的 Store，它會自動更新數量 -> 套用優惠券 -> 更新畫面
      await this.updateCartItemAction(item);
      this.status.loadingItem = '';
      this.qtyWarning = false;
    },

    async removeCartItem(id) {
      this.status.loadingItem = id;
      await this.removeCartItemAction(id);
      this.status.loadingItem = '';
    },

    async addCouponCode() {
      if (!this.coupon_code) {
        alert('請輸入優惠碼');
        return;
      }

      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = { code: this.coupon_code };
      this.isLoading = true;

      try {
        const res = await this.$http.post(url, { data: coupon });

        if (res.data.success) {
          // ★ 成功後，存入 localStorage 讓全站記住這個優惠碼
          localStorage.setItem('savedCoupon', this.coupon_code);

          await this.getCartAction();
          const appliedCoupon = this.cart.carts[0]?.coupon;
          if (appliedCoupon?.title) {
            alert(`成功套用優惠券：${appliedCoupon.title}`);
          } else {
            alert('優惠券套用成功！');
          }
          this.coupon_code = '';
        } else {
          // 失敗則清除記憶
          localStorage.removeItem('savedCoupon');
          alert(res.data.message);
        }
      } catch (err) {
        console.error(err);
        alert('網路連線錯誤，請稍後再試');
      } finally {
        this.isLoading = false;
      }
    },

    cartNext() {
      this.$router.push('/order');
    },
  },
  mounted() {
    this.getCart();
    AOS.init();
  },
};
</script>
