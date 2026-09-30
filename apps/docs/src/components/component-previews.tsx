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
  Calendar,
  Card,
  Carousel,
  Checkbox,
  CheckboxCard,
  CheckboxGroup,
  CloseIcon,
  Code,
  ColorPicker,
  Combobox,
  ContextMenu,
  CopyButton,
  CopyIcon,
  DataTable,
  DateField,
  DatePicker,
  Dialog,
  DropdownMenu,
  EmptyState,
  FileField,
  Form,
  FormControl,
  Grid,
  Heading,
  IconButton,
  InView,
  Kbd,
  LinkIcon,
  ListBox,
  NumberField,
  Pagination,
  PaletteIcon,
  PasswordInput,
  Popover,
  Prose,
  Progress,
  Radio,
  RadioCard,
  RangeSlider,
  Select,
  Resize,
  ResizablePanels,
  Separator,
  SideNav,
  Skeleton,
  Slider,
  SparklesIcon,
  Spinner,
  Stack,
  Stepper,
  Switch,
  Table,
  TableIcon,
  TableOfContents,
  Tabs,
  TextField,
  Textarea,
  Toolbar,
  Tooltip,
  Tree,
} from '@k8ordo/ui';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';

import type { ComponentNavName } from '../data/components-nav';

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
 * Server Components: they cannot render in this client module, so the page
 * renders them and hands them to the catalog.
 */
export type ServerPreviewName = 'CodeBlock';

/**
 * Decorative, display-only previews keyed by component name. Rendered inside
 * an `inert` card stage.
 *
 * Most entries render the real component in a representative static state.
 * Transient/overlay components that would otherwise cover the page or require
 * open state (Drawer, Modal, Toast, Popover, DropdownMenu, ...) are shown via
 * their closed trigger instead.
 */
export const componentPreviews = {
  Button: <Button color="primary">Button</Button>,
  IconButton: (
    <IconButton label="Close">
      <CloseIcon size="sm" />
    </IconButton>
  ),
  CopyButton: <CopyButton size="sm" value="pnpm add @k8ordo/ui" />,
  Toolbar: (
    <Toolbar.Root aria-label="Formatting">
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="Copy">
            <CopyIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Item
        renderItem={(props) => (
          <IconButton {...props} label="Link">
            <LinkIcon size="sm" />
          </IconButton>
        )}
      />
      <Toolbar.Separator />
      <Toolbar.Item
        renderItem={(props) => (
          <Button {...props} size="sm">
            Save
          </Button>
        )}
      />
    </Toolbar.Root>
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
  Stepper: (
    <div className="w-full">
      <Stepper
        aria-label="Sign-up"
        defaultValue={1}
        steps={[{ label: 'Cart' }, { label: 'Pay' }, { label: 'Done' }]}
      />
    </div>
  ),
  SideNav: (
    <div className="w-40">
      <SideNav.Root label="SideNav">
        <SideNav.Group title="Guide">
          <SideNav.Link current href="/">
            Get started
          </SideNav.Link>
          <SideNav.Link href="/">Theming</SideNav.Link>
        </SideNav.Group>
      </SideNav.Root>
    </div>
  ),
  TableOfContents: (
    <div className="w-40">
      <TableOfContents
        items={[
          { id: 'preview-install', label: 'Install' },
          { id: 'preview-usage', label: 'Usage' },
        ]}
      />
    </div>
  ),
  TextField: <TextField placeholder="Enter your name" />,
  Textarea: <Textarea placeholder="Enter text" rows={3} />,
  NumberField: <NumberField placeholder="0" />,
  DateField: (
    <div className="w-56">
      <DateField aria-label="Date" defaultValue="2026-09-30" />
    </div>
  ),
  DatePicker: (
    <div className="w-56">
      <DatePicker aria-label="Check-in" defaultValue="2026-09-30" />
    </div>
  ),
  Calendar: (
    <div className="zoom-[0.5]">
      <Calendar defaultValue="2026-09-30" />
    </div>
  ),
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
  CheckboxGroup: (
    <div className="w-full max-w-xs">
      <p className="text-fg-base mb-2 font-medium" id="preview-checkbox-group">
        Frameworks
      </p>
      <CheckboxGroup.Root
        aria-labelledby="preview-checkbox-group"
        defaultValue={['react']}
        name="preview-frameworks"
      >
        <CheckboxGroup.Item itemValue="react" label="React" />
        <CheckboxGroup.Item itemValue="vue" label="Vue" />
      </CheckboxGroup.Root>
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
  RangeSlider: (
    <div className="w-40">
      <RangeSlider aria-label="Price" defaultValue={[20, 70]} />
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
  Kbd: (
    <span className="inline-flex items-center gap-1">
      <Kbd label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
    </span>
  ),
  Carousel: (
    <div className="w-full max-w-60">
      <Carousel.Root label="Carousel" slideSize="lg">
        {['1', '2', '3'].map((slide) => (
          <Carousel.Slide key={slide}>
            <div className="bg-bg-base flex h-12 items-center justify-center rounded-lg shadow-sm">
              {slide}
            </div>
          </Carousel.Slide>
        ))}
      </Carousel.Root>
    </div>
  ),
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
  DataTable: (
    <div className="w-full">
      <DataTable
        columns={[
          {
            id: 'name',
            header: 'Name',
            cell: (row: { id: string; name: string }) => row.name,
            sortable: true,
          },
        ]}
        getRowId={(row) => row.id}
        label="DataTable"
        onSelectedIdsChange={() => undefined}
        onSortChange={() => undefined}
        rows={[
          { id: '1', name: 'Aoki' },
          { id: '2', name: 'Inoue' },
        ]}
        selectedIds={['1']}
        sort={{ columnId: 'name', direction: 'ascending' }}
      />
    </div>
  ),
  Tree: (
    <div className="w-44">
      <Tree
        defaultExpandedIds={['src']}
        defaultSelectedId="index"
        items={[
          {
            id: 'src',
            label: 'src',
            children: [{ id: 'index', label: 'index.ts' }],
          },
          { id: 'readme', label: 'README.md' },
        ]}
        label="Tree"
      />
    </div>
  ),
  Heading: <Heading level="h2">Section Title</Heading>,
  Prose: (
    <div className="w-full max-w-56">
      <Prose>
        <h3>Heading</h3>
        <p>
          Body text with <strong>strong</strong> and <em>emphasis</em>.
        </p>
      </Prose>
    </div>
  ),
  Alert: <Alert message="This is an info alert." tone="info" />,
  EmptyState: (
    <EmptyState icon={<TableIcon size="md" />} title="Nothing here yet" />
  ),
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
  ContextMenu: (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        renderItem={(props) => (
          <div
            {...props}
            className="border-border-base text-fg-mute grid h-20 w-40 place-items-center rounded-lg border border-dashed text-sm"
          >
            report.pdf
          </div>
        )}
      />
      <ContextMenu.Content>
        <ContextMenu.Item label="Rename" onAction={() => undefined} />
      </ContextMenu.Content>
    </ContextMenu.Root>
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
  ColorPicker: (
    <div className="w-56">
      <ColorPicker aria-label="Accent color" defaultValue="#0d9488" />
    </div>
  ),
  Combobox: (
    <div className="w-56">
      <Combobox
        aria-label="Prefecture"
        defaultValue="kyoto"
        options={[
          { value: 'tokyo', label: 'Tokyo' },
          { value: 'kyoto', label: 'Kyoto' },
        ]}
      />
    </div>
  ),
  CommandPalette: (
    <span className="flex gap-1">
      <Kbd label="Command">⌘</Kbd>
      <Kbd>K</Kbd>
    </span>
  ),
  Stack: (
    <div className="w-40">
      <Stack gap="sm">
        {['1', '2', '3'].map((item) => (
          <div className="bg-bg-base h-6 rounded-md shadow-sm" key={item} />
        ))}
      </Stack>
    </div>
  ),
  Grid: (
    <div className="w-40">
      <Grid cols={3} gap="sm">
        {['1', '2', '3', '4', '5', '6'].map((item) => (
          <div className="bg-bg-base h-8 rounded-md shadow-sm" key={item} />
        ))}
      </Grid>
    </div>
  ),
  Separator: (
    <div className="w-40">
      <Separator color="mute" />
    </div>
  ),
  ResizablePanels: (
    <div className="border-border-base h-20 w-40 overflow-hidden rounded-md border">
      <ResizablePanels.Root defaultValue={40}>
        <ResizablePanels.Panel>
          <div className="bg-bg-subtle size-full" />
        </ResizablePanels.Panel>
        <ResizablePanels.Handle />
        <ResizablePanels.Panel>
          <div className="size-full" />
        </ResizablePanels.Panel>
      </ResizablePanels.Root>
    </div>
  ),
  InView: <InViewPreview />,
  Resize: <ResizePreview />,
  Icons: (
    <div className="text-fg-base flex gap-3">
      <SparklesIcon size="lg" />
      <PaletteIcon size="lg" />
      <AtomIcon size="lg" />
    </div>
  ),
} satisfies Record<Exclude<ComponentNavName, ServerPreviewName>, ReactNode>;

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

function InViewPreview(): ReactNode {
  const [isInView, setIsInView] = useState(false);
  return (
    <InView onChange={setIsInView}>
      <Badge
        label={isInView ? 'In view' : 'Out of view'}
        tone={isInView ? 'success' : 'neutral'}
      />
    </InView>
  );
}

function ResizePreview(): ReactNode {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  return (
    <div className="w-full">
      <Resize
        onChange={() => {
          setWidth(box.current?.offsetWidth ?? null);
        }}
      >
        <div
          className="bg-bg-base text-fg-mute rounded-lg p-4 text-center text-sm tabular-nums shadow-sm"
          ref={box}
        >
          {width === null ? '—' : `${String(width)}px wide`}
        </div>
      </Resize>
    </div>
  );
}
