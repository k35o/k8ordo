'use client';

import { defineLocalState, definePageState, useAppState } from '@k8ordo/state';
import {
  AtomIcon,
  Button,
  Code,
  GitHubIcon,
  Heading,
  HistoryIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';
import * as z from 'zod/mini';

import { T } from '../../../components/t';
import { localizeHref, useTranslation } from '../../../i18n';
import type { MessageKey } from '../../../i18n/types';

type Feature = {
  title: MessageKey;
  description: MessageKey;
  icon: ReactNode;
};

const FEATURES: Feature[] = [
  {
    title: 'state.featurePlaces',
    description: 'state.featurePlacesDescription',
    icon: <LocationIcon />,
  },
  {
    title: 'state.featureSchema',
    description: 'state.featureSchemaDescription',
    icon: <AtomIcon />,
  },
  {
    title: 'state.featureNavigation',
    description: 'state.featureNavigationDescription',
    icon: <HistoryIcon />,
  },
  {
    title: 'state.featureKeys',
    description: 'state.featureKeysDescription',
    icon: <ListIcon />,
  },
  {
    title: 'state.featureCanonical',
    description: 'state.featureCanonicalDescription',
    icon: <ShieldCheckIcon />,
  },
  {
    title: 'state.featureServer',
    description: 'state.featureServerDescription',
    icon: <LinkIcon />,
  },
];

// このページ自身が使い方の実演で、URL を書き換えるのは本物の
// definePageState。サイトのルーター（@k8ordo/router）が Navigation API を
// intercept しているので、update() はクライアント遷移として流れる。
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const demoState = definePageState('state-demo', {
  url: z.object({
    tab: z._default(z.enum(['overview', 'details', 'reviews']), 'overview'),
    page: z._default(z.coerce.number().check(z.int(), z.gte(1)), 1),
  }),
});
/* oxlint-enable no-underscore-dangle */

// テーマの保存にもこのパッケージを使っている（src/theme/context.tsx）。
// ここでは同じ localStorage 状態を購読して現在値を見せるだけにする。
const themeState = defineLocalState(
  'theme',
  z.object({ mode: z.optional(z.enum(['light', 'dark'])) }),
);

const TABS = ['overview', 'details', 'reviews'] as const;

function Demo() {
  const { t } = useTranslation();
  const [{ tab, page }, update] = useAppState(demoState);
  const [{ mode }] = useAppState(themeState);

  const search = demoState.search({ tab, page });

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-sm">
          <Code>tab</Code>
        </span>
        {TABS.map((value) => (
          <Button
            color={value === tab ? 'primary' : 'base'}
            key={value}
            onClick={() => {
              update({ tab: value });
            }}
            size="sm"
            variant={value === tab ? 'solid' : 'outline'}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-sm">
          <Code>page</Code>
        </span>
        <Button
          aria-label="-1"
          color="base"
          onClick={() => {
            update({ page: page - 1 }, { history: 'push' });
          }}
          size="sm"
          startIcon={<MinusIcon />}
          variant="outline"
        >
          1
        </Button>
        <span className="text-fg-base min-w-8 text-center text-sm">{page}</span>
        <Button
          aria-label="+1"
          color="base"
          onClick={() => {
            update({ page: page + 1 }, { history: 'push' });
          }}
          size="sm"
          startIcon={<PlusIcon />}
          variant="outline"
        >
          1
        </Button>
      </div>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex gap-3">
          <dt className="text-fg-mute">URL</dt>
          <dd className="break-all">
            <Code>
              {search === '' ? t('state.demoUrlEmpty') : `?${search}`}
            </Code>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-fg-mute">theme</dt>
          <dd>
            <Code>{mode ?? t('state.demoThemeSystem')}</Code>
          </dd>
        </div>
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <T k="state.demoHint" />
      </p>
    </div>
  );
}

export default function State() {
  const { t, locale } = useTranslation();

  return (
    <div className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="flex max-w-2xl flex-col justify-center gap-8">
          <Heading level="h1">@k8ordo/state</Heading>
          <p className="text-fg-mute break-phrase text-lg leading-relaxed">
            {t('state.description')}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://www.npmjs.com/package/@k8ordo/state"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              variant="solid"
            >
              npm
            </Button>
            <Button
              color="base"
              renderItem={({ className, children }) => (
                <a
                  className={className}
                  href="https://github.com/k35o/k8ordo/tree/main/packages/state"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {children}
                </a>
              )}
              size="md"
              startIcon={<GitHubIcon />}
              variant="skeleton"
            >
              {t('common.github')}
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('state.demoTitle')}</Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <T k="state.demoDescription" />
        </p>
        <div className="mt-6 max-w-2xl">
          <Demo />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('state.featuresTitle')}</Heading>
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <li
              className="border-border-mute flex flex-col gap-3 rounded-lg border p-6"
              key={feature.title}
            >
              <span className="text-primary-border flex items-center gap-2">
                {feature.icon}
                <span className="text-fg-base font-medium">
                  {t(feature.title)}
                </span>
              </span>
              <span className="text-fg-mute text-sm leading-relaxed">
                <T k={feature.description} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">{t('state.docsTitle')}</Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <T k="state.docsDescription" />
        </p>
        <div className="mt-6">
          <Button
            color="base"
            renderItem={({ className, children }) => (
              <a className={className} href={localizeHref('/', locale)}>
                {children}
              </a>
            )}
            size="md"
            variant="skeleton"
          >
            {t('nav.home')}
          </Button>
        </div>
      </section>
    </div>
  );
}
