'use client';

import { usePathname } from '@k8ordo/router';
import { UIProvider, Drawer, Heading, IconButton, ListIcon } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '../../components/error-fallback';
import { Footer } from '../../components/footer';
import { LocaleAnchor } from '../../components/locale-anchor';
import { Navigation } from '../../components/navigation';
import { ScrollToTopOnNavigate } from '../../components/scroll-to-top';
import { SideNavigation } from '../../components/side-navigation';
import { aiCategories } from '../../data/ai-nav';
import { componentCategories } from '../../data/components-nav';
import { helperCategories } from '../../data/helpers-nav';
import { hookCategories } from '../../data/hooks-nav';
import type { NavCategory } from '../../data/nav-types';
import type { Locale } from '../../i18n';
import {
  DEFAULT_LOCALE,
  isLocale,
  LocaleProvider,
  useLocale,
  useTranslation,
} from '../../i18n';
import { ThemeProvider } from '../../theme/context';
import { WritingModeProvider } from '../../theme/writing-mode-context';

/** URL の先頭区間。404 の 1 枚がどのロケールで読まれているかはここにしか無い。 */
const localeOf = (pathname: string): Locale | null => {
  const first = pathname.split('/')[1] ?? '';
  return isLocale(first) ? first : null;
};

type SideNavConfig = {
  categories: NavCategory[];
  titleKey: 'nav.components' | 'nav.hooks' | 'nav.helpers' | 'nav.ai';
  catalogPath: string;
};

function useSideNavConfig(): SideNavConfig | null {
  const pathname = usePathname();

  // /ja/ui/components/button → match, /ja/ui/components → no match
  if (/^\/[^/]+\/ui\/components\/.+/u.test(pathname)) {
    return {
      categories: componentCategories,
      titleKey: 'nav.components',
      catalogPath: '/ui/components',
    };
  }

  // /ja/ui/hooks/use-click-away → match, /ja/ui/hooks → no match
  if (/^\/[^/]+\/ui\/hooks\/.+/u.test(pathname)) {
    return {
      categories: hookCategories,
      titleKey: 'nav.hooks',
      catalogPath: '/ui/hooks',
    };
  }

  // /ja/ui/helpers/cn → match, /ja/ui/helpers → no match
  if (/^\/[^/]+\/ui\/helpers\/.+/u.test(pathname)) {
    return {
      categories: helperCategories,
      titleKey: 'nav.helpers',
      catalogPath: '/ui/helpers',
    };
  }

  // /ja/ui/ai/chat → match, /ja/ui/ai → no match
  if (/^\/[^/]+\/ui\/ai\/.+/u.test(pathname)) {
    return {
      categories: aiCategories,
      titleKey: 'nav.ai',
      catalogPath: '/ui/ai',
    };
  }

  return null;
}

function PageWithErrorBoundary({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorFallback
          locale={locale}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      resetKeys={[pathname]}
    >
      {children}
    </ErrorBoundary>
  );
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
          <div className="flex-1">
            <PageWithErrorBoundary>{children}</PageWithErrorBoundary>
          </div>
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
        <div className="min-w-0 flex-1">
          <PageWithErrorBoundary>{children}</PageWithErrorBoundary>
        </div>
        <Footer />
      </main>
    </>
  );
}

export default function LocaleLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  // 静的化された 404 は「ロケールを持たない 1 枚」で、そこに渡る :locale は
  // ビルドが使った番兵の区間。読んでいる人のロケールは URL にしか無いので、
  // そこから取り直す。usePathname はサーバーの値で hydrate してからクライアント
  // の値に切り替わるので、mismatch にはならず 1 度描き直されるだけ。
  const locale = isLocale(params.locale)
    ? params.locale
    : (localeOf(pathname) ?? DEFAULT_LOCALE);

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorFallback
          fullScreen
          locale={locale}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      resetKeys={[pathname]}
    >
      <LocaleProvider locale={locale}>
        <UIProvider messages={locale === 'en' ? en : undefined}>
          <ThemeProvider>
            <WritingModeProvider>
              <div className="flex min-h-dvh flex-col">
                <ScrollToTopOnNavigate />
                <LayoutContent>{children}</LayoutContent>
              </div>
            </WritingModeProvider>
          </ThemeProvider>
        </UIProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
