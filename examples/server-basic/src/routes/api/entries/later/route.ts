import type { RouteContext } from '@k8ordo/framework';
import { waitUntil } from '@k8ordo/framework/server';

import { addEntrySlowly } from '../../../../lib/entries.server';

const saveLater = async (name: string): Promise<void> => {
  await addEntrySlowly(name);
  console.warn('example: saved %s after the answer', name);
};

// 受け取ったことだけを先に答え、保存は答えたあとに続ける。waitUntil に渡して
// おくと、ホストは保存が終わるまで止めない（serve は close() が待ち、Vercel は
// 関数を生かしておく）。渡さなければ、答えた時点で止められることがある
export async function POST({ request }: RouteContext<'/api/entries/later'>) {
  const body: unknown = await request.json();
  const name =
    typeof body === 'object' && body !== null && 'name' in body
      ? body.name
      : undefined;
  if (typeof name !== 'string' || name === '') {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }
  waitUntil(saveLater(name));
  return Response.json({ accepted: name }, { status: 202 });
}
