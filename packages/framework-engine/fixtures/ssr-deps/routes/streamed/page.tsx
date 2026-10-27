import { Suspense } from 'react';

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// 殻を出したあとで解ける境界の中で、client コンポーネントを読む
async function Late() {
  await wait(300);
  const { StreamedDemo } = await import('../../components/streamed-demo');
  return <StreamedDemo />;
}

export default function Streamed() {
  return (
    <>
      <title>streamed</title>
      <Suspense fallback={<p>MARK_LATE_FALLBACK</p>}>
        <Late />
      </Suspense>
    </>
  );
}
