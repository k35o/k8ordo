import { href, Outlet, useMatch } from '@k8ordo/router';
import { ViewTransition } from 'react';
import type { FC, ReactNode } from 'react';

// <Link> はない。Navigation API の下では素の <a> がそのままクライアント遷移
// なので、「今どこにいるか」は useMatch に訊く。
const NavLink: FC<{ active: boolean; children: ReactNode; to: string }> = ({
  active,
  children,
  to,
}) => (
  <a aria-current={active ? 'page' : undefined} href={to}>
    {children}
  </a>
);

export const RootLayout: FC = () => {
  const atHome = useMatch('/') !== null;
  // '/products/*' は「/products の下」だけを指すので、index 自身は別に訊く
  // (hooks なので短絡させず、両方を毎回呼ぶ)
  const atProductsIndex = useMatch('/products') !== null;
  const underProducts = useMatch('/products/*') !== null;
  const inProducts = atProductsIndex || underProducts;
  const atGuide = useMatch('/guide') !== null;
  return (
    <div data-testid="root-layout">
      <nav>
        <NavLink active={atHome} to={href('/')}>
          home
        </NavLink>{' '}
        <NavLink active={inProducts} to={href('/products')}>
          products
        </NavLink>{' '}
        <NavLink active={atGuide} to={href('/guide')}>
          guide
        </NavLink>
      </nav>
      <main>
        {/* ページの差し替えだけをクロスフェードする。ルーターが transition に
            付ける `navigation` の型で選ぶので、ページ内の他の transition では
            動かない */}
        <ViewTransition
          default="none"
          update={{ navigation: 'auto', default: 'none' }}
        >
          <Outlet />
        </ViewTransition>
      </main>
    </div>
  );
};
