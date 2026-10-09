'use client';

// サーバーでの HTML の描画中に throw するクライアントコンポーネント。
// Server Component の描画は通るので、失敗は HTML の描画にしか現れない
export function Throws(): never {
  throw new Error('client component broken with no boundary above it');
}
