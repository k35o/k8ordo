import { LocaleSelect } from '../../../components/locale-select';
import { TimeZone } from '../../../components/time-zone';
import { locales } from '../../../i18n';
import { aboutTitle, openedOn } from '../../../messages/about';

// /en/about と /ja/about だけのページ。/:locale は vite.config.ts の paths で
// locales.paths がロケールの数だけ展開し、ビルドはロケールごとに 1 枚書く。
// ロケールを受け取るスキーマは [locale]/layout.tsx にある

// 開いた時刻。ロケールの timeZone で書くので、en（UTC）では 9 月 1 日、
// ja（Asia/Tokyo）では 9 月 2 日になる
const OPENED = new Date('2026-09-01T18:00:00Z');

export default function AboutPage() {
  return (
    <>
      <title>{aboutTitle()}</title>
      <h1 data-testid="title">{aboutTitle()}</h1>
      <p data-testid="opened">
        {openedOn(locales.dateTimeFormat({ dateStyle: 'long' }).format(OPENED))}
      </p>
      {/* 訪問者自身のタイムゾーンはファイルに書けない。ブラウザで描く */}
      <TimeZone />
      <LocaleSelect />
    </>
  );
}
