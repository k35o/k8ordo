import { cookies } from '@k8ordo/server/runtime';
import type { Guard } from '@k8ordo/server/runtime';

// ゲストブックに署名した cookie が無ければ、ページを描く前にここで 401 を
// 返して打ち切る
const guard: Guard<'/members'> = () => {
  if (cookies().has('visitor')) return undefined;
  return new Response('members only — sign the guestbook first', {
    status: 401,
    headers: { 'content-type': 'text/plain;charset=utf-8' },
  });
};

export default guard;
