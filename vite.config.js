import vue from "@vitejs/plugin-vue";
const path = require("path");

export default {
  base: "./",
  publicPath: "./",
  plugins: [vue()],
  optimizeDeps: {
    include: ["schart.js"],
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://47.106.184.111:8899",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
