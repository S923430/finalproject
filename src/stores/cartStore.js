import { defineStore } from 'pinia';
import axios from 'axios';
import $httpMessage from '@/methods/pushMessage';

export const useCartStore = defineStore('cart', {
  // 1. State: 相當於元件裡的 data
  state: () => ({
    cart: {
      carts: [],
      total: 0,
      final_total: 0,
    },
    isLoading: false,
  }),

  // 2. Getters: 相當於元件裡的 computed
  getters: {
    // 自動計算購物車內商品總數量 (qty 總和)
    totalQty: (state) => {
      const carts = state.cart.carts || [];
      return carts.reduce((sum, item) => sum + item.qty, 0);
    },
  },

  // 3. Actions: 相當於元件裡的 methods
  actions: {
    // 取得購物車列表
    getCart() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      return axios.get(api).then((res) => {
        if (res.data.success) {
          this.cart = res.data.data;
          this.isLoading = false;
        }
      });
    },

    // 加入購物車 (原本分散在各個商品頁)
    addToCart(id, qty = 1, size = '') {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.isLoading = true;
      const cart = {
        product_id: id,
        qty,
        size: size || undefined,
      };

      return axios.post(url, { data: cart }).then((res) => {
        this.isLoading = false;
        // 跳出 Toast 通知
        $httpMessage(res, '加入購物車');
        // ✅ 關鍵：加入成功後，立刻重新抓取購物車資料
        // 這樣所有訂閱這個 Store 的元件 (如 Navbar) 都會自動更新
        this.getCart();
      });
    },

    // 刪除購物車項目
    removeCartItem(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`;
      this.isLoading = true;
      return axios.delete(url).then((res) => {
        $httpMessage(res, '移除商品');
        this.getCart(); // 更新資料
        this.isLoading = false;
      });
    },

    // 更新購物車數量
    updateCartItem(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      this.isLoading = true;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };
      return axios.put(url, { data: cart }).then((res) => {
        $httpMessage(res, '更新數量');
        this.getCart(); // 更新資料
        this.isLoading = false;
      });
    },
  },
});
