// verbatimModuleSyntax の下ではこの書き方がモジュールの import として残り、
// 拒否されることを build.test.ts が確かめる。だから import type にしない
// oxlint-disable-next-line import/consistent-type-specifier-style, typescript/no-import-type-side-effects
import { type RedirectTarget } from '@k8ordo/framework/server';

export const home = '/' satisfies RedirectTarget;
