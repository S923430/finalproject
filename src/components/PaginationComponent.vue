<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item">
        <button
          class="page-link"
          aria-label="Previous"
          @click.prevent="updatePage(pages.current_page - 1)"
          :class="{ disabled: pages.has_pre === false }"
        >
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li
        class="page-item"
        v-for="page in pages.total_pages"
        :key="page"
        :class="{ active: page === pages.current_page }"
      >
        <button type="button" class="page-link" @click="updatePage(page)">
          {{ page }}
        </button>
      </li>
      <li class="page-item">
        <button
          class="page-link"
          aria-label="Next"
          @click.prevent="updatePage(pages.current_page + 1)"
          :class="{ disabled: pages.has_next === false }"
        >
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
// :pages="{ 頁碼資訊 }"
// @emitPages="更新頁面事件"
// export default {
//   props: ['pages'],
//   methods: {
//     updatePage(page) {
//       this.$emit('emit-pages', page);
//     },
//   },
// };
export default {
  props: ['pages'],
  methods: {
    updatePage(page) {
      if (page < 1 || page > this.pages.total_pages) return;

      this.$emit('emit-pages', page);

      // 手機相容的捲到頂：捲動真正的 root scroller
      this.$nextTick(() => {
        const root =
          document.scrollingElement ||
          document.documentElement ||
          document.body;
        root.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
  },
};
</script>
