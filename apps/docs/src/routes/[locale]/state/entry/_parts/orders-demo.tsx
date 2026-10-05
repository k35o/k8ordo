'use client';

import type { Message } from '@k8ordo/i18n';
import { definePageState, useAppState } from '@k8ordo/state';
import { Badge, Button, ChevronIcon, Code } from '@k8ordo/ui';
import { useId } from 'react';
import * as z from 'zod/mini';

import * as m from '../../../../../messages';

const t = m.stateEntry;

const STATUSES = ['all', 'pending', 'shipped'] as const;

const STATUS_LABEL: Record<(typeof STATUSES)[number], Message> = {
  all: t.demoAll,
  pending: t.demoPending,
  shipped: t.demoShipped,
};

const ORDERS = [
  { id: 'A-101', status: 'shipped', detail: t.demoDetail101 },
  { id: 'A-102', status: 'pending', detail: t.demoDetail102 },
  { id: 'A-103', status: 'pending', detail: t.demoDetail103 },
] as const;

// 絞り込みは URL（共有される面）、開いている注文は履歴エントリ（隠れた面）。
// クライアントだけが読むので、定義はこのモジュールに置いている
/* oxlint-disable no-underscore-dangle -- `_default` は zod/mini における
   `.default()` の綴り */
const ordersState = definePageState('state-entry-demo', {
  url: z.object({
    status: z._default(z.enum(STATUSES), 'all'),
  }),
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
  }),
});
/* oxlint-enable no-underscore-dangle */

export function OrdersDemo() {
  const [{ status, expanded }, update] = useAppState(ordersState);
  const filterLabel = useId();
  const search = ordersState.search({ status });
  const visible = ORDERS.filter(
    (order) => status === 'all' || order.status === status,
  );

  return (
    <div className="flex flex-col gap-6">
      <div
        aria-labelledby={filterLabel}
        className="flex flex-wrap items-center gap-2"
        role="group"
      >
        <span className="text-fg-mute me-2 text-sm" id={filterLabel}>
          {t.demoFilter()}
        </span>
        {STATUSES.map((value) => (
          <Button
            aria-pressed={value === status}
            color={value === status ? 'primary' : 'base'}
            key={value}
            onClick={() => {
              update({ status: value }, { history: 'push' });
            }}
            size="sm"
            variant={value === status ? 'solid' : 'outline'}
          >
            {STATUS_LABEL[value]()}
          </Button>
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {visible.map((order) => {
          const open = expanded.includes(order.id);
          return (
            <li
              className="border-border-mute flex flex-col gap-2 rounded-lg border px-3 py-2"
              key={order.id}
            >
              <div className="flex items-center justify-between gap-3">
                <Button
                  aria-expanded={open}
                  color="base"
                  onClick={() => {
                    update((current) => ({
                      expanded: current.expanded.includes(order.id)
                        ? current.expanded.filter((id) => id !== order.id)
                        : [...current.expanded, order.id],
                    }));
                  }}
                  size="sm"
                  startIcon={<ChevronIcon direction={open ? 'down' : 'right'} />}
                  variant="skeleton"
                >
                  {order.id}
                </Button>
                <Badge
                  label={STATUS_LABEL[order.status]()}
                  tone={order.status === 'pending' ? 'warning' : 'success'}
                />
              </div>
              {open && (
                <p className="text-fg-mute ps-9 text-sm">{order.detail()}</p>
              )}
            </li>
          );
        })}
      </ul>
      <dl className="bg-bg-surface grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 rounded-lg px-4 py-3 text-sm">
        <dt className="text-fg-mute">url</dt>
        <dd className="break-all">
          <Code>{search === '' ? t.demoQueryEmpty() : `?${search}`}</Code>
        </dd>
        <dt className="text-fg-mute">entry</dt>
        <dd className="break-all">
          <Code>{JSON.stringify({ expanded })}</Code>
        </dd>
      </dl>
    </div>
  );
}
