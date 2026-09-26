import { framework } from '@k8ordo/static';
import { defineConfig } from 'vite';

// build.test.ts が「notFound() と言ったページのパスを列挙したらビルドが止まる」
// を主張するための構成。/products/3 はカタログに無い
export default defineConfig({
  plugins: [framework({ paths: () => ['/products/1', '/products/3'] })],
});
