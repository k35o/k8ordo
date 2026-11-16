import { cookies, responseHeaders, waitUntil } from '@k8ordo/framework/server';

export default function guard(): void {
  // dev にはホストの口が無い。それでも答えている途中のリクエストの中なら呼べる
  waitUntil(Promise.resolve('counted'));
  responseHeaders().set('x-visits', cookies().get('visits') ?? 'none');
}
