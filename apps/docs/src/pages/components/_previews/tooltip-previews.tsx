'use client';

import { Button, Tooltip } from '@k8ordo/ui';

export function TooltipBasicPreview() {
  return (
    <Tooltip.Root placement="bottom-start">
      <Tooltip.Trigger
        renderItem={(props) => (
          <Button type="button" {...props}>
            Hover me
          </Button>
        )}
      />
      <Tooltip.Content>
        <p>Supplementary information</p>
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

export function TooltipPlacementPreview() {
  return (
    <>
      <Tooltip.Root placement="top">
        <Tooltip.Trigger
          renderItem={(props) => (
            <Button type="button" {...props}>
              Top
            </Button>
          )}
        />
        <Tooltip.Content>
          <p>Top tooltip</p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root placement="right">
        <Tooltip.Trigger
          renderItem={(props) => (
            <Button type="button" {...props}>
              Right
            </Button>
          )}
        />
        <Tooltip.Content>
          <p>Right tooltip</p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root placement="bottom">
        <Tooltip.Trigger
          renderItem={(props) => (
            <Button type="button" {...props}>
              Bottom
            </Button>
          )}
        />
        <Tooltip.Content>
          <p>Bottom tooltip</p>
        </Tooltip.Content>
      </Tooltip.Root>
      <Tooltip.Root placement="left">
        <Tooltip.Trigger
          renderItem={(props) => (
            <Button type="button" {...props}>
              Left
            </Button>
          )}
        />
        <Tooltip.Content>
          <p>Left tooltip</p>
        </Tooltip.Content>
      </Tooltip.Root>
    </>
  );
}
