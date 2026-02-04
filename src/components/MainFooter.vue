<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 左側連結 -->
      <div class="footer-left">
        <nav class="footer-links">
          <router-link class="" to="/">首頁</router-link>
          <router-link class="" to="/product/all">商品列表</router-link>
          <router-link class="" to="/about">關於我們</router-link>
        </nav>
        <p class="copyright">Copyright © 2025 Zack Liang</p>
      </div>

      <!-- 中間 logo -->
      <div class="footer-center">
        <div class="logo">SLIDEX</div>
      </div>

      <!-- 右側社群與備註 -->
      <div class="footer-right">
        <div class="social-icons">
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-github"></i></a>
          <a href="#"><i class="fab fa-facebook"></i></a>
        </div>
        <p class="note">僅供為個人學習使用，非商業用途</p>
      </div>
    </div>
  </footer>
</template>
