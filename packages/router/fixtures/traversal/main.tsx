import { memo, useDeferredValue, useSyncExternalStore } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { defineRoutes } from '../../src/define-routes';
import { usePathname } from '../../src/location';
import { Router } from '../../src/router';
import { List, Measured } from './list';

const AboutPage: FC = () => <h1>about</h1>;

// 十分に背の高いページ。離れた位置を戻ってきたときに確かめる
const TallPage: FC = () => (
  <div style={{ height: '5000px' }}>
    <h1>tall</h1>
  </div>
);

// 前のページより背の低いページ。前のページの位置がこのページで下げられる量を
// 超えたまま layout が走ると、位置はこのページの下端に切り詰められる
const ShortPage: FC = () => (
  <Measured>
    <div style={{ height: '2000px' }}>
      <h1>short</h1>
    </div>
  </Measured>
);

// @k8ordo/state の url の欄と同じく、検索を currententrychange と popstate で読む
// 外部の store。急ぎの描画で入力の値が動き、絞った一覧は useDeferredValue で遅れて
// 動く
const subscribe = (onChange: () => void): (() => void) => {
  navigation.addEventListener('currententrychange', onChange);
  window.addEventListener('popstate', onChange);
  return () => {
    navigation.removeEventListener('currententrychange', onChange);
    window.removeEventListener('popstate', onChange);
  };
};
const readQuery = (): string =>
  new URL(location.href).searchParams.get('q') ?? '';

const ListPage: FC = () => {
  const q = useSyncExternalStore(subscribe, readQuery, () => '');
  const shown = useDeferredValue(q);
  return (
    <>
      <h1>list</h1>
      <input aria-label="q" readOnly value={q} />
      <List few={shown === 'few'} />
    </>
  );
};

// ページをまたいで残るナビゲーションのように、ルーターの描画では描き直されない部品。
// 親に描き直されなければ、URL の動きを知る手は usePathname の購読だけ
const Where = memo(function Where() {
  return (
    <p data-testid="pathname" style={{ position: 'fixed', top: 0, right: 0 }}>
      {usePathname()}
    </p>
  );
});

const routes = defineRoutes({
  '/about': AboutPage,
  '/tall': TallPage,
  '/short': ShortPage,
  '/list': ListPage,
});

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <>
    <Where />
    <Router routes={routes} />
  </>,
);
