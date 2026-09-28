import type { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { defineRoutes } from '../../src/define-routes';
import { Router } from '../../src/router';

const AboutPage: FC = () => <h1>about</h1>;

// 十分に背の高いページ。離れた位置を戻ってきたときに確かめる
const TallPage: FC = () => (
  <div style={{ height: '5000px' }}>
    <h1>tall</h1>
  </div>
);

const routes = defineRoutes({
  '/about': AboutPage,
  '/tall': TallPage,
});

const rootElement = document.querySelector('#root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(<Router routes={routes} />);
