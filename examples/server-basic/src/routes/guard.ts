import { nonce, responseHeaders } from '@k8ordo/framework/server';

// ルートの guard はすべてのページ・ルート・404 の前に走る。通すときに
// 応答へ添えたいものを書き、何も返さない
export default function guard(): void {
  responseHeaders().set('x-content-type-options', 'nosniff');
  // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトと
  // head に書く空の style にこの応答の nonce を付けるだけなので、それを
  // 名指す。React の開発ビルドは eval() を使い、vite dev は CSS を <style> で
  // 差し込むので、vite dev でだけ許す
  const scripts = [`'nonce-${nonce()}'`, "'strict-dynamic'"];
  if (import.meta.env.DEV) scripts.push("'unsafe-eval'");
  const styles = import.meta.env.DEV
    ? "'self' 'unsafe-inline'"
    : `'self' 'nonce-${nonce()}'`;
  responseHeaders().set(
    'content-security-policy',
    `script-src ${scripts.join(' ')}; style-src ${styles}; object-src 'none'; base-uri 'none'`,
  );
}
