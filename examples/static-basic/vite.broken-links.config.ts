import { mergeConfig } from 'vite';
import type { Plugin } from 'vite';

import config from './vite.config';

const UNLINKED = '\0unlinked-react-dom';

// build.test.ts が「client コンポーネントの資産を link しない HTML はビルドを
// 止める」を主張するための構成。SSR でその CSS と JS を HTML に出す preinit と
// preloadModule を、何もしない関数に差し替える。呼ぶのは RSC プラグイン
const LINKING = /\/@vitejs\/plugin-rsc\//u;

const unlinking: Plugin = {
  name: 'unlinking',
  enforce: 'pre',
  applyToEnvironment: (environment) => environment.name === 'ssr',
  resolveId(source, importer) {
    return source === 'react-dom' && LINKING.test(importer ?? '')
      ? UNLINKED
      : null;
  },
  load(id) {
    return id === UNLINKED
      ? "export * from 'react-dom';\nexport const preinit = () => {};\nexport const preloadModule = () => {};\n"
      : null;
  },
};

export default mergeConfig(config, { plugins: [unlinking] });
