import { notFound } from '@k8ordo/router';

import { redirect } from '../../../../../../src/runtime/server';

export const GET = ({ params }: { params: { id: string } }): Response => {
  if (params.id === 'old') redirect('/api/new');
  if (params.id === 'gone') notFound();
  return Response.json({ id: params.id });
};
