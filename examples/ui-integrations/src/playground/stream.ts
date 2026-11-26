import { createLineBuffer } from './lines';
import type { Format, GenerateEvent } from './request';

export async function* generate(
  format: Format,
  prompt: string,
): AsyncGenerator<GenerateEvent> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ format, prompt }),
  });
  if (!response.ok || response.body === null) {
    yield {
      type: 'error',
      message:
        response.status === 404
          ? '本物のモデルを呼ぶ口は pnpm dev のときだけあります。'
          : await response.text(),
    };
    return;
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  const lines = createLineBuffer();
  for (;;) {
    const { done, value } = await reader.read();
    for (const line of done ? lines.flush() : lines.push(value)) {
      yield JSON.parse(line) as GenerateEvent;
    }
    if (done) {
      return;
    }
  }
}
