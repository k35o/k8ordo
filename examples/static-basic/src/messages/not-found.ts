import { message } from '@k8ordo/i18n';

// 404.html はビルドが既定の en で 1 度だけ書き、どの URL でも配られる。
// ブラウザでは hydrate を終えたあと、訪問者の URL のロケールで描き直される
export const nothingHere = message({
  en: 'nothing lives at this address',
  ja: 'このアドレスには何もありません',
});
