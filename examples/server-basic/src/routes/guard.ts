import { nonce, responseHeaders } from '@k8ordo/framework/server';

// ルートの guard はすべてのページ・ルート・404 の前に走る。通すときに
// 応答へ添えたいものを書き、何も返さない
export default function guard(): void {
  responseHeaders().set('x-content-type-options', 'nosniff');
  // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトに
  // この応答の nonce を付けるだけなので、それを名指す。React の開発ビルドは
  // eval() を使うので、vite dev でだけ許す
  const scripts = [`'nonce-${nonce()}'`, "'strict-dynamic'"];
  if (import.meta.env.DEV) scripts.push("'unsafe-eval'");
  responseHeaders().set(
    'content-security-policy',
    `script-src ${scripts.join(' ')}; object-src 'none'; base-uri 'none'`,
  );
}
