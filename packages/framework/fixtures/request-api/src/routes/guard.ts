import { cookies, responseHeaders } from '@k8ordo/framework/server';

export default function guard(): void {
  responseHeaders().set('x-visits', cookies().get('visits') ?? 'none');
}
