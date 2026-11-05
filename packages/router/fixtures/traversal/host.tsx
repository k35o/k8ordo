import { use, useDeferredValue, useState } from 'react';
import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { useInterceptedNavigation } from '../../src/navigation';
import { List } from './list';

// フレームワークのランタイムのように、読み込みを待ってから木を当てるホスト。
// 試験が hold を立てると、読み込みは release まで終わらず、前のページが画面に
// 残る。holdRender を立てると、読み込んだ木は当たっても release まで描き終わらず、
// 前のページが画面に残る。?reload の付いた URL は search を読むページで、同じ
// pathname でも読み直す
declare global {
  var controls: {
    hold: boolean;
    holdRender: boolean;
    /** The pathname and search of every load, in order. */
    loads: string[];
    release: () => void;
  };
}

type Loaded = { href: string; rendered: Promise<void> | null };

const waiting: Array<() => void> = [];
const held = (): Promise<void> =>
  new Promise((resolve) => {
    waiting.push(resolve);
  });
globalThis.controls = {
  hold: false,
  holdRender: false,
  loads: [],
  release: (): void => {
    for (const go of waiting.splice(0)) go();
  },
};

const Host: FC = () => {
  const [latest, setLatest] = useState<Loaded>({
    href: location.href,
    rendered: null,
  });
  useInterceptedNavigation<Loaded>({
    claim: () => true,
    load: (url, signal) => {
      controls.loads.push(`${url.pathname}${url.search}`);
      return new Promise<Loaded>((resolve, reject) => {
        signal.addEventListener(
          'abort',
          () => {
            reject(signal.reason as Error);
          },
          { once: true },
        );
        const go = (): void => {
          resolve({
            href: url.href,
            rendered: controls.holdRender ? held() : null,
          });
        };
        if (controls.hold) waiting.push(go);
        else go();
      });
    },
    apply: setLatest,
    refresh: (url) => url.searchParams.has('reload'),
  });
  const loaded = useDeferredValue(latest);
  if (loaded.rendered !== null) use(loaded.rendered);
  const shown = new URL(loaded.href);
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
