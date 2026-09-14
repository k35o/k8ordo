// page.tsx に置かないのは、フレームワークの生成器が page.tsx の本文を文字列で
// 走査して `export const paramsSchema` を探すため。例の中の 1 行が本物の
// 宣言として拾われ、ビルドが無い export を import しようとして落ちる。
export const EXAMPLE = `// i18n.ts — 一覧はここにしか書かない
export const locales = defineLocales(['ja', 'en']);
declare module '@k8ordo/i18n' {
  interface Register { locale: LocaleOf<typeof locales> }
}

// messages/nav.ts — 文言は 1 つずつ関数。全ロケールが揃わないと通らない
export const home = message({ ja: 'ホーム', en: 'Home' });
export const greeting = message({
  ja: (name: string) => \`こんにちは、\${name}さん\`,
  en: (name) => \`Hello, \${name}\`, // 引数の型は ja から流れる
});

// routes/[locale]/layout.tsx — 受理したロケールがこの描画のロケールになる
export const paramsSchema = locales.paramsSchema; // /fr/… は 404

// Server Component でも Client Component でも、同じ 1 行
<h1>{nav.home()}</h1>
<p>{nav.greeting(name)}</p>`;
