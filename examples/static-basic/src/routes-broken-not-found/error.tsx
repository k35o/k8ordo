'use client';

// error.tsx があると、throw した not-found もハンドラが 500 で答える。
// 書き出す側がその 500 を見落とすと、404.html が無いままビルドが通っていた
export default function RouteError({ error }: { error: unknown }) {
  return <p>{error instanceof Error ? error.message : 'unknown'}</p>;
}
