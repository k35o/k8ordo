import { message } from '@k8ordo/i18n';

// 描いた時点のロケールの文になる。ビルドではページごとに、paramsSchema が
// 受理したロケール。ブラウザでは URL が名指すロケール
export const aboutTitle = message({
  en: 'about the shop',
  ja: 'このお店について',
});

export const openedOn = message<[date: string]>({
  en: (date) => `Open since ${date}.`,
  ja: (date) => `${date}から営業しています。`,
});

export const language = message({
  en: 'language',
  ja: '言語',
});
