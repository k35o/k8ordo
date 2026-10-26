import { Suspense } from 'react';

import { ClientB } from '../../components/client-b';

import styles from '../../components/server-b.module.css';

// 行き先のページが自分の Suspense の中に client コンポーネントを置く
export default function PageB() {
  return (
    <>
      <title>page b</title>
      <h1 className={styles.mark}>body b</h1>
      <Suspense fallback={<p>loading b</p>}>
        <ClientB />
      </Suspense>
    </>
  );
}
