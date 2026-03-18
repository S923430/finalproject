const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'SlideX',
    },
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/finalproject/' : '/',
});
