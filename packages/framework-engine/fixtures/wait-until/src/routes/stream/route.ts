import { waitUntil } from '../../../../../src/runtime/server';

const CHUNKS = ['first ', 'second ', 'last'];

// 最初の pull はストリームを作った文脈で呼ばれる。読み手が読んでから呼ばれる
// 後の pull で waitUntil() を呼ぶ
export const GET = (): Response => {
  let sent = 0;
  return new Response(
    new ReadableStream<Uint8Array>(
      {
        pull(controller) {
          const chunk = CHUNKS[sent];
          sent += 1;
          if (chunk === undefined) {
            waitUntil(Promise.resolve('saved'));
            controller.close();
            return;
          }
          controller.enqueue(new TextEncoder().encode(chunk));
        },
      },
      { highWaterMark: 0 },
    ),
  );
};
