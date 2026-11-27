'use client';

import { Button, Popover } from '@k8ordo/ui';
import type { Placement } from '@k8ordo/ui';

import styles from './popover-previews.module.css';

export function PopoverBasicPreview() {
  return (
    <Popover.Root>
      <Popover.Trigger
        renderItem={(props) => (
          <Button {...props} size="md" type="button">
            Open Popover
          </Button>
        )}
      />
      <Popover.Content label="Details">
        <p className={styles.body}>Popover content goes here.</p>
      </Popover.Content>
    </Popover.Root>
  );
}

const PLACEMENTS = [
  ['top', 'Top'],
  ['right', 'Right'],
  ['bottom', 'Bottom'],
  ['left', 'Left'],
] as const satisfies ReadonlyArray<readonly [Placement, string]>;

export function PopoverPlacementPreview() {
  return (
    <>
      {PLACEMENTS.map(([placement, label]) => (
        <Popover.Root key={placement} placement={placement}>
          <Popover.Trigger
            renderItem={(props) => (
              <Button {...props} size="md" type="button">
                {label}
              </Button>
            )}
          />
          <Popover.Content label={`${label} placement`}>
            <p className={styles.body}>{label} placement</p>
          </Popover.Content>
        </Popover.Root>
      ))}
    </>
  );
}
