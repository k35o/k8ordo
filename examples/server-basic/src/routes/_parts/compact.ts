'use server';

import { cookies } from '@k8ordo/server/runtime';

import { prefsState } from '../_data/prefs-state';

// Server Action は async であることが React 側の要求で、中身が同期でも関数を
// 同期にはできない。
// oxlint-disable eslint/require-await, typescript/require-await
export async function compact(): Promise<void> {
  // ブラウザのストアが書くのと同じ名前・値・属性で書く。HttpOnly にすると
  // ブラウザのストアから見えなくなる
  cookies().set(
    prefsState.cookieName,
    prefsState.cookieValue({ density: 'compact' }),
    { httpOnly: false, maxAge: 400 * 24 * 60 * 60 },
  );
}
