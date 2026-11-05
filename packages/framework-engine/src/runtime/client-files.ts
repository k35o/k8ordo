import { withBase } from '@k8ordo/router';

import { CLIENT_FILES_PATH } from './payload';
import type { ClientFiles } from './payload';

/** Each page's files, by its payload's path; empty until the list is read. */
let listed: ReadonlyMap<string, readonly string[]> = new Map();

/**
 * Reads the static build's list of the files each page's client components
 * need. Without one — `vite dev`, a host that lost it — a payload names its
 * files as it is read, as it always does.
 */
export const readClientFiles = async (): Promise<void> => {
  let read: ClientFiles;
  try {
    const response = await fetch(withBase(CLIENT_FILES_PATH), {
      priority: 'low',
    });
    if (!response.ok) return;
    read = (await response.json()) as ClientFiles;
  } catch {
    return;
  }
  listed = new Map(
    Object.entries(read.pages).map(([page, indexes]) => [
      page,
      indexes.flatMap((index) => read.files[index] ?? []),
    ]),
  );
};

/**
 * Links what the page whose payload is at `payloadPath` needs: its scripts
 * as module preloads, its stylesheets as preloads.
 */
export const preloadClientFiles = (payloadPath: string): void => {
  const files = listed.get(new URL(payloadPath, location.href).pathname);
  if (files === undefined) return;
  // この文書がもうリンクしたファイルは張らない。当てたスタイルシートを
  // preload すると、誰も使わない取得になる
  const present = new Set(
    Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[href]'),
      (link) => link.href,
    ),
  );
  for (const href of files) {
    if (present.has(new URL(href, location.href).href)) continue;
    const link = document.createElement('link');
    // スタイルシートは当てずに取るだけにする。一覧はこの文書より新しいデプロイの
    // ものかもしれず、当てると画面のページの見た目まで変わる。当てるのは、
    // そのページの client コンポーネントを読み込むとき（取ったものを使う）
    if (new URL(href, location.href).pathname.endsWith('.css')) {
      link.rel = 'preload';
      link.as = 'style';
    } else {
      link.rel = 'modulepreload';
    }
    // Vite の読み込み口と同じ要求にして、取ったものを使い回させる
    link.crossOrigin = '';
    link.href = href;
    document.head.append(link);
  }
};
