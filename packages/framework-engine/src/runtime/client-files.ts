import { withBase } from '@k8ordo/router';
import { preload } from 'react-dom';

import { CLIENT_FILES_PATH } from './payload';
import type { ClientFiles } from './payload';

/** Each page's files, by its payload's path; empty until the list is read. */
let listed: ReadonlyMap<string, readonly string[]> = new Map();

/**
 * Reads the static build's list of the files each page needs beyond its
 * payload. Without one — `vite dev`, a host that lost it — a payload names
 * its files as it is read, as it always does.
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
 * as module preloads, its stylesheets as preloads, each at the priority its
 * payload is asked for at.
 */
export const preloadClientFiles = (
  payloadPath: string,
  priority: RequestPriority,
): void => {
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
    // どちらも Vite の読み込み口と同じ要求（crossOrigin=''）にして、取ったものを
    // 使い回させる。優先度を渡さずに張ると、スクリプトが High、スタイルシートが
    // VeryHigh で取られ、先読みのものが遷移のペイロードと回線を分け合う
    if (new URL(href, location.href).pathname.endsWith('.css')) {
      // スタイルシートは当てずに取るだけにする。一覧はこの文書より新しいデプロイの
      // ものかもしれず、当てると画面のページの見た目まで変わる。React に張らせる
      // のは、React が自分の張ったものでない preload を読み込み済みと見なし、
      // Server Component のスタイルシートが届く前にページを切り替えるため
      preload(href, { as: 'style', crossOrigin: '', fetchPriority: priority });
      continue;
    }
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.crossOrigin = '';
    link.fetchPriority = priority;
    link.href = href;
    document.head.append(link);
  }
};
