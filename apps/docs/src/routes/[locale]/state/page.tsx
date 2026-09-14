'use client';

import { definePageState, useAppState } from '@k8ordo/state';
import {
  AtomIcon,
  Button,
  Code,
  Heading,
  HistoryIcon,
  LinkIcon,
  ListIcon,
  LocationIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
} from '@k8ordo/ui';
import * as z from 'zod/mini';

import { PackageLanding } from '../../../components/package-landing';
import type { PackageFeature } from '../../../components/package-landing';
import { Rich } from '../../../components/rich';
import * as m from '../../../messages';
import { themeState } from '../../../theme/state';

const FEATURES: PackageFeature[] = [
  {
    title: m.state.featurePlaces,
    description: m.state.featurePlacesDescription,
    icon: <LocationIcon />,
  },
  {
    title: m.state.featureSchema,
    description: m.state.featureSchemaDescription,
    icon: <AtomIcon />,
  },
  {
    title: m.state.featureNavigation,
    description: m.state.featureNavigationDescription,
    icon: <HistoryIcon />,
  },
  {
    title: m.state.featureKeys,
    description: m.state.featureKeysDescription,
    icon: <ListIcon />,
  },
  {
    title: m.state.featureCanonical,
    description: m.state.featureCanonicalDescription,
    icon: <ShieldCheckIcon />,
  },
  {
    title: m.state.featureServer,
    description: m.state.featureServerDescription,
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

const TABS = ['overview', 'details', 'reviews'] as const;

function Demo() {
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
            <Code>{search === '' ? m.state.demoUrlEmpty() : `?${search}`}</Code>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-fg-mute">theme</dt>
          <dd>
            <Code>{mode ?? m.state.demoThemeSystem()}</Code>
          </dd>
        </div>
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <Rich>{m.state.demoHint()}</Rich>
      </p>
    </div>
  );
}

export default function State() {
  return (
    <PackageLanding
      description={m.state.description}
      directory="state"
      docsDescription={m.state.docsDescription}
      docsTitle={m.state.docsTitle}
      features={FEATURES}
      featuresTitle={m.state.featuresTitle}
      name="@k8ordo/state"
    >
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 md:px-8">
        <Heading level="h2">
          <Rich>{m.state.demoTitle()}</Rich>
        </Heading>
        <p className="text-fg-mute mt-4 max-w-2xl text-sm leading-relaxed">
          <Rich>{m.state.demoDescription()}</Rich>
        </p>
        <div className="mt-6 max-w-2xl">
          <Demo />
        </div>
      </section>
    </PackageLanding>
  );
}
