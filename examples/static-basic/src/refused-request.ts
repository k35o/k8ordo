import { cookies } from '@k8ordo/framework/server';

// dev.test.ts のための材料。静的化には答えるリクエストが無いので、リクエストの
// API を import したモジュールを一つだけ用意しておく。refused-action.ts と同じく
// routes/ の外にあり、ビルドのモジュールグラフには入らない
export const visits = (): string | undefined => cookies().get('visits');
