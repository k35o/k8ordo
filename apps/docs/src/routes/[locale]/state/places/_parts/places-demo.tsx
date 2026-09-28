'use client';

import type { Message } from '@k8ordo/i18n';
import { definePageState, useAppState } from '@k8ordo/state';
import { Button, ChevronIcon, Code } from '@k8ordo/ui';
import { useId } from 'react';
import * as z from 'zod/mini';

import { Rich } from '../../../../../components/rich';
import * as m from '../../../../../messages';

const SCOPES = ['page', 'app'] as const;

type Scope = (typeof SCOPES)[number];

const PLACES = [
  'url',
  'entry',
  'local',
  'session',
  'cookie',
  'memory',
] as const;

type Place = (typeof PLACES)[number];

const PLACES_IN: Record<Scope, readonly Place[]> = {
  page: ['url', 'entry'],
  app: ['local', 'session', 'cookie', 'memory'],
};

const SUMMARY: Record<Place, Message> = {
  url: m.statePlaces.demoRowUrl,
  entry: m.statePlaces.demoRowEntry,
  local: m.statePlaces.demoRowLocal,
  session: m.statePlaces.demoRowSession,
  cookie: m.statePlaces.demoRowCookie,
  memory: m.statePlaces.demoRowMemory,
};

// scope は URL（共有される面）、開いている行は履歴エントリ（隠れた面）。
// 同じ定義の 2 つのスロットなので、scope を push で切り替えると開いている行も
// 新しいエントリへ持ち越され、戻るで両方が一緒に戻る。
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const placesDemoState = definePageState('state-places-demo', {
  url: z.object({
    scope: z._default(z.enum(SCOPES), 'page'),
  }),
  entry: z.object({
    open: z._default(z.array(z.enum(PLACES)), []),
  }),
});
/* oxlint-enable no-underscore-dangle */

export function PlacesDemo() {
  const [{ scope, open }, update] = useAppState(placesDemoState);
  const scopeLabel = useId();
  const search = placesDemoState.search({ scope });

  return (
    <div className="border-border-mute flex flex-col gap-6 rounded-lg border p-6">
      <div
        aria-labelledby={scopeLabel}
        className="flex flex-wrap items-center gap-2"
        role="group"
      >
        <span className="w-16 text-sm" id={scopeLabel}>
          <Code>scope</Code>
        </span>
        {SCOPES.map((value) => (
          <Button
            aria-pressed={value === scope}
            color={value === scope ? 'primary' : 'base'}
            key={value}
            onClick={() => {
              update({ scope: value }, { history: 'push' });
            }}
            size="sm"
            variant={value === scope ? 'solid' : 'outline'}
          >
            {value}
          </Button>
        ))}
      </div>
      <ul className="flex flex-col gap-3">
        {PLACES_IN[scope].map((place) => {
          const isOpen = open.includes(place);
          return (
            <li className="flex flex-col gap-2" key={place}>
              <Button
                aria-expanded={isOpen}
                color="base"
                onClick={() => {
                  update((current) => ({
                    open: current.open.includes(place)
                      ? current.open.filter((other) => other !== place)
                      : [...current.open, place],
                  }));
                }}
                size="sm"
                startIcon={
                  <ChevronIcon direction={isOpen ? 'down' : 'right'} />
                }
                variant="skeleton"
              >
                {place}
              </Button>
              {isOpen && (
                <p className="text-fg-mute pl-4 text-sm leading-relaxed">
                  <Rich>{SUMMARY[place]()}</Rich>
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex gap-3">
          <dt className="text-fg-mute w-12">URL</dt>
          <dd className="break-all">
            <Code>
              {search === '' ? m.statePlaces.demoUrlEmpty() : `?${search}`}
            </Code>
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-fg-mute w-12">entry</dt>
          <dd className="break-all">
            <Code>{JSON.stringify({ [placesDemoState.key]: { open } })}</Code>
          </dd>
        </div>
      </dl>
      <p className="text-fg-mute text-sm leading-relaxed">
        <Rich>{m.statePlaces.demoHint()}</Rich>
      </p>
    </div>
  );
}
