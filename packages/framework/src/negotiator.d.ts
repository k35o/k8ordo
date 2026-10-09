// negotiator 1.x は同じ質の候補を `preferred` の順で並べるが、@types/negotiator
// はまだその引数を知らない（export = のクラスなので後から足すこともできない）。
// 使う分だけをここで宣言する。これが無いと `gzip, deflate, br` を送るブラウザに
// ヘッダーの並びどおり gzip を返してしまう
declare module 'negotiator' {
  export default class Negotiator {
    constructor(request: {
      readonly headers: Readonly<Record<string, string | undefined>>;
    });
    encoding(
      available: readonly string[],
      options?: { readonly preferred?: readonly string[] },
    ): string | undefined;
  }
}
