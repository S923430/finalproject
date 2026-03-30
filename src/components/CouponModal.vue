<template>
  <div
    class="modal fade"
    id="couponModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            {{ isNew ? '新增優惠券' : tempCoupon.title }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <isLoading :active="isLoading" :is-full-page="false"></isLoading>
        <div class="modal-body position-relative">
          <div class="mb-3">
            <label for="title">標題</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="localCoupon.title"
              placeholder="請輸入標題"
            />
          </div>
          <div class="mb-3">
            <label for="coupon_code">優惠碼</label>
            <input
              type="text"
              class="form-control"
              id="coupon_code"
              v-model="localCoupon.code"
              placeholder="請輸入優惠碼"
            />
          </div>
          <div class="mb-3">
            <label for="due_date">到期日</label>
            <input
              type="date"
              class="form-control"
              id="due_date"
              v-model="due_date"
            />
          </div>
          <div class="mb-3">
            <label for="price">折扣百分比</label>
            <input
              type="number"
              class="form-control"
              id="price"
              v-model.number="localCoupon.percent"
              placeholder="請輸入折扣百分比"
            />
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                v-model="localCoupon.is_enabled"
                id="is_enabled"
              />
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="confirmUpdate">
            <!-- @click="$emit('update-coupon', tempCoupon)" -->
            更新優惠券
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import modalMixin from '@/mixins/modalMixin';

export default {
  name: 'couponModal',
  props: {
    coupon: {},
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tempCoupon: {},
      localCoupon: {},
      due_date: '',
      isLoading: false,
    };
  },
  emits: ['update-coupon'],
  watch: {
    coupon: {
      immediate: true,
      handler() {
        this.tempCoupon = JSON.parse(JSON.stringify(this.coupon));
        // 為了編輯時，標題內容不要跟著修改，因此複製一份出來，改完存檔在複製給 this.tempCoupon
        this.localCoupon = JSON.parse(JSON.stringify(this.coupon));

        if (this.localCoupon.due_date) {
          const dateAndTime = new Date(this.localCoupon.due_date * 1000)
            .toISOString()
            .split('T');
          [this.due_date] = dateAndTime;
        } else {
          const today = new Date().toISOString().split('T')[0];
          this.due_date = today;
          this.localCoupon.due_date = Math.floor(new Date(today) / 1000);
        }
      },
    },
    due_date(newDate) {
      this.localCoupon.due_date = Math.floor(new Date(newDate) / 1000);
    },
  },
  mixins: [modalMixin],
  methods: {
    confirmUpdate() {
      this.isLoading = true;
      // 在送出前，把 localCoupon 的值複製到 tempCoupon
      this.tempCoupon = JSON.parse(JSON.stringify(this.localCoupon));

      this.$emit('update-coupon', this.tempCoupon, () => {
        this.isLoading = false;
        this.hideModal();
      });
    },
  },
};
</script>
