import { responseHeaders } from '@k8ordo/server/runtime';

// ルートの guard はすべてのページ・ルート・404 の前に走る。通すときに
// 応答へ添えたいものを書き、何も返さない
export default function guard(): void {
  responseHeaders().set('x-content-type-options', 'nosniff');
}
