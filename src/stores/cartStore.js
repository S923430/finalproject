import { defineStore } from 'pinia';
import axios from 'axios';
import $httpMessage from '@/methods/pushMessage';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: {
      carts: [],
      total: 0,
      final_total: 0,
    },
    isLoading: false,
  }),

  getters: {
    totalQty: (state) => {
      const carts = state.cart.carts || [];
      return carts.reduce((sum, item) => sum + item.qty, 0);
    },
  },

  actions: {
    // 1. 取得購物車 (改成 async)
    async getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      try {
        const res = await axios.get(api);
        if (res.data.success) {
          this.cart = res.data.data;
        }
      } catch (err) {
        console.error('取得購物車失敗', err);
      } finally {
        this.isLoading = false;
      }
    },

    // 🌟 2. 新增：自動讀取並套用優惠券
    async autoApplyCoupon() {
      const savedCoupon = localStorage.getItem('savedCoupon');
      if (savedCoupon) {
        console.log('🕵️ 系統偵測到優惠碼，準備在背景套用：', savedCoupon); // 👈 加上這行來除錯
        const couponUrl = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
        try {
          await axios.post(couponUrl, { data: { code: savedCoupon } });
          console.log('✅ 背景套用優惠券成功！'); // 👈 加上這行來除錯
        } catch (error) {
          console.error('❌ 背景套用優惠券失敗', error);
        }
      } else {
        console.log('⚠️ 記憶體中沒有優惠碼，跳過套用');
      }
    },

    // 3. 加入購物車
    async addToCart(id, qty = 1, size = '') {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      const cart = {
        product_id: id,
        qty,
        size: size || undefined,
      };

      try {
        const res = await axios.post(url, { data: cart });
        $httpMessage(res, '加入購物車');

        // ★ 關鍵：加入商品後，偷偷幫它把優惠券打上去，再抓取最終資料
        await this.autoApplyCoupon();
        await this.getCart();
      } catch (err) {
        console.error('加入購物車失敗', err);
      } finally {
        this.isLoading = false;
      }
    },

    // 4. 刪除購物車項目
    async removeCartItem(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.isLoading = true;
      try {
        const res = await axios.delete(url);
        $httpMessage(res, '移除商品');
        await this.getCart();
      } catch (err) {
        console.error('移除失敗', err);
      } finally {
        this.isLoading = false;
      }
    },

    // 5. 更新購物車數量
    async updateCartItem(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      this.isLoading = true;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      try {
        const res = await axios.put(url, { data: cart });
        $httpMessage(res, '更新數量');

        // ★ 關鍵：更新數量後，偷偷把被後端拔掉的優惠券貼回去，再抓取最終資料
        await this.autoApplyCoupon();
        await this.getCart();
      } catch (err) {
        console.error('更新數量失敗', err);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
