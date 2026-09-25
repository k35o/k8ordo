import type { Guard } from '@k8ordo/server/runtime';

// Cookie が無ければ、ページを描く前にここで 401 を返して打ち切る
const guard: Guard<'/members'> = ({ request }) => {
  const cookies = request.headers.get('cookie') ?? '';
  if (/(?:^|;\s*)visitor=/u.test(cookies)) return undefined;
  return new Response('members only — sign the guestbook first', {
    status: 401,
    headers: { 'content-type': 'text/plain;charset=utf-8' },
  });
};

export default guard;
