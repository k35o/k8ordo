'use client';

import { Badge, Button, Card, Heading, Switch } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../messages';

import page from '../../styles/page.module.css';
import styles from './vertical-demo.module.css';

export function VerticalDemo() {
  const [vertical, setVertical] = useState(true);

  return (
    <div className={styles.root}>
      <Switch
        checked={vertical}
        label={m.ui.demoVertical()}
        onChange={setVertical}
      />
      <div className={vertical ? `writing-v ${styles.vertical}` : 'writing-h'}>
        <Card width="fit">
          <div className={styles.body}>
            <Badge label={m.ui.demoBadge()} tone="info" />
            <Heading level="h3">{m.ui.demoHeading()}</Heading>
            <p className={page.mute}>{m.ui.demoBody()}</p>
            <Button variant="solid">{m.ui.demoButton()}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
