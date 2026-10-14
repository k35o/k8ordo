'use client';

import type { Message } from '@k8ordo/i18n';
import { definePageState, useAppState } from '@k8ordo/state';
import { Badge, Button, ChevronIcon, Code } from '@k8ordo/ui';
import { useId } from 'react';
import * as z from 'zod/mini';

import { jsLiteral } from '../../../components/js-literal';
import * as m from '../../../messages';

import styles from './orders-demo.module.css';

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
const ordersState = definePageState('state-entry-demo', {
  url: z.object({
    status: z._default(z.enum(STATUSES), 'all'),
  }),
  entry: z.object({
    expanded: z._default(z.array(z.string()), []),
  }),
});

export function OrdersDemo() {
  const [{ status, expanded }, update] = useAppState(ordersState);
  const filterLabel = useId();
  const search = ordersState.search({ status });
  const visible = ORDERS.filter(
    (order) => status === 'all' || order.status === status,
  );

  return (
    <div className={styles.root}>
      <div aria-labelledby={filterLabel} className={styles.filter} role="group">
        <span className={styles.filterLabel} id={filterLabel}>
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
      <ul className={styles.list}>
        {visible.map((order) => {
          const open = expanded.includes(order.id);
          return (
            <li className={styles.order} key={order.id}>
              <div className={styles.orderHeader}>
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
                  startIcon={
                    <ChevronIcon direction={open ? 'down' : 'right'} />
                  }
                  variant="skeleton"
                >
                  {order.id}
                </Button>
                <Badge
                  label={STATUS_LABEL[order.status]()}
                  tone={order.status === 'pending' ? 'warning' : 'success'}
                />
              </div>
              {open && <p className={styles.detail}>{order.detail()}</p>}
            </li>
          );
        })}
      </ul>
      <dl className={styles.values}>
        <dt className={styles.term}>url</dt>
        <dd className={styles.value}>
          <Code>{search === '' ? t.demoQueryEmpty() : `?${search}`}</Code>
        </dd>
        <dt className={styles.term}>entry</dt>
        <dd className={styles.value}>
          <Code>{jsLiteral({ expanded })}</Code>
        </dd>
      </dl>
    </div>
  );
}
