import { UIProvider } from '@k8ordo/ui';
import { App } from '@modelcontextprotocol/ext-apps';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { watchToolCall } from './tool-call';
import { McpAppView } from './view';

import '@k8ordo/ui/styles.css';
import './app.css';

const app = new App(
  { name: 'k8ordo-a2ui', version: '1.0.0' },
  { availableDisplayModes: ['inline', 'fullscreen'] },
);
const toolCall = watchToolCall(app);
await app.connect();

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <UIProvider>
      <McpAppView app={app} toolCall={toolCall} />
    </UIProvider>
  </StrictMode>,
);
