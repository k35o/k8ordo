import type { RouteContext } from '@k8ordo/router';
import { cookies } from '@k8ordo/server/runtime';

import { addEntry, readEntries } from '../../_data/entries.server';

// JSON で読み書きする口。ページの POST（Server Action）と違い、ほかの origin
// からも届く。確かめたいことは route.ts が自分で確かめる
export function GET(_context: RouteContext<'/api/entries'>) {
  return Response.json({ entries: readEntries() });
}

export async function POST({ request }: RouteContext<'/api/entries'>) {
  const body: unknown = await request.json();
  const name =
    typeof body === 'object' && body !== null && 'name' in body
      ? body.name
      : undefined;
  if (typeof name !== 'string' || name === '') {
    return Response.json({ error: 'name is required' }, { status: 400 });
  }
  addEntry(name);
  // route.ts も応答に答える側なので、cookie を書ける
  cookies().set('visitor', name);
  return Response.json({ entries: readEntries() }, { status: 201 });
}
