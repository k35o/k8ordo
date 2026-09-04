'use client';

import { Breadcrumb } from '@k8ordo/ui';

export function BreadcrumbBasicPreview() {
  return (
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/components/breadcrumb">
          Breadcrumb
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  );
}

export function BreadcrumbCurrentPagePreview() {
  return (
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current href="/components/breadcrumb">
          Breadcrumb
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  );
}

export function BreadcrumbSizesPreview() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Breadcrumb.List size="sm">
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link current href="/docs">
            Docs
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
      <Breadcrumb.List size="md">
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link current href="/docs">
            Docs
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
      <Breadcrumb.List size="lg">
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
          <Breadcrumb.Link current href="/docs">
            Docs
          </Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </div>
  );
}
