'use client';

// error.tsx があっても、ビルド時の失敗は失敗のまま（static は書き出さない）
export default function RouteError({ error }: { error: unknown }) {
  return <p>{error instanceof Error ? error.message : 'unknown'}</p>;
}
