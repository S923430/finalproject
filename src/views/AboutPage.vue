<template>
  <div class="container py-5 about-page">
    <!-- 店名與介紹 -->
    <div class="row align-items-center mb-5 section-gap">
      <div class="col-md-6 text-center">
        <img
          src="../assets/img/aboutimg.png"
          alt="滑板照片"
          class="about-img"
        />
      </div>
      <div class="col-md-6">
        <h3 class="text-center mb-3"><em>SlideX</em></h3>
        <p>
          <strong>SlideX</strong> 是滑板領域的專家，深耕多年，
          從板身、橋、輪到各式配件，持續研發與創新，只為了讓每位滑手滑得更穩、更順、更安心。
        </p>
        <p>
          每一套組合都經過嚴格把關：材質選擇、板身彈性與強度、橋的穩定度、
          輪子的抓地與耐磨、軸承轉速與耐用度，到最後的整板組裝檢驗，
          任何細節都不放過。
        </p>
        <p>
          在陪伴無數滑手的旅程中，<strong>SlideX</strong>
          深知滑板不僅是一項運動或代步工具，
          更是表達自我、結交夥伴、釋放壓力的生活方式。
          我們致力打造讓你安心練招、自在巡航、享受街頭文化的最佳夥伴。
        </p>
      </div>
    </div>

    <!-- 聯繫我們 -->
    <div class="text-center mb-4 section-gap">
      <h4 class="fw-bold section-title">聯繫我們</h4>
    </div>
    <div class="section-gap">
      <HomeStore />
    </div>

    <!-- 意見表單 -->
    <div class="text-center mb-4 section-gap">
      <h4 class="fw-bold section-title">提供寶貴意見</h4>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <form>
          <div class="mb-3">
            <label class="form-label">姓名 (必填)</label>
            <input type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">電子郵件 (必填)</label>
            <input type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">電話</label>
            <input type="tel" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">留言內容</label>
            <textarea class="form-control" rows="4"></textarea>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-dark px-4">送出</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import HomeStore from '@/components/HomeStore.vue';

export default {
  name: 'AboutPage',
  components: {
    HomeStore,
  },
};
</script>
