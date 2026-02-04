<template>
  <div
    v-if="isShow"
    class="toast-container position-fixed bottom-0 end-0 p-3"
    style="z-index: 1055"
  >
    <div
      :class="['toast align-items-center text-white border-0 show', toastClass]"
      role="alert"
    >
      <div class="d-flex">
        <div class="toast-body">
          <strong>{{ title }}</strong>
          <div v-if="content">{{ content }}</div>
        </div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          @click="close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script>
import emitter from '@/methods/emitter';

export default {
  data() {
    return {
      title: '',
      content: '',
      style: '',
      isShow: false,
      timer: null,
    };
  },
  computed: {
    toastClass() {
      return this.style === 'success' ? 'bg-success' : 'bg-danger';
    },
  },
  methods: {
    show(msg) {
      this.title = msg.title;
      this.content = msg.content || '';
      this.style = msg.style;
      this.isShow = true;

      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.isShow = false;
      }, 3000);
    },
    close() {
      this.isShow = false;
      if (this.timer) clearTimeout(this.timer);
    },
  },
  mounted() {
    emitter.on('push-message', this.show);
  },
  beforeUnmount() {
    emitter.off('push-message', this.show);
  },
};
</script>

<style scoped>
.toast-container {
  max-width: 300px;
}
</style>
