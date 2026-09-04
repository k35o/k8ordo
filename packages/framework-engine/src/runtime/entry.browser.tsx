import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import { hydrateRoot } from 'react-dom/client';

import { AppRouter } from './app-router';
import type { Payload } from './payload';
import { payloadPathFor } from './payload-path';

const response = await fetch(payloadPathFor(location.pathname));
if (response.body === null) {
  throw new Error(`no payload for ${location.pathname}`);
}
const payload = await createFromReadableStream<Payload>(response.body);
hydrateRoot(
  document,
  <AppRouter pathname={payload.pathname} tree={payload.tree} />,
);
