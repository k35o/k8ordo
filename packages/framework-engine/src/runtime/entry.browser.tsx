import { createFromReadableStream } from '@vitejs/plugin-rsc/browser';
import type { ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { AppRouter } from './app-router';
import { payloadPathFor } from './payload-path';

async function start(): Promise<void> {
  const response = await fetch(payloadPathFor(location.pathname));
  if (response.body === null) {
    throw new Error(`no payload for ${location.pathname}`);
  }
  const tree = await createFromReadableStream<ReactNode>(response.body);
  hydrateRoot(document, <AppRouter tree={tree} />);
}

void start();
