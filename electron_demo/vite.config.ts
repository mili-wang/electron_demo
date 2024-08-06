import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer" 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: "electron-main/index.ts",
      },
      {
        entry: "electron-preload/preload.ts"
      }
    ]),
    electronRenderer(),
    polyfillExports()
  ],
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    outDir: "dist-electron"
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 实际请求地址
        changeOrigin: true
      },
    },
  }
});
