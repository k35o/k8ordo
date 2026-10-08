import { nonce } from '@k8ordo/framework/server';

import { home } from './_parts/home';
import { visits } from './_parts/visits';

export default function HomePage() {
  return (
    <h1 data-nonce={nonce()} data-home={home}>
      visits: {visits() ?? 'none'}
    </h1>
  );
}
