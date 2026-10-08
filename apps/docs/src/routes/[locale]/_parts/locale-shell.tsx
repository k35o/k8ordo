'use client';

import { matchPath, usePathname } from '@k8ordo/framework';
import { UIProvider, Drawer, Heading, IconButton, ListIcon } from '@k8ordo/ui';
import { useEffect, useRef, useState, ViewTransition } from 'react';
import type { CSSProperties, FC, ReactNode } from 'react';

import { Footer } from '../../../components/footer';
import { FRAME } from '../../../components/frame';
import { LocaleAnchor } from '../../../components/locale-anchor';
import { Navigation } from '../../../components/navigation';
import { PackageSidebar } from '../../../components/package-sidebar';
import type { Catalogs } from '../../../components/package-sidebar';
import { aiCategories } from '../../../data/ai-nav';
import { componentCategoriesOf } from '../../../data/components-nav';
import type { ComponentGroups } from '../../../data/components-nav';
import { PACKAGES } from '../../../data/packages';
import type { PackageEntry } from '../../../data/packages';
import { locales } from '../../../i18n';
import * as m from '../../../messages';
import { WritingModeProvider } from '../../../theme/writing-mode-context';

/**
 * 開いているパッケージのドキュメントのページ。ランディング（`/:locale/form`
 * そのもの）は `/*` に合わないので、サイドバーを持たない全幅のページのまま。
 */
const useDocPackage = (): PackageEntry | undefined => {
  const pathname = usePathname();
  return PACKAGES.find((pkg) => matchPath(`${pkg.path}/*`, pathname) !== null);
};

/**
 * ページの差し替えをクロスフェードする。ルーターが付ける `navigation` の型で
 * 選ぶのは、Button の action も transition だから。型で絞らないと、ボタンを
 * 1 つ押すたびにページ全体がフェードする。中身の更新（update）を見るのは、
 * 境界は残ってページだけが入れ替わるため。
 */
const PageTransition: FC<{ children: ReactNode }> = ({ children }) => (
  <ViewTransition
    default="none"
    update={{ navigation: 'auto', default: 'none' }}
  >
    {children}
  </ViewTransition>
);

function LayoutContent({
  componentGroups,
  children,
}: {
  componentGroups: ComponentGroups;
  children: ReactNode;
}) {
  const pkg = useDocPackage();
  // 部品と AI のページは、カテゴリごとに開閉できる段にして並べる
  const catalogs: Catalogs = {
    '/:locale/ui/components': componentCategoriesOf(componentGroups),
    '/:locale/ui/ai': aiCategories,
  };
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // documentをスクローラーにしたため、サイドバーと目次は sticky で固定する。
  // ヘッダー高さはフォント読込やブレークポイントで変動するので実測し、
  // ページ側の目次と見出しの scroll-margin にも --header-h で渡す。
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const observer = new ResizeObserver(() => {
      setHeaderHeight(el.offsetHeight);
    });
    observer.observe(el);
    setHeaderHeight(el.offsetHeight);
    return () => {
      observer.disconnect();
    };
  }, []);

  // ページが throw したときは routes/[locale]/error.tsx がこの children の
  // 位置に描かれる（枠は残る）。境界はフレームワークが表に持つので、ここに
  // ErrorBoundary は無い。
  return (
    <div
      className="flex flex-1 flex-col"
      style={{ '--header-h': `${String(headerHeight)}px` } as CSSProperties}
    >
      <div className="bg-page sticky top-0 z-30 shrink-0" ref={headerRef}>
        <Navigation />
        {pkg !== undefined && (
          <div className="border-border-mute bg-page border-b lg:hidden">
            <div className={`${FRAME} flex items-center gap-2 py-2`}>
              <IconButton
                label={m.sideNav.openNavigation()}
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
              >
                <ListIcon />
              </IconButton>
              <span className="text-fg-mute text-sm">{pkg.name}</span>
            </div>
          </div>
        )}
      </div>
      {pkg === undefined ? (
        <>
          {/* ホームとランディングの本文は、枠の中でさらに狭い幅に置く。ヘッダーは
              どのページでも同じ枠なので、ページを移っても位置が変わらない */}
          <main className={`${FRAME} flex-1`}>
            <div className="mx-auto w-full max-w-6xl">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
          <Footer />
        </>
      ) : (
        <>
          <div className={`${FRAME} flex flex-1 gap-8`}>
            <aside
              aria-label={m.nav.packageNavigation()}
              className="border-border-mute sticky hidden w-64 shrink-0 self-start overflow-y-auto border-e py-8 pe-4 lg:block"
              style={{
                top: `${String(headerHeight)}px`,
                height: `calc(100dvh - ${String(headerHeight)}px)`,
              }}
            >
              <PackageSidebar catalogs={catalogs} pkg={pkg} />
            </aside>
            <main className="min-w-0 flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
          <Footer />
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => {
              setIsDrawerOpen(false);
            }}
            side="left"
            title={
              <Heading level="h3">
                <LocaleAnchor path={pkg.path}>{pkg.name}</LocaleAnchor>
              </Heading>
            }
          >
            <PackageSidebar
              catalogs={catalogs}
              onNavigate={() => {
                setIsDrawerOpen(false);
              }}
              pkg={pkg}
            />
          </Drawer>
        </>
      )}
    </div>
  );
}

/**
 * ロケール配下の枠そのもの。routes/[locale]/layout.tsx（Server Component、
 * paramsSchema を持つ）から呼ばれる。
 */
export function LocaleShell({
  locale: param,
  componentGroups,
  children,
}: {
  locale: string;
  componentGroups: ComponentGroups;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // 静的化された 404 は「ロケールを持たない 1 枚」で、そこに渡る :locale は
  // ビルドが使った番兵の区間。読んでいる人のロケールは URL にしか無いので、
  // そこから取り直す。あの 1 枚はブラウザで hydrate されず描き直されるので、
  // usePathname は最初から訪問者の URL を返す。
  const locale = locales.is(param)
    ? param
    : (locales.delocalize(pathname).locale ?? locales.default);

  // 実ページの lang はルートレイアウトがサーバーで書く。ここで直すのは
  // 404.html の 1 枚だけで、あれは番兵の URL で描かれているので、読んでいる
  // 人の URL が分かるのはブラウザで描いた後になる。
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // 遷移後にトップ（または #fragment）へ戻すのはルーターの仕事になったので、
  // ここにスクロールの処理は無い。
  return (
    <UIProvider>
      <WritingModeProvider>
        <div className="flex min-h-dvh flex-col">
          <LayoutContent componentGroups={componentGroups}>
            {children}
          </LayoutContent>
        </div>
      </WritingModeProvider>
    </UIProvider>
  );
}
