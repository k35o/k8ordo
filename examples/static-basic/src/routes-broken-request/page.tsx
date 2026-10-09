import { nonce } from '@k8ordo/framework/server';

import { home } from '../broken-parts/request/home';
import { visits } from '../broken-parts/request/visits';

export default function HomePage() {
  return (
    <h1 data-nonce={nonce()} data-home={home}>
      visits: {visits() ?? 'none'}
    </h1>
  );
}
