import { currentLocale } from '@k8ordo/i18n';
import type { RegisteredLocale } from '@k8ordo/i18n';

import { en } from './en';
import { ja } from './ja';
import type { Messages } from './messages';

const BUILT_IN: Readonly<Record<string, Messages>> = { ja, en };

// RSC と SSR は 1 つのプロセスの別のモジュールグラフなので、登録は
// @k8ordo/i18n の集合と同じく globalThis に置く。片方のグラフで登録した
// 辞書を、もう片方の描画も読める。
const REGISTRY_KEY = Symbol.for('@k8ordo/ui/messages');

type Global = { [REGISTRY_KEY]?: Map<string, Messages> };

const registry = (): Map<string, Messages> => {
  const global = globalThis as Global;
  global[REGISTRY_KEY] ??= new Map();
  return global[REGISTRY_KEY];
};

/**
 * Registers the built-in text for one locale — a locale `ja` and `en` do not
 * cover, or one of them with some keys replaced (`{ ...en, close: 'Dismiss' }`).
 * Call it next to `defineLocales`, in the module both the server and the
 * browser import; the last registration for a locale wins.
 */
export const registerMessages = (
  locale: RegisteredLocale,
  messages: Messages,
): void => {
  registry().set(locale, messages);
};

/**
 * The locale the components speak: `@k8ordo/i18n`'s current locale, or `en`
 * when the application has defined no locale set. Not a hook.
 */
export const getLocale = (): string => currentLocale() ?? 'en';

const find = (tag: string): Messages | undefined =>
  registry().get(tag) ?? BUILT_IN[tag];

/**
 * The built-in text in the locale the components speak. A registered
 * dictionary wins over a built-in one; a regional tag without one of its own
 * (`en-US`) reads its language's (`en`). Not a hook: a Server Component
 * calls it as readily as a Client Component.
 */
export const getMessages = (): Messages => {
  const locale = getLocale();
  const messages = find(locale) ?? find(new Intl.Locale(locale).language);
  if (messages === undefined) {
    throw new TypeError(
      `@k8ordo/ui: no built-in text for ${JSON.stringify(locale)} — register it with registerMessages(${JSON.stringify(locale)}, …) from '@k8ordo/ui/i18n'`,
    );
  }
  return messages;
};
