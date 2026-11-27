'use client';

import { Card } from '@k8ordo/ui';
import { useState } from 'react';

import styles from './card-previews.module.css';

export function CardActionPreview() {
  const [chosen, setChosen] = useState(false);
  return (
    <Card
      action={() => {
        setChosen(true);
      }}
    >
      <div className={styles.body}>
        <h3 className={styles.title}>Go with this plan</h3>
        <p className={styles.note}>{chosen ? 'Chosen' : 'Press the card'}</p>
      </div>
    </Card>
  );
}
