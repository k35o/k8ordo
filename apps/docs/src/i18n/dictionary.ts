import { defineDictionary } from '@k8ordo/i18n';
import type { MessageKeyOf, TextKeyOf } from '@k8ordo/i18n';

import { locales } from './locales';
import { en } from './messages/en';
import { ja } from './messages/ja';

// ja が形を決め、en は Translations<typeof ja> で同じ形に縛られる。
// キーの一覧を別に持つ必要は無い。
export const dictionary = defineDictionary(locales, { ja, en });

/** `t(key)` だけで引ける文言のキー。`<T k>` や data/ の labelKey が取る型。 */
export type MessageKey = TextKeyOf<typeof dictionary>;

/** 関数の文言も含めた全キー。 */
export type AnyMessageKey = MessageKeyOf<typeof dictionary>;
