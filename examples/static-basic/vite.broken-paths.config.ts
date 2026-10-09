import { framework } from '@k8ordo/framework/vite';
import { defineConfig } from 'vite';

// build.test.ts が「パラメータの残る paths はビルドが止まる」を主張するための
// 構成。渡されたパターンをそのまま返す: /:locale を展開し忘れたサイト
export default defineConfig({
  plugins: [framework({ mode: 'static', paths: (patterns) => patterns })],
});
