import { href } from '@k8ordo/framework';

import { locales } from '../i18n';

// ページと殻の両方に置く。ロケールは [locale]/layout.tsx のスキーマが
// 決めたもので、殻もビルドの時点でそれを知っている
export function PostLinks() {
  const locale = locales.getLocale();
  return (
    <nav data-testid="post-links">
      <a href={href('/:locale/posts/:id', { locale, id: 1 })}>post 1</a>{' '}
      <a href={href('/:locale/posts/:id', { locale, id: 3 })}>post 3</a>{' '}
      <a href={href('/:locale/posts/:id', { locale, id: 999 })}>post 999</a>{' '}
      <a href={href('/:locale/posts/first', { locale })}>
        first post (old address)
      </a>
    </nav>
  );
}
