import { waitUntil } from '../../../../../src/runtime/server';

export const GET = ({ request }: { request: Request }): Response => {
  waitUntil(
    new URL(request.url).searchParams.has('fail')
      ? Promise.reject(new Error('the save failed'))
      : Promise.resolve('saved'),
  );
  return new Response('answered');
};
