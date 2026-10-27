import { wait } from '../../lib/wait';

async function Late() {
  await wait(1000);
  return <p>arrived under an error.tsx</p>;
}

// loading.tsx の無い error.tsx の下で、<Suspense> なしにデータを待つ
export default function CaughtPage() {
  return <Late />;
}
