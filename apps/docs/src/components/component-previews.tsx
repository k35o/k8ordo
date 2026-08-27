'use client';

import {
  Accordion,
  Alert,
  Anchor,
  AtomIcon,
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  CheckboxCard,
  CloseIcon,
  Code,
  Dialog,
  DropdownMenu,
  FileField,
  Form,
  FormControl,
  Heading,
  IconButton,
  ListBox,
  NumberField,
  Pagination,
  PaletteIcon,
  PasswordInput,
  Popover,
  Progress,
  Radio,
  RadioCard,
  Select,
  Separator,
  Skeleton,
  Slider,
  SparklesIcon,
  Spinner,
  Switch,
  Table,
  Tabs,
  TextField,
  Textarea,
  Tooltip,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useState } from 'react';

const selectOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const autocompleteOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

const radioOptions = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
] as const;

const radioCardOptions = [
  { value: 'starter', label: 'Starter' },
  { value: 'pro', label: 'Pro' },
] as const;

const checkboxCardOptions = [
  { value: 'history', label: 'Version history' },
  { value: 'comments', label: 'Inline comments' },
] as const;

const listBoxOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

/**
 * Decorative, display-only previews keyed by component name (must match the
 * `name` field in components-nav). Rendered inside an `inert` card stage.
 *
 * Most entries render the real component in a representative static state.
 * Transient/overlay components that would otherwise cover the page or require
 * open state (Drawer, Modal, Toast, Popover, DropdownMenu, ...) are shown via
 * their closed trigger instead.
 */
export const componentPreviews: Record<string, ReactNode> = {
  Button: <Button color="primary">Button</Button>,
  IconButton: (
    <IconButton label="Close">
      <CloseIcon size="sm" />
    </IconButton>
  ),
  Anchor: (
    <Anchor href="https://example.com" openInNewTab>
      External Link
    </Anchor>
  ),
  Tabs: (
    <div className="w-full">
      <Tabs.Root ids={['overview', 'settings']}>
        <Tabs.List label="Navigation">
          <Tabs.Tab id="overview">Overview</Tabs.Tab>
          <Tabs.Tab id="settings">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="overview">
          <p>Overview content.</p>
        </Tabs.Panel>
        <Tabs.Panel id="settings">
          <p>Settings content.</p>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  ),
  Breadcrumb: (
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link current href="/components">
          Components
        </Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  ),
  Pagination: <PaginationPreview />,
  TextField: <TextField placeholder="Enter your name" />,
  Textarea: <Textarea placeholder="Enter text" rows={3} />,
  NumberField: <NumberField placeholder="0" />,
  Select: (
    <Select
      aria-describedby={undefined}
      id="preview-select"
      options={selectOptions}
    />
  ),
  Checkbox: <Checkbox defaultChecked label="Checkbox" />,
  CheckboxCard: (
    <div className="w-full max-w-xs">
      <p className="sr-only" id="preview-checkbox-card">
        Features
      </p>
      <CheckboxCard
        aria-labelledby="preview-checkbox-card"
        defaultValue={['comments']}
        options={checkboxCardOptions}
      />
    </div>
  ),
  Switch: <Switch defaultChecked label="Switch" />,
  PasswordInput: <PasswordInputPreview />,
  Radio: (
    <div className="w-full max-w-xs">
      <p className="text-fg-base mb-2 font-medium" id="preview-radio">
        Framework
      </p>
      <Radio
        aria-labelledby="preview-radio"
        defaultValue="react"
        options={radioOptions}
      />
    </div>
  ),
  RadioCard: (
    <div className="w-full max-w-xs">
      <p className="sr-only" id="preview-radio-card">
        Plan
      </p>
      <RadioCard
        aria-labelledby="preview-radio-card"
        defaultValue="pro"
        options={radioCardOptions}
      />
    </div>
  ),
  Autocomplete: (
    <div className="w-full max-w-xs">
      <Autocomplete
        aria-describedby={undefined}
        defaultValue={[]}
        id="preview-autocomplete"
        options={autocompleteOptions}
      />
    </div>
  ),
  Slider: (
    <div className="w-40">
      <Slider defaultValue={60} />
    </div>
  ),
  FileField: (
    <FileField.Root accept="image/*" multiple={false}>
      <FileField.Trigger
        renderItem={({ disabled, onClick }) => (
          <Button disabled={disabled} onClick={onClick}>
            Select File
          </Button>
        )}
      />
    </FileField.Root>
  ),
  FormControl: (
    <div className="w-full max-w-xs">
      <FormControl
        label="Name"
        renderInput={(props) => (
          <TextField {...props} placeholder="Enter your name" />
        )}
      />
    </div>
  ),
  Form: (
    <Form action={() => undefined}>
      <FormControl
        label="Name"
        renderInput={(props) => <TextField {...props} name="name" />}
      />
      <Button type="submit">Submit</Button>
    </Form>
  ),
  Accordion: (
    <div className="w-full">
      <Accordion.Root>
        <Accordion.Item>
          <h3>
            <Accordion.Button>What is k8ordo UI?</Accordion.Button>
          </h3>
          <Accordion.Panel>
            <p>A React UI component library.</p>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
    </div>
  ),
  Avatar: <Avatar name="k8ordo UI" />,
  Badge: (
    <div className="flex gap-2">
      <Badge label="New" tone="info" />
      <Badge label="Stable" tone="success" />
    </div>
  ),
  Card: (
    <Card>
      <div className="p-6">Card content</div>
    </Card>
  ),
  Code: <Code>console.log()</Code>,
  Table: (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <Table.HeaderCell>Feature</Table.HeaderCell>
          <Table.HeaderCell align="right">Coverage</Table.HeaderCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Switch</Table.Cell>
          <Table.Cell align="right">100%</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
  Heading: <Heading level="h2">Section Title</Heading>,
  Alert: <Alert message="This is an info alert." tone="info" />,
  Skeleton: (
    <div className="w-40">
      <Skeleton />
    </div>
  ),
  Spinner: <Spinner />,
  Toast: <Button>Show Toast</Button>,
  Progress: (
    <div className="w-40">
      <Progress max={100} value={60} />
    </div>
  ),
  Dialog: (
    <div className="w-full max-w-xs">
      <Dialog.Root>
        <Dialog.Header onClose={() => undefined} title="Dialog Title" />
        <Dialog.Content>Dialog content here</Dialog.Content>
      </Dialog.Root>
    </div>
  ),
  Drawer: <Button>Open Drawer</Button>,
  Modal: <Button>Open Modal</Button>,
  Popover: (
    <Popover.Root>
      <Popover.Trigger
        renderItem={(props) => (
          <Button {...props} type="button">
            Open Popover
          </Button>
        )}
      />
    </Popover.Root>
  ),
  DropdownMenu: (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger label="Actions" />
    </DropdownMenu.Root>
  ),
  Tooltip: (
    <Tooltip.Root placement="bottom">
      <Tooltip.Trigger
        renderItem={(props) => (
          <Button type="button" {...props}>
            Hover me
          </Button>
        )}
      />
    </Tooltip.Root>
  ),
  ListBox: (
    <div className="w-56">
      <ListBox.Root
        onChange={() => undefined}
        options={listBoxOptions}
        value="apple"
      >
        <ListBox.Trigger />
      </ListBox.Root>
    </div>
  ),
  Separator: (
    <div className="w-40">
      <Separator color="mute" />
    </div>
  ),
  ScrollLinked: (
    <div className="w-40">
      <Progress max={100} value={40} />
    </div>
  ),
  Icons: (
    <div className="text-fg-base flex gap-3">
      <SparklesIcon size="lg" />
      <PaletteIcon size="lg" />
      <AtomIcon size="lg" />
    </div>
  ),
};

function PaginationPreview(): ReactNode {
  const [page, setPage] = useState(1);
  return (
    <div className="-mx-3 [&_button]:whitespace-nowrap">
      <Pagination
        currentPage={page}
        nextLabel="Next"
        onChange={setPage}
        prevLabel="Prev"
        totalPages={5}
      />
    </div>
  );
}

function PasswordInputPreview(): ReactNode {
  return <PasswordInput defaultValue="password" />;
}
