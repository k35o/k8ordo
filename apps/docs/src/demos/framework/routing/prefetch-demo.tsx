'use client';

import { Code } from '@k8ordo/ui';
import { useEffect, useState } from 'react';

import { LocaleAnchor } from '../../../components/locale-anchor';
import * as m from '../../../messages';

import styles from './prefetch-demo.module.css';

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
    <div className={styles.root}>
      <div className={styles.links}>
        <LocaleAnchor path="/:locale/framework/params">
          {t.demoLinkFetched()}
        </LocaleAnchor>
        <div className={styles.optedOut} data-k8ordo-prefetch={false}>
          <span className={styles.optedOutLabel}>{t.demoOptedOut()}</span>
          <LocaleAnchor path="/:locale/framework/deploy">
            {t.demoLinkSkipped()}
          </LocaleAnchor>
        </div>
      </div>
      <div className={styles.fetched}>
        <p className={styles.fetchedLabel}>{t.demoFetched()}</p>
        {fetched.length === 0 ? (
          <p className={styles.none}>{t.demoNone()}</p>
        ) : (
          <ol className={styles.fetchedList}>
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
