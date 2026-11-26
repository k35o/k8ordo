// verbatimModuleSyntax の下ではこの書き方がモジュールの import として残り、
// 拒否されることを refusals.test.ts が確かめる。だから import type にしない
// oxlint-disable-next-line import/consistent-type-specifier-style, typescript/no-import-type-side-effects
import { type CookieOptions } from '@k8ordo/framework/server';

export const home = { path: '/' } satisfies CookieOptions;
