import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

// Tailwind プラグインを意図的に入れていない。この example は
// 「ビルド済み styles.css は Tailwind なしで消費できる」の担保なので、
// ここに @tailwindcss/vite を足したらテストの意味がなくなる。
export default defineConfig({
  plugins: [react()],
  // 既定の target では Lightning CSS が ui の light-dark() と :dir() を
  // 書き換え、意味が変わる。ui の GUIDE のとおり、ui が組まれている版に向ける
  build: { cssTarget: ['chrome146', 'edge146', 'firefox151', 'safari26'] },
  test: {
    fsModuleCache: true,
  },
});
