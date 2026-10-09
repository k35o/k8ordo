import { notFound } from '@k8ordo/router';

import { wait } from '../../lib/wait';

// 描き始めてから notFound() と言うページ
export default async function GonePage() {
  await wait(100);
  notFound();
}
