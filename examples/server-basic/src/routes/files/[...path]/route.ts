import type { RouteContext } from '@k8ordo/framework';

// [...path] は /files より下の区間をすべて受け取る。何段あるかはリクエストが
// 決めるので、値は区間の配列で届く
export function GET({ params }: RouteContext<'/files/:path+'>) {
  return Response.json({
    name: params.path.at(-1),
    folders: params.path.slice(0, -1),
  });
}
