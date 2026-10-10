import { message } from '@k8ordo/i18n';
import type { RegisteredLocale } from '@k8ordo/i18n';

// src/i18n.ts は Register を書かない。フレームワークが .k8ordo/register.gen.ts に
// 生成したものが効いていることを、型チェック（pnpm typecheck）で確かめる
it('holds every message to the locales src/i18n.ts declares, with no Register written by hand', () => {
  expectTypeOf<RegisteredLocale>().toEqualTypeOf<'en' | 'ja'>();
  // @ts-expect-error -- a message missing ja does not compile
  message({ en: 'home' });
});
