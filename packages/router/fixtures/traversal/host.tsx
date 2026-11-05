import { useDeferredValue, useState } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { useInterceptedNavigation } from '../../src/navigation';
import { List } from './list';

// フレームワークのランタイムのように、読み込みを待ってから木を当てるホスト。
// 試験が hold を立てると、読み込みは release まで終わらず、前のページが画面に
// 残る。?reload の付いた URL は search を読むページで、同じ pathname でも
// 読み直す
declare global {
  var controls: { hold: boolean; release: () => void };
}

const waiting: Array<() => void> = [];
globalThis.controls = {
  hold: false,
  release: (): void => {
    for (const go of waiting.splice(0)) go();
  },
};

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
  return (
    <>
      <h1>{shown.pathname.slice(1)}</h1>
      <List few={shown.searchParams.get('q') === 'few'} />
    </>
  );
};

const rootElement = document.querySelector('#root');
if (rootElement === null) throw new Error('Root element not found');
createRoot(rootElement).render(<Host />);
