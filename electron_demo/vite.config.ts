import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer" 
import { resolve } from 'path'

const localEnv = loadEnv(process.env.NODE_ENV as string, process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
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
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    },
  },
  build: {
    emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
    outDir: "dist-electron"
  },
  server: {
    proxy: {
      '/api': {
        target: localEnv.VITE_API_BASE_URL, // 实际请求地址
        changeOrigin: true
      },
    },
  }
});
