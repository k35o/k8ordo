import { message } from '@k8ordo/i18n';

// 呼んだ時点のロケールの文になる。Server Action の中なら、それを呼んだ
// ページの URL が名指すロケール
export const greeted = message<[name: string]>({
  en: (name) => `Hello, ${name}.`,
  ja: (name) => `こんにちは、${name} さん。`,
});
