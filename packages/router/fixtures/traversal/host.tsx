import { useDeferredValue, useState } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { useInterceptedNavigation } from '../../src/navigation';

// フレームワークのランタイムのように、読み込みを待ってから木を当てるホスト。
// 試験が hold を立てると、読み込みは release まで終わらず、前のページが画面に
// 残る。?reload の付いた URL は search を読むページで、同じ pathname でも
// 読み直す
const ITEMS = Array.from({ length: 90 }, (_, index) => index);

const waiting: Array<() => void> = [];
const controls = {
  hold: false,
  release: (): void => {
    for (const go of waiting.splice(0)) go();
  },
};
Object.assign(globalThis, { controls });

const Host: FC = () => {
  const [latest, setLatest] = useState(location.href);
  useInterceptedNavigation<string>({
    claim: () => true,
    load: (url, signal) =>
      new Promise<string>((resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            reject(signal.reason as Error);
          },
          { once: true },
        );
        const go = (): void => {
          resolve(url.href);
        };
        if (controls.hold) waiting.push(go);
        else go();
      }),
    apply: setLatest,
    refresh: (url) => url.searchParams.has('reload'),
  });
  const shown = new URL(useDeferredValue(latest));
  const items =
    shown.searchParams.get('q') === 'few'
      ? ITEMS.filter((i) => i % 3 === 0)
      : ITEMS;
  return (
    <>
      <h1>{shown.pathname.slice(1)}</h1>
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

const rootElement = document.querySelector('#root');
if (rootElement === null) throw new Error('Root element not found');
createRoot(rootElement).render(<Host />);
