import { ClientBoundary } from '../../components/client-boundary';
import { wait } from '../../lib/wait';

async function Late() {
  await wait(1000);
  return <p>arrived in a client boundary</p>;
}

// client コンポーネントが描く <Suspense> の下で、データを待つ
export default function ClientBoundaryPage() {
  return (
    <ClientBoundary fallback={<p>waiting in a client boundary</p>}>
      <Late />
    </ClientBoundary>
  );
}
