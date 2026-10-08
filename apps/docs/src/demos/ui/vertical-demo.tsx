'use client';

import { Badge, Button, Card, Heading, Switch } from '@k8ordo/ui';
import { useState } from 'react';

import * as m from '../../messages';

export function VerticalDemo() {
  const [vertical, setVertical] = useState(true);

  return (
    <div className="flex flex-col gap-6">
      <Switch
        checked={vertical}
        label={m.ui.demoVertical()}
        onChange={setVertical}
      />
      <div className={vertical ? 'writing-v h-72 self-start' : 'writing-h'}>
        <Card width="fit">
          <div className="flex flex-col items-start gap-3 p-6">
            <Badge label={m.ui.demoBadge()} tone="info" />
            <Heading level="h3">{m.ui.demoHeading()}</Heading>
            <p className="text-fg-mute">{m.ui.demoBody()}</p>
            <Button variant="solid">{m.ui.demoButton()}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
