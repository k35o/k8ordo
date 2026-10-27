import { Suspense } from 'react';

import { HeldElement } from '../../components/held-element';
import { Holder } from '../../components/holder';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// 殻を出したあとで解ける境界の中で、props で渡すだけの要素を返す
async function Late() {
  await wait(300);
  return <Holder later={<HeldElement />} />;
}

export default function HeldLate() {
  return (
    <>
      <title>held late</title>
      <Suspense fallback={<p>MARK_HELD_FALLBACK</p>}>
        <Late />
      </Suspense>
    </>
  );
}
