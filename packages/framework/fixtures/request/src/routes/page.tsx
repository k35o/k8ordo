import { nonce } from '@k8ordo/framework/server';

import { home } from '../home';
import { countLater } from '../later';
import { visits } from '../visits';

export default function HomePage() {
  countLater();
  return (
    <h1 data-nonce={nonce()} data-home={home}>
      visits: {visits() ?? 'none'}
    </h1>
  );
}
