'use client';

import { Code } from '@k8ordo/ui';
import { useEffect, useState } from 'react';

import { LocaleAnchor } from '../../../components/locale-anchor';
import * as m from '../../../messages';

type Fetched = { pathname: string; at: number };

/**
 * Lists every RSC payload this page fetched, read off the browser's resource
 * timing: the prefetch it shows is the site's real one, since the site runs
 * on `@k8ordo/framework`'s static mode, not a simulation of it.
 */
export function PrefetchDemo() {
  const [fetched, setFetched] = useState<readonly Fetched[]>([]);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const payloads = list
        .getEntries()
        .map((entry) => ({
          pathname: new URL(entry.name).pathname,
          at: entry.startTime,
        }))
        .filter((entry) => entry.pathname.endsWith('/index.rsc'));
      if (payloads.length === 0) return;
      setFetched((current) => [...current, ...payloads]);
    });
    observer.observe({ type: 'resource' });
    return () => {
      observer.disconnect();
    };
  }, []);

  const t = m.frameworkRouting;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <LocaleAnchor path="/:locale/framework/params">
          {t.demoLinkFetched()}
        </LocaleAnchor>
        <div
          className="border-border-mute flex flex-col gap-1 rounded-lg border border-dashed px-4 py-3"
          data-k8ordo-prefetch={false}
        >
          <span className="text-fg-mute text-xs">{t.demoOptedOut()}</span>
          <LocaleAnchor path="/:locale/framework/deploy">
            {t.demoLinkSkipped()}
          </LocaleAnchor>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-fg-base text-sm font-bold">{t.demoFetched()}</p>
        {fetched.length === 0 ? (
          <p className="text-fg-mute text-sm">{t.demoNone()}</p>
        ) : (
          <ol className="flex list-decimal flex-col gap-1 ps-5 text-sm">
            {fetched.map((entry) => (
              <li key={`${entry.pathname}@${String(entry.at)}`}>
                <Code>{entry.pathname}</Code>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
