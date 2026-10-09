import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { useParams, useRoute } from './router';

// @k8ordo/framework は <Router> を置かないので、そこで import されたフックは
// 必ずここで落ちる。エラー文が代わりの読み方を言わないと、型検査もビルドも
// 通ったあとで理由がわからない
describe('outside a <Router>', () => {
  it.each([
    ['useRoute', () => useRoute()],
    ['useParams', () => useParams('/posts/:id')],
  ])('%s says how a framework page reads its params instead', (_, hook) => {
    const Reader = () => {
      hook();
      return null;
    };
    expect(() => renderToString(createElement(Reader))).toThrow(
      'useRoute must render inside a matched <Router> — under @k8ordo/framework a page receives params as a prop, and useMatch reads them below it',
    );
  });
});
