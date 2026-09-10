// page.tsx に置かないのは、フレームワークの生成器が page.tsx の本文を文字列で
// 走査して `export const paramsSchema` を探すため。例の中の 1 行が本物の
// 宣言として拾われ、ビルドが無い export を import しようとして落ちる。
export const EXAMPLE = `// i18n/locales.ts — 一覧はここにしか書かない
export const locales = defineLocales(['ja', 'en']);

// i18n/ja.ts が形を決め、en.ts は Translations<typeof ja> で縛られる
export const ja = {
  'nav.home': 'ホーム',
  greeting: (name: string) => \`こんにちは、\${name}さん\`,
};
export const dictionary = defineDictionary(locales, { ja, en });

// routes/[locale]/layout.tsx — Server Component。文字列だけが境界を越える
export const paramsSchema = locales.paramsSchema; // /fr/… は 404
export default ({ params, children }) => (
  <LocaleProvider locale={params.locale}>{children}</LocaleProvider>
);

// サーバーでは translator、クライアントでは useTranslation
const t = dictionary.translator(params.locale);
const { t, locale } = useTranslation(dictionary);
t('greeting', name); // 引数は ja の関数から型が付く`;
