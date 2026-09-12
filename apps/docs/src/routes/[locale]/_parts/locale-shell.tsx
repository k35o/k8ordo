'use client';

import { useMatch, usePathname } from '@k8ordo/router';
import { UIProvider, Drawer, Heading, IconButton, ListIcon } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { Footer } from '../../../components/footer';
import { LocaleAnchor } from '../../../components/locale-anchor';
import { Navigation } from '../../../components/navigation';
import { SideNavigation } from '../../../components/side-navigation';
import { aiCategories } from '../../../data/ai-nav';
import { componentCategories } from '../../../data/components-nav';
import { helperCategories } from '../../../data/helpers-nav';
import { hookCategories } from '../../../data/hooks-nav';
import type { NavCategory } from '../../../data/nav-types';
import { LocaleProvider, locales, useTranslation } from '../../../i18n';
import { ThemeProvider } from '../../../theme/context';
import { WritingModeProvider } from '../../../theme/writing-mode-context';

type SideNavConfig = {
  categories: NavCategory[];
  titleKey: 'nav.components' | 'nav.hooks' | 'nav.helpers' | 'nav.ai';
  catalogPath: string;
};

type Section =
  | '/:locale/ui/components'
  | '/:locale/ui/hooks'
  | '/:locale/ui/helpers'
  | '/:locale/ui/ai';

/**
 * `pattern` の配下のページが開いているか。`/:locale/ui/components/*` は
 * /ja/ui/components/button に合い、一覧ページの /ja/ui/components 自身には
 * 合わない（末尾のスラッシュは正規化で落ちる）ので、一覧ページはサイドナビ
 * 無しのまま。パターンは生成された表に対して型で検査される。
 */
const useBelow = (pattern: Section): boolean =>
  useMatch(`${pattern}/*`) !== null;

function useSideNavConfig(): SideNavConfig | null {
  const components = useBelow('/:locale/ui/components');
  const hooks = useBelow('/:locale/ui/hooks');
  const helpers = useBelow('/:locale/ui/helpers');
  const ai = useBelow('/:locale/ui/ai');

  if (components) {
    return {
      categories: componentCategories,
      titleKey: 'nav.components',
      catalogPath: '/ui/components',
    };
  }
  if (hooks) {
    return {
      categories: hookCategories,
      titleKey: 'nav.hooks',
      catalogPath: '/ui/hooks',
    };
  }
  if (helpers) {
    return {
      categories: helperCategories,
      titleKey: 'nav.helpers',
      catalogPath: '/ui/helpers',
    };
  }
  if (ai) {
    return {
      categories: aiCategories,
      titleKey: 'nav.ai',
      catalogPath: '/ui/ai',
    };
  }
  return null;
}

function LayoutContent({ children }: { children: ReactNode }) {
  const sideNavConfig = useSideNavConfig();
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // documentをスクローラーにしたため、サイドバーは sticky で固定する。
  // ヘッダー高さはフォント読込やブレークポイントで変動するので実測して追従させる。
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
  return sideNavConfig ? (
    <>
      <div className="bg-bg-surface sticky top-0 z-30 shrink-0" ref={headerRef}>
        <Navigation />
        <div className="lg:hidden">
          <div className="border-border-mute bg-bg-surface flex items-center border-b px-4 py-2">
            <IconButton
              label={t('sideNav.openNavigation')}
              onClick={() => {
                setIsDrawerOpen(true);
              }}
            >
              <ListIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="flex flex-1">
        <aside
          className="border-border-mute sticky hidden w-60 shrink-0 self-start overflow-y-auto border-r px-3 py-4 lg:block"
          style={{
            top: `${headerHeight}px`,
            height: `calc(100dvh - ${headerHeight}px)`,
          }}
        >
          <SideNavigation categories={sideNavConfig.categories} />
        </aside>
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
        </main>
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
        }}
        side="left"
        title={
          <Heading level="h3">
            <LocaleAnchor path={sideNavConfig.catalogPath}>
              {t(sideNavConfig.titleKey)}
            </LocaleAnchor>
          </Heading>
        }
      >
        <SideNavigation
          categories={sideNavConfig.categories}
          onNavigate={() => {
            setIsDrawerOpen(false);
          }}
        />
      </Drawer>
    </>
  ) : (
    <>
      <div className="bg-bg-surface sticky top-0 z-30 shrink-0" ref={headerRef}>
        <Navigation />
      </div>
      {/* ラッパーはブロックのまま保つ。flexにするとページ側の mx-auto コンテナが
          flexアイテム化し、stretchが効かず中身のmin-content幅で横にあふれる */}
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="min-w-0 flex-1">{children}</div>
        <Footer />
      </main>
    </>
  );
}

/**
 * ロケール配下の枠そのもの。routes/[locale]/layout.tsx（Server Component、
 * paramsSchema を持つ）から呼ばれる。
 */
export function LocaleShell({
  locale: param,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // 静的化された 404 は「ロケールを持たない 1 枚」で、そこに渡る :locale は
  // ビルドが使った番兵の区間。読んでいる人のロケールは URL にしか無いので、
  // そこから取り直す。usePathname はサーバーの値で hydrate してからクライアント
  // の値に切り替わるので、mismatch にはならず 1 度描き直されるだけ。
  const locale = locales.is(param)
    ? param
    : (locales.delocalize(pathname).locale ?? locales.default);

  // 実ページの lang はルートレイアウトがサーバーで書く。ここで直すのは
  // 404.html の 1 枚だけで、あれは番兵の URL で描かれているので、読んでいる
  // 人の URL が分かるのは hydrate した後になる。
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // 遷移後にトップ（または #fragment）へ戻すのはルーターの仕事になったので、
  // ここにスクロールの処理は無い。
  return (
    <LocaleProvider locale={locale}>
      <UIProvider messages={locale === 'en' ? en : undefined}>
        <ThemeProvider>
          <WritingModeProvider>
            <div className="flex min-h-dvh flex-col">
              <LayoutContent>{children}</LayoutContent>
            </div>
          </WritingModeProvider>
        </ThemeProvider>
      </UIProvider>
    </LocaleProvider>
  );
}
