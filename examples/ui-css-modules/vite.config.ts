import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

// Tailwind プラグインを意図的に入れていない。この example は
// 「ビルド済み styles.css は Tailwind なしで消費できる」の担保なので、
// ここに @tailwindcss/vite を足したらテストの意味がなくなる。
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
  },
});
