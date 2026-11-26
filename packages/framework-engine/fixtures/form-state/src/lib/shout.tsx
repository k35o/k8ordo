'use server';

import type { ReactNode } from 'react';

import { Shout } from '../components/shout';

// 答えは client コンポーネントの要素。JS なしで送られたフォームでは、
// useActionState がそれを formState から受け取って HTML に描く
// oxlint-disable-next-line eslint/require-await, typescript/require-await
export async function shout(
  _previous: ReactNode,
  formData: FormData,
): Promise<ReactNode> {
  const name = formData.get('name');
  return <Shout text={typeof name === 'string' ? name.toUpperCase() : ''} />;
}
