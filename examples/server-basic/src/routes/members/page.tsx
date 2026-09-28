import type { PageProps } from '@k8ordo/router';

// guard.ts が通したリクエストでだけ描かれる
export default function MembersPage({ request }: PageProps<'/members'>) {
  return (
    <>
      <title>members</title>
      <h1 data-testid="title">members</h1>
      <p data-testid="member">{request.cookies.get('visitor') ?? '-'}</p>
    </>
  );
}
