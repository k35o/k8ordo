import {
  memo,
  useDeferredValue,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import type { FC, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import { defineRoutes } from '../../src/define-routes';
import { usePathname } from '../../src/location';
import { Router } from '../../src/router';

const AboutPage: FC = () => <h1>about</h1>;

// 十分に背の高いページ。離れた位置を戻ってきたときに確かめる
const TallPage: FC = () => (
  <div style={{ height: '5000px' }}>
    <h1>tall</h1>
  </div>
);

// 描くたびに自分の高さを layout effect で測る部品。@k8ordo/ui の Tabs の
// useWritingMode のように、ページを画面に出す commit の中で layout を強制する
const Measured: FC<{ children: ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (element !== null) {
      element.dataset.height = String(element.getBoundingClientRect().height);
    }
  });
  return <div ref={ref}>{children}</div>;
};

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
      <Measured>
        <ul style={{ margin: 0, padding: 0 }}>
          {items.map((i) => (
            <li key={i} style={{ height: '100px', listStyle: 'none' }}>
              {i}
            </li>
          ))}
        </ul>
      </Measured>
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
