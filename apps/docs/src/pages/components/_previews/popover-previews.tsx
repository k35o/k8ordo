'use client';

import { Button, Popover } from '@k8ordo/ui';

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
      <Popover.Content
        renderItem={(props) => (
          <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
            <div role="menuitem">Popover content goes here.</div>
          </div>
        )}
      />
    </Popover.Root>
  );
}

export function PopoverPlacementPreview() {
  return (
    <>
      <Popover.Root placement="top">
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              Top
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <div role="menuitem">Top placement</div>
            </div>
          )}
        />
      </Popover.Root>
      <Popover.Root placement="right">
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              Right
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <div role="menuitem">Right placement</div>
            </div>
          )}
        />
      </Popover.Root>
      <Popover.Root placement="bottom">
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              Bottom
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <div role="menuitem">Bottom placement</div>
            </div>
          )}
        />
      </Popover.Root>
      <Popover.Root placement="left">
        <Popover.Trigger
          renderItem={(props) => (
            <Button {...props} size="md" type="button">
              Left
            </Button>
          )}
        />
        <Popover.Content
          renderItem={(props) => (
            <div className="bg-bg-raised rounded-lg p-4 shadow-md" {...props}>
              <div role="menuitem">Left placement</div>
            </div>
          )}
        />
      </Popover.Root>
    </>
  );
}
