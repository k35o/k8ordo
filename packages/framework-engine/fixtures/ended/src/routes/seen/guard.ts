import { responseHeaders } from '../../../../../src/runtime/server';

export default function guard({ request }: { request: Request }): undefined {
  const { pathname, search } = new URL(request.url);
  responseHeaders().set('x-guard-saw', `${pathname}${search}`);
  return undefined;
}
