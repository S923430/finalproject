<template>
  <div
    class="toast-container position-fixed pe-3 end-0"
    style="z-index: 1050; top: 90px"
  >
    <ToastView v-for="(msg, key) in messages" :key="key" :msg="msg" />
  </div>
</template>

<script>
import ToastView from './ToastView.vue';

export default {
  components: { ToastView },
  data() {
    return {
      messages: [],
    };
  },
  inject: ['emitter'],
  mounted() {
    this.emitter.on('push-message', (message) => {
      const { style = 'success', title, content } = message;
      this.messages.push({ style, title, content });
    });
  },
};
</script>
