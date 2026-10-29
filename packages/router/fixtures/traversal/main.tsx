import { useDeferredValue, useSyncExternalStore } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { defineRoutes } from '../../src/define-routes';
import { Router } from '../../src/router';

const AboutPage: FC = () => <h1>about</h1>;

// 十分に背の高いページ。離れた位置を戻ってきたときに確かめる
const TallPage: FC = () => (
  <div style={{ height: '5000px' }}>
    <h1>tall</h1>
  </div>
);

// @k8ordo/state の url の欄と同じく、検索を currententrychange で読む外部の
// store。急ぎの描画で入力の値が動き、絞った一覧は useDeferredValue で遅れて動く
const subscribe = (onChange: () => void): (() => void) => {
  navigation.addEventListener('currententrychange', onChange);
  return () => {
    navigation.removeEventListener('currententrychange', onChange);
  };
};
const readQuery = (): string =>
  new URL(location.href).searchParams.get('q') ?? '';

const ITEMS = Array.from({ length: 90 }, (_, index) => index);

const ListPage: FC = () => {
  const q = useSyncExternalStore(subscribe, readQuery, () => '');
  const shown = useDeferredValue(q);
  const items = shown === 'few' ? ITEMS.filter((i) => i % 3 === 0) : ITEMS;
  return (
    <>
      <h1>list</h1>
      <input aria-label="q" readOnly value={q} />
      <p data-testid="count">{items.length}</p>
      <ul style={{ margin: 0, padding: 0 }}>
        {items.map((i) => (
          <li key={i} style={{ height: '100px', listStyle: 'none' }}>
            {i}
          </li>
        ))}
      </ul>
    </>
  );
};

const routes = defineRoutes({
  '/about': AboutPage,
  '/tall': TallPage,
  '/list': ListPage,
});

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<Router routes={routes} />);
