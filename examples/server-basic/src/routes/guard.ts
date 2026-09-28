import { nonce, responseHeaders } from '@k8ordo/server/runtime';

// ルートの guard はすべてのページ・ルート・404 の前に走る。通すときに
// 応答へ添えたいものを書き、何も返さない
export default function guard(): void {
  responseHeaders().set('x-content-type-options', 'nosniff');
  // ポリシーはアプリが決める。フレームワークは自分のインラインスクリプトに
  // この応答の nonce を付けるだけなので、それを名指す
  responseHeaders().set(
    'content-security-policy',
    `script-src 'nonce-${nonce()}' 'strict-dynamic'; object-src 'none'; base-uri 'none'`,
  );
}
