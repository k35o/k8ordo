import { UIProvider } from '@k8ordo/ui';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import '@k8ordo/ui/styles.css';

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <UIProvider>
      <App />
    </UIProvider>
  </StrictMode>,
);
