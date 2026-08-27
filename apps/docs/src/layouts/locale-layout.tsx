'use client';

import { Outlet, useLocation } from '@funstack/router';
import { UIProvider, Drawer, Heading, IconButton, ListIcon } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';
import { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '../components/error-fallback';
import { Footer } from '../components/footer';
import { LocaleAnchor } from '../components/locale-anchor';
import { Navigation } from '../components/navigation';
import { SideNavigation } from '../components/side-navigation';
import { aiCategories } from '../data/ai-nav';
import { componentCategories } from '../data/components-nav';
import { helperCategories } from '../data/helpers-nav';
import { hookCategories } from '../data/hooks-nav';
import type { NavCategory } from '../data/nav-types';
import {
  detectLocale,
  isLocale,
  LocaleProvider,
  useLocale,
  useTranslation,
} from '../i18n';
import { ThemeProvider } from '../theme/context';
import { WritingModeProvider } from '../theme/writing-mode-context';

type SideNavConfig = {
  categories: NavCategory[];
  titleKey: 'nav.components' | 'nav.hooks' | 'nav.helpers' | 'nav.ai';
  catalogPath: string;
};

function useSideNavConfig(): SideNavConfig | null {
  const location = useLocation();
  const { pathname } = location;

  // /ja/components/button → match, /ja/components → no match
  if (/^\/[^/]+\/components\/.+/u.test(pathname)) {
    return {
      categories: componentCategories,
      titleKey: 'nav.components',
      catalogPath: '/components',
    };
  }

  // /ja/hooks/use-click-away → match, /ja/hooks → no match
  if (/^\/[^/]+\/hooks\/.+/u.test(pathname)) {
    return {
      categories: hookCategories,
      titleKey: 'nav.hooks',
      catalogPath: '/hooks',
    };
  }

  // /ja/helpers/cn → match, /ja/helpers → no match
  if (/^\/[^/]+\/helpers\/.+/u.test(pathname)) {
    return {
      categories: helperCategories,
      titleKey: 'nav.helpers',
      catalogPath: '/helpers',
    };
  }

  // /ja/ai/chat → match, /ja/ai → no match
  if (/^\/[^/]+\/ai\/.+/u.test(pathname)) {
    return {
      categories: aiCategories,
      titleKey: 'nav.ai',
      catalogPath: '/ai',
    };
  }

  return null;
}

function OutletWithErrorBoundary() {
  const location = useLocation();
  const locale = useLocale();

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorFallback
          locale={locale}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      resetKeys={[location.entryId]}
    >
      <Outlet />
    </ErrorBoundary>
  );
}

function LayoutContent() {
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
            <OutletWithErrorBoundary />
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
          <OutletWithErrorBoundary />
        </div>
        <Footer />
      </main>
    </>
  );
}

export function LocaleLayout({ params }: { params: { locale: string } }) {
  const location = useLocation();
  const localeParam = params.locale;

  useEffect(() => {
    if (isLocale(localeParam)) {
      document.documentElement.lang = localeParam;
    }
  }, [localeParam]);

  if (!isLocale(localeParam)) {
    navigation.navigate(`/${detectLocale()}/`, { history: 'replace' });
    return null;
  }

  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => (
        <ErrorFallback
          fullScreen
          locale={localeParam}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
      resetKeys={[location.entryId]}
    >
      <LocaleProvider locale={localeParam}>
        <UIProvider messages={localeParam === 'en' ? en : undefined}>
          <ThemeProvider>
            <WritingModeProvider>
              <div className="flex min-h-dvh flex-col">
                <LayoutContent />
              </div>
            </WritingModeProvider>
          </ThemeProvider>
        </UIProvider>
      </LocaleProvider>
    </ErrorBoundary>
  );
}
