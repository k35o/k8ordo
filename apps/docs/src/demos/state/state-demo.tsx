'use client';

import { useAppState } from '@k8ordo/state';
import { Button, Code, IconButton, MinusIcon, PlusIcon } from '@k8ordo/ui';

import { jsLiteral } from '../../components/js-literal';
import * as m from '../../messages';
import { TABS, demoState } from './demo-state';

import styles from './state-demo.module.css';

export function StateDemo() {
  const [current, update] = useAppState(demoState);
  const search = demoState.search(current);

  return (
    <div className={styles.root}>
      <div className={styles.controls}>
        <div className={styles.tabs}>
          <span className={styles.label}>
            <Code>tab</Code>
          </span>
          {TABS.map((value) => (
            <Button
              color={value === current.tab ? 'primary' : 'base'}
              key={value}
              onAction={() => {
                update({ tab: value });
              }}
              size="sm"
              variant={value === current.tab ? 'solid' : 'outline'}
            >
              {value}
            </Button>
          ))}
        </div>
        <div className={styles.pager}>
          <span className={styles.label}>
            <Code>page</Code>
          </span>
          <IconButton
            color="base"
            label={m.state.demoPrevious()}
            onAction={() => {
              update({ page: current.page - 1 }, { history: 'push' });
            }}
            size="sm"
          >
            <MinusIcon />
          </IconButton>
          <span className={styles.page}>{current.page}</span>
          <IconButton
            color="base"
            label={m.state.demoNext()}
            onAction={() => {
              update({ page: current.page + 1 }, { history: 'push' });
            }}
            size="sm"
          >
            <PlusIcon />
          </IconButton>
        </div>
      </div>
      <dl className={styles.values}>
        <dt className={styles.term}>URL</dt>
        <dd className={styles.value}>
          <Code>{search === '' ? m.state.demoUrlEmpty() : `?${search}`}</Code>
        </dd>
        <dt className={styles.term}>state</dt>
        <dd className={styles.value}>
          <Code>{jsLiteral(current)}</Code>
        </dd>
      </dl>
    </div>
  );
}
