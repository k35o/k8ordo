import { en } from './en';
import { ja } from './ja';

export { useMessages } from './context';
export { en } from './en';
export { ja } from './ja';
export type { Messages } from './messages';

/**
 * Every built-in dictionary by its locale, for an application that picks
 * one by the locale it is rendering: `messages={dictionaries[locale]}`.
 */
export const dictionaries = { ja, en } as const;
