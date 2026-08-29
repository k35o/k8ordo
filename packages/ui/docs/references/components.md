# @k8ordo/ui component catalog

## Importing

```tsx
// The stylesheet (required). In a Tailwind CSS 4 project,
// import '@k8ordo/ui/tailwind.css' instead
import '@k8ordo/ui/styles.css';

// The provider (once, at the app root)
import { UIProvider } from '@k8ordo/ui';

// Components (all from the root entry)
import { Button, Card, TextField } from '@k8ordo/ui';
```

## Buttons and links

### Button

```tsx
import { Button } from '@k8ordo/ui';

<Button
  size="sm" | "md" | "lg"
  color="primary" | "secondary" | "base"
  variant="solid" | "outline" | "skeleton"
  fullWidth={false}
  startIcon={<Icon />}
  endIcon={<Icon />}
  disabled={false}
  isActive={false}
>
  Button
</Button>
```

Props:

- `children`: `ReactNode`
- `color`: `'primary'` | `'secondary'` | `'base'` (default: `'primary'`)
- `endIcon`: `ReactNode`
- `fullWidth`: `boolean` (default: `false`)
- `isActive`: `boolean` (default: `false`)
- `onAction`: `() => void | Promise<void>`
- `renderItem`: `(props: { className: string; children: ReactNode }) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `startIcon`: `ReactNode`
- `type`: `'button'` | `'submit'` (default: `'button'`)
- `variant`: `'solid'` | `'outline'` | `'skeleton'` (default: `'solid'`)

Use the `renderItem` prop to render it as a link. The same applies to things like Next.js's `<Link>`.

```tsx
<Button
  color="base"
  variant="outline"
  renderItem={({ className, children }) => (
    <a className={className} href="/page">
      {children}
    </a>
  )}
>
  Link
</Button>
```

### IconButton

An icon-only button. Styling is controlled by the `color` prop.

```tsx
import { IconButton } from '@k8ordo/ui';

<IconButton label="Close" color="transparent" size="md">
  <CloseIcon />
</IconButton>;
```

Props:

- `label`: `string` (required)
- `children`: `ReactNode`
- `color`: `'transparent'` | `'base'` | `'primary'` | `'secondary'` (default: `'transparent'`)
- `onAction`: `() => void | Promise<void>`
- `renderItem`: `(props: { className: string; children: ReactNode; 'aria-label': string; triggerProps: IconButtonTriggerProps; }) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `tooltipDisabled`: `boolean` (default: `false`)
- `tooltipPlacement`: `Placement` (default: `'top'`)

Use the `renderItem` prop to render it as a link. Spreading `triggerProps` onto the `<a>` shows `label` as a tooltip on hover and focus.

```tsx
<IconButton
  color="base"
  label="Mail"
  renderItem={({
    className,
    children,
    'aria-label': ariaLabel,
    triggerProps,
  }) => (
    <a
      aria-label={ariaLabel}
      className={className}
      href="/contact"
      {...triggerProps}
    >
      {children}
    </a>
  )}
>
  <MailIcon />
</IconButton>
```

### Anchor

A text link. External links automatically get a new-tab icon.

```tsx
import { Anchor } from '@k8ordo/ui';

<Anchor href="https://example.com">External link</Anchor>
<Anchor href="/about">Internal link</Anchor>
<Anchor href="/docs" openInNewTab>Open in a new tab</Anchor>
```

Props:

- `children`: `ReactNode` (required)
- `href`: `T` (required)
- `openInNewTab`: `boolean` (default: `false`)
- `renderAnchor`: `(props: RenderAnchorProps<T>) => ReactNode` (default: `defaultRenderAnchor`)

## Layout and navigation

### Accordion

A collapsible section, as a compound component.

```tsx
import { Accordion } from '@k8ordo/ui';

<Accordion.Root>
  <Accordion.Item>
    <Accordion.Button>Section 1</Accordion.Button>
    <Accordion.Panel>Content</Accordion.Panel>
  </Accordion.Item>
</Accordion.Root>;
```

Props (Accordion.Button):

- `children`: `ReactNode`

Props (Accordion.Item):

- `children`: `ReactNode`
- `defaultOpen`: `boolean` (default: `false`)
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`

Props (Accordion.Panel):

- `children`: `ReactNode`

Props (Accordion.Root):

- `children`: `ReactNode`

### Breadcrumb

A breadcrumb trail, as a compound component.

```tsx
import { Breadcrumb } from '@k8ordo/ui';

<Breadcrumb.List>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Separator />
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/products/1" current>
      Details
    </Breadcrumb.Link>
  </Breadcrumb.Item>
</Breadcrumb.List>;
```

Props (Breadcrumb.List):

- `children`: `ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

Props (Breadcrumb.Link):

- `href`: `T` (required)
- `children`: `ReactNode`
- `current`: `boolean` (default: `false`)
- `renderAnchor`: `(props: RenderBreadcrumbAnchorProps<T>) => ReactNode` (default: `defaultRenderBreadcrumbAnchor`)

Props (Breadcrumb.Item):

- `children`: `ReactNode`

### Pagination

Pagination. It shows previous/next buttons and the current page only — there is no list of page numbers.

```tsx
import { Pagination } from '@k8ordo/ui';

<Pagination currentPage={page} onChange={setPage} totalPages={10} />;
```

Props:

- `currentPage`: `number` (required)
- `onChange`: `(page: number) => void` (required)
- `totalPages`: `number` (required)
- `aria-label`: `string`
- `disabled`: `boolean` (default: `false`)
- `nextLabel`: `string`
- `prevLabel`: `string`
- `ref`: `Ref<HTMLElement>`

### Tabs

Tab switching, as a compound component.

```tsx
import { Tabs } from '@k8ordo/ui';

<Tabs.Root ids={['tab1', 'tab2']}>
  <Tabs.List label="Tabs">
    <Tabs.Tab id="tab1">Tab 1</Tabs.Tab>
    <Tabs.Tab id="tab2">Tab 2</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="tab1">Panel 1</Tabs.Panel>
  <Tabs.Panel id="tab2">Panel 2</Tabs.Panel>
</Tabs.Root>;
```

Props (Tabs.Root):

- `ids`: `[string, ...string[]]` (required)
- `children`: `ReactNode`
- `defaultSelectedId`: `string` | `null` (default: `null`)
- `onChange`: `(id: string) => void`
- `selectedId`: `string`

Props (Tabs.List):

- `label`: `string` (required)
- `children`: `ReactNode`

Props (Tabs.Panel):

- `id`: `string` (required)
- `children`: `ReactNode`

Props (Tabs.Tab):

- `id`: `string` (required)
- `children`: `ReactNode`

### Card

A card that groups content.

```tsx
import { Card } from '@k8ordo/ui';

// Static card
<Card width="full" variant="shadow">
  <div className="p-6">Content</div>
</Card>

// Clickable card (hover:scale-[1.02], active:scale-[0.98])
<Card variant="outline" interactive>
  <div className="p-6">Content</div>
</Card>
```

Props:

- `children`: `ReactNode`
- `interactive`: `boolean` (default: `false`)
- `variant`: `'shadow'` | `'outline'` (default: `'shadow'`)
- `width`: `'full'` | `'fit'` (default: `'full'`)

### Separator

A dividing rule.

```tsx
import { Separator } from '@k8ordo/ui';

<Separator />
<Separator color="mute" />
<Separator color="subtle" />
<Separator orientation="vertical" />
```

Props:

- `color`: `'base'` | `'mute'` | `'subtle'` (default: `'base'`)
- `orientation`: `'horizontal'` | `'vertical'` (default: `'horizontal'`)

### ScrollLinked

Shows scroll progress as a progress bar.

```tsx
import { ScrollLinked } from '@k8ordo/ui';

<ScrollLinked />
<ScrollLinked container={containerRef} />
```

Props:

- `container`: `RefObject<HTMLElement | null>`

### Stack

Lays children out along one axis. Pick `gap` from the spacing tokens.

```tsx
import { Stack } from '@k8ordo/ui';

<Stack gap="lg">
  <Card>1</Card>
  <Card>2</Card>
</Stack>

<Stack direction="row" justify="between" align="center">
  <Heading level="h2">Title</Heading>
  <Button>Action</Button>
</Stack>
```

Props:

- `align`: `'start'` | `'center'` | `'end'` | `'stretch'`
- `children`: `ReactNode`
- `direction`: `'row'` | `'column'` (default: `'column'`)
- `gap`: `GapSize` (default: `'md'`)
- `justify`: `'start'` | `'center'` | `'end'` | `'between'`
- `padding`: `PaddingSize`

### Grid

A grid layout. Passing `'auto-fill'` or `'auto-fit'` to `cols` wraps with `minItemSize` as the lower bound.

```tsx
import { Grid } from '@k8ordo/ui';

<Grid cols={3} gap="md">
  <Card>1</Card>
  <Card>2</Card>
  <Card>3</Card>
</Grid>

<Grid cols="auto-fill" minItemSize={64}>
  {items.map((item) => (
    <Card key={item.id}>{item.name}</Card>
  ))}
</Grid>
```

Props:

- `children`: `ReactNode`
- `cols`: `1` | `2` | `3` | `4` | `5` | `6` | `'auto-fill'` | `'auto-fit'` (default: `'auto-fill'`)
- `gap`: `GapSize` (default: `'md'`)
- `minItemSize`: `24` | `32` | `40` | `48` | `64` | `80` (default: `48`)

## Forms

Form components are used together with `FormControl`'s `renderInput` pattern. Every form component supports both controlled and uncontrolled use.

`ref` reaches the real element (`input` / `textarea` / `select` / `fieldset`). `Textarea` and `FileField` use a ref internally but compose it with yours, so `react-hook-form`'s `register()` and the like can be passed straight through. `Radio` (a group that renders several inputs) and `FormControl` (a wrapper) do not take a `ref`.

### Form

A wrapper for `<form>`. `action` accepts a Server Action (`(formData) => …`) or a URL string.

```tsx
import { Button, Form, FormControl, TextField } from '@k8ordo/ui';

<Form action={submitAction}>
  <FormControl
    label="Email"
    required
    renderInput={(props) => <TextField {...props} name="email" />}
  />
  <Button type="submit">Submit</Button>
</Form>;
```

Props:

- `children`: `ReactNode` (required)
- `action`: `((formData: FormData) => void | Promise<void>)` | `string`

### FormControl

A wrapper for a form field. It unifies the label, help text, and error display.

```tsx
import { FormControl, TextField } from '@k8ordo/ui';

<FormControl
  label="Email address"
  errorText="This field is required"
  helpText="Enter your work email address"
  required
  renderInput={(props) => (
    <TextField {...props} placeholder="example@mail.com" />
  )}
/>;
```

Props:

- `label`: `string` (required)
- `renderInput`: `(props: { id: string; 'aria-describedby': string | undefined; 'aria-labelledby': string; disabled: boolean; invalid: boolean; required: boolean; }) => ReactElement` (required)
- `disabled`: `boolean` (default: `false`)
- `errorText`: `string`
- `helpText`: `string`
- `invalid`: `boolean` (default: `false`)
- `labelAs`: `'label'` | `'legend'` (default: `'label'`)
- `ref`: `Ref<HTMLElement>`
- `required`: `boolean` (default: `false`)

`renderInput` receives `{ id, 'aria-describedby', 'aria-labelledby', disabled, invalid, required }`.

The wrapper element depends on `labelAs`. `'label'` (the default) gives `<div>` + `<label htmlFor>`; `'legend'` gives `<fieldset>` + `<legend>`. `<fieldset>` is used only for `legend`, so that a single field never becomes an unnamed group. Pass `labelAs="legend"` when wrapping a group input such as `Radio` or `CheckboxGroup`.

### TextField

```tsx
import { TextField } from '@k8ordo/ui';

// Uncontrolled
<TextField id="email" defaultValue="" placeholder="example@mail.com"
  invalid={false} disabled={false} required={false} />

// Controlled
<TextField id="email" value={value} onChange={onChange}
  invalid={false} disabled={false} required={false} />

// type can be passed too (default: "text")
<TextField id="tel" type="tel" inputMode="numeric" />
```

Props:

- `children`: `ReactNode`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLInputElement>`
- `type`: `TextInputType` (default: `'text'`)

### Textarea

```tsx
import { Textarea } from '@k8ordo/ui';

<Textarea
  id="description"
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `autoResize`: `boolean` (default: `false`)
- `children`: `ReactNode`
- `fullHeight`: `boolean` (default: `false`)
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLTextAreaElement>`

### NumberField

```tsx
import { NumberField } from '@k8ordo/ui';

<NumberField
  id="quantity"
  min={0}
  max={100}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `9_007_199_254_740_991`)
- `min`: `number` (default: `-9_007_199_254_740_991`)
- `onChange`: `(value: number) => void`
- `precision`: `number` (default: `0`)
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number`

### PasswordInput

A password input, with a show/hide toggle.

```tsx
import { PasswordInput } from '@k8ordo/ui';

<PasswordInput
  id="password"
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
  showLabel="Show"
  hideLabel="Hide"
/>;
```

Props:

- `children`: `ReactNode`
- `hideLabel`: `string`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLInputElement>`
- `showLabel`: `string`

### Select

```tsx
import { Select } from '@k8ordo/ui';

<Select
  id="category"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `options`: `readonly Option[]` (required)
- `children`: `ReactNode`
- `invalid`: `boolean` (default: `false`)
- `ref`: `Ref<HTMLSelectElement>`

### Autocomplete

A multi-select autocomplete. `value` and `onChange` are `string[]`.

```tsx
import { Autocomplete } from '@k8ordo/ui';

<Autocomplete
  id="tags"
  options={options}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `id`: `string` (required)
- `options`: `readonly Option[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLInputElement>`
- `value`: `string[]`

### Checkbox

The label is passed as the `label` prop, not as children. `onChange` is `(checked, event)`.

```tsx
import { Checkbox } from '@k8ordo/ui';

// Controlled
<Checkbox checked={checked} label="I agree" onChange={onChange} />

// Uncontrolled
<Checkbox defaultChecked label="I agree" />
```

Props:

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

### CheckboxGroup

A group of checkboxes. The children are `CheckboxGroup.Item` (= `Checkbox`), and `itemValue` is required.

The group's selection lives in `value` / `onChange` (`string[]`). That is a different thing from a lone `Checkbox` holding a boolean in `checked` — do not conflate them.

It renders a `fieldset[role="group"]`, so `aria-labelledby` is required. Convey that the group is required through the referenced label element (for example `FormControl`'s required marker). `role="group"` does not allow `aria-required`, so do not put it on the group.

```tsx
import { CheckboxGroup } from '@k8ordo/ui';

<p id="interests-label">Areas of interest</p>
<CheckboxGroup.Root
  aria-labelledby="interests-label"
  name="interests"
  value={values}
  onChange={setValues}
>
  <CheckboxGroup.Item itemValue="music" label="Music" />
  <CheckboxGroup.Item itemValue="movie" label="Film" />
</CheckboxGroup.Root>;
```

Props (CheckboxGroup.Item):

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

Props (CheckboxGroup.Root):

- `aria-labelledby`: `string` (required)
- `name`: `string` (required)
- `children`: `ReactNode`
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`

### CheckboxCard

A card-styled checkbox.

```tsx
import { CheckboxCard } from '@k8ordo/ui';

<CheckboxCard
  name="plan"
  disabled={false}
  options={[
    { value: 'basic', label: 'Basic', description: '$9 / month' },
    {
      value: 'pro',
      label: 'Pro',
      description: '$19 / month',
      visual: <Icon />,
    },
  ]}
  value={selected}
  onChange={onChange}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly CheckboxCardOption[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`

### Radio

```tsx
import { Radio } from '@k8ordo/ui';

<Radio
  aria-labelledby="example-radio"
  name="example"
  onChange={onChange}
  options={[
    { value: 'a', label: 'Choice A' },
    { value: 'b', label: 'Choice B' },
  ]}
  value={value}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly Option[]` (required)
- `disabled`: `boolean` (default: `false`)
- `name`: `string`
- `onChange`: `(value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLDivElement>`
- `value`: `string`

### RadioCard

A card-styled radio button. Real `input[type="radio"]` elements sit inside a `fieldset[role="radiogroup"]`, so arrow-key roving and single selection are left to the browser. Reach them from tests with `getByRole('radio', { checked })`.

```tsx
import { RadioCard } from '@k8ordo/ui';

<RadioCard
  aria-labelledby="plan-radio"
  name="plan"
  disabled={false}
  options={[
    { value: 'basic', label: 'Basic', description: '$9 / month' },
    {
      value: 'pro',
      label: 'Pro',
      description: '$19 / month',
      visual: <Icon />,
    },
  ]}
  value={value}
  onChange={onChange}
/>;
```

Props:

- `aria-labelledby`: `string` (required)
- `options`: `readonly RadioCardOption[]` (required)
- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string`

### Slider

A range slider.

```tsx
import { Slider } from '@k8ordo/ui';

<Slider
  min={0}
  max={100}
  step={1}
  value={value}
  onChange={onChange}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

Props:

- `defaultValue`: `never`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `100`)
- `min`: `number` (default: `0`)
- `onChange`: `(value: number) => void`
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number`

### Switch

A toggle switch.

```tsx
import { Switch } from '@k8ordo/ui';

<Switch
  checked={checked}
  disabled={false}
  invalid={false}
  label="Enable notifications"
  onChange={onChange}
  required={false}
/>;
```

Props:

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `never`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`

### FileField

File upload, as a composite pattern.

```tsx
import { FileField } from '@k8ordo/ui';

<FileField.Root accept="image/*" multiple maxFiles={5}>
  <FileField.Trigger
    renderItem={({ onClick, disabled }) => (
      <Button onClick={onClick} disabled={disabled}>
        Choose files
      </Button>
    )}
  />
  <FileField.ItemList />
</FileField.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `defaultValue`: `File[]`
- `invalid`: `boolean` (default: `false`)
- `maxFiles`: `number`
- `onChange`: `(files: FileList | null, event?: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`
- `webkitDirectory`: `boolean` (default: `false`)

Props (FileField.ItemList):

- `clearable`: `boolean`
- `showWebkitRelativePath`: `boolean`

Props (FileField.Trigger):

- `renderItem`: `(props: { onClick: () => void; disabled: boolean; invalid: boolean; }) => ReactElement` (required)

## Data display

### Heading

A semantic heading. The `type` prop selects the HTML element.

```tsx
import { Heading } from '@k8ordo/ui';

<Heading level="h1">Page title</Heading>
<Heading level="h2">Section heading</Heading>
<Heading level="h3">Subsection</Heading>
```

Props:

- `level`: `'h1'` | `'h2'` | `'h3'` | `'h4'` | `'h5'` | `'h6'` (required)
- `children`: `ReactNode`
- `lineClamp`: `1` | `2` | `3` | `4` | `5` | `6`

### Avatar

A user avatar.

```tsx
import { Avatar } from '@k8ordo/ui';

<Avatar src="/avatar.jpg" alt="User name" size="md" />
<Avatar name="Ada Lovelace" fallback="A" size="lg" />
<Avatar color="primary" icon={<AssistantIcon />} name="AI" size="sm" />
```

Props:

- `alt`: `string`
- `children`: `ReactNode`
- `color`: `'base'` | `'primary'` | `'secondary'` (default: `'base'`)
- `fallback`: `string`
- `icon`: `ReactNode`
- `name`: `string`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `src`: `string`

### Badge

A status badge.

```tsx
import { Badge } from '@k8ordo/ui';

<Badge label="New" tone="info" variant="solid" />
<Badge label="Done" tone="success" variant="outline" />
<Badge label="Filter" interactive />
```

Props:

- `label`: `string` (required)
- `interactive`: `true`
- `size`: `Size`
- `tone`: `Tone`
- `variant`: `Variant`

### Code

Inline code.

```tsx
import { Code } from '@k8ordo/ui';

<Code>{`const x = 1;`}</Code>;
```

Props:

- `children`: `string` (required)

### Table

A data table, as a compound component.

```tsx
import { Table } from '@k8ordo/ui';

<Table.Root>
  <Table.Head>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell align="right">Amount</Table.HeaderCell>
    </Table.Row>
  </Table.Head>
  <Table.Body>
    <Table.Row interactive>
      <Table.Cell>Product A</Table.Cell>
      <Table.Cell align="right">¥1,000</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>;
```

Props (Table.Body):

- `children`: `ReactNode`

Props (Table.Caption):

- `children`: `ReactNode`

Props (Table.Cell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `color`: `'base'` | `'mute'` (default: `'base'`)

Props (Table.EmptyState):

- `children`: `ReactNode` (required)
- `colSpan`: `number` (required)

Props (Table.Head):

- `children`: `ReactNode`

Props (Table.HeaderCell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `scope`: `'col'` | `'row'` | `'colgroup'` | `'rowgroup'` (default: `'col'`)

Props (Table.Root):

- `children`: `ReactNode`

Props (Table.Row):

- `children`: `ReactNode`
- `interactive`: `boolean` (default: `false`)

## Feedback

### Alert

```tsx
import { Alert } from '@k8ordo/ui';

<Alert tone="info" message="An informational message" />
<Alert tone="error" message={['Error 1', 'Error 2']} />
```

Props:

- `message`: `string` | `string[]` (required)
- `tone`: `Status` (required)
- `action`: `AlertAction`
- `closeLabel`: `string`
- `onClose`: `() => void`

### Toast

```tsx
import { useToast } from '@k8ordo/ui';

const { open, close, closeAll } = useToast();

open('success', 'Saved');
open('error', 'Something went wrong');
```

`ToastProvider` is already inside `UIProvider`, so no extra wrapper is needed.

What `useToast()` returns:

- `open`: `(tone: Status, message: string, options?: ToastOptions) => void` (`ToastOptions` is `{ duration?: number; action?: ToastAction }`)
- `close`: `(id: string) => void`
- `closeAll`: `() => void`

### ToastProvider

Wrap explicitly inside `UIProvider` only when you want to change where toasts appear or which Portal root they use.

```tsx
import { ToastProvider } from '@k8ordo/ui';

<ToastProvider position="absolute" portalRef={containerRef}>
  {children}
</ToastProvider>;
```

Props:

- `children`: `ReactNode`
- `portalRef`: `RefObject<HTMLElement | null>` (default: `null`)
- `position`: `'fixed'` | `'absolute'` (default: `'fixed'`)

### Progress

```tsx
import { Progress } from '@k8ordo/ui';

<Progress value={50} max={100} />
<Progress value={50} max={100} min={0} label="Progress" />
```

Props:

- `max`: `number` (required)
- `value`: `number` (required)
- `label`: `string`
- `min`: `number` (default: `0`)

### Spinner

A loading spinner.

```tsx
import { Spinner } from '@k8ordo/ui';

<Spinner size="md" label="Loading" />;
```

Props:

- `label`: `string`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

### Skeleton

A content placeholder.

```tsx
import { Skeleton } from '@k8ordo/ui';

<Skeleton shape="rect" size="md" />
<Skeleton shape="circle" size="lg" />
<Skeleton shape="rect" size="sm" animate={false} />
```

Props:

- `animate`: `boolean` (default: `true`)
- `shape`: `'rect'` | `'circle'` (default: `'rect'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)

## Overlays

### Modal

The base overlay component. It uses the `<dialog>` element.

```tsx
import { Modal } from '@k8ordo/ui';

<Modal isOpen={open} onClose={onClose} side="center">
  Content
</Modal>;
```

Props:

- `aria-describedby`: `string`
- `aria-label`: `string`
- `aria-labelledby`: `string`
- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `ref`: `Ref<HTMLDialogElement>`
- `side`: `ModalSide` (default: `'center'`)

Name resolution goes `aria-label` / `aria-labelledby` first, then the heading registered by a `Dialog.Root` inside. With neither, the dialog is unnamed — so pass `aria-label` when you place content directly without a `Dialog`.

```tsx
<Modal aria-label="Image preview" isOpen={open} onClose={onClose}>
  <img alt="" src={src} />
</Modal>
```

### Dialog

A compound component, used together with Modal.

```tsx
import { Modal, Dialog } from '@k8ordo/ui';

<Modal isOpen={open} onClose={onClose}>
  <Dialog.Root>
    <Dialog.Header title="Confirm" onClose={onClose} />
    <Dialog.Content>Content</Dialog.Content>
  </Dialog.Root>
</Modal>;
```

Props (Dialog.Content):

- `children`: `ReactNode`

Props (Dialog.Header):

- `onClose`: `() => void` (required)
- `title`: `ReactNode` (required)

Props (Dialog.Root):

- `children`: `ReactNode`
- `id`: `string`
- `ref`: `Ref<HTMLElement>`
- `role`: `'dialog'` | `'alertdialog'`
- `tabIndex`: `number`

### Drawer

A side panel. It uses Modal internally.

```tsx
import { Drawer } from '@k8ordo/ui';

<Drawer title="Menu" isOpen={open} onClose={onClose} side="right">
  Content
</Drawer>;
```

Props:

- `title`: `ReactNode` (required)
- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `side`: `DrawerSide` (default: `'right'`)

### Popover

A popover built on CSS Anchor Positioning, as a compound component.

```tsx
import { Popover } from '@k8ordo/ui';

<Popover.Root placement="bottom">
  <Popover.Trigger renderItem={(props) => <Button {...props}>Open</Button>} />
  <Popover.Content
    renderItem={(props) => <div {...props}>Popover content</div>}
  />
</Popover.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `closeOnClickAway`: `boolean` (default: `true`)
- `defaultOpen`: `boolean` (default: `false`)
- `flipDisabled`: `boolean` (default: `false`)
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `placement`: `Placement` (default: `'bottom-start'`)
- `role`: `'dialog'` | `'menu'` | `'listbox'` (default: `'menu'`)
- `trapFocus`: `boolean` (default: `true`)

Escape closes **only the innermost one** when they are nested.

Props (Popover.Content):

- `renderItem`: `(props: PopoverContentProps) => ReactElement` (required)
- `animation`: `'scale'` | `'fade'` (default: `'scale'`)

Props (Popover.Trigger):

- `renderItem`: `(props: PopoverTriggerProps) => ReactElement` (required)

### Tooltip

A tooltip, as a compound component.

```tsx
import { Tooltip } from '@k8ordo/ui';

<Tooltip.Root placement="top">
  <Tooltip.Trigger renderItem={(props) => <Button {...props}>Hover</Button>} />
  <Tooltip.Content>A hint</Tooltip.Content>
</Tooltip.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `closeDelay`: `number` (default: `150`)
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `openDelay`: `number` (default: `0`)
- `placement`: `Placement` (default: `'bottom'`)

Props (Tooltip.Content):

- `children`: `ReactNode`

Props (Tooltip.Trigger):

- `renderItem`: `(props: TooltipTriggerProps) => ReactElement` (required)

### DropdownMenu

A dropdown menu, as a compound component.

```tsx
import { DropdownMenu } from '@k8ordo/ui';

<DropdownMenu.Root>
  <DropdownMenu.Trigger label="Menu" />
  <DropdownMenu.Content>
    <DropdownMenu.Item label="Item 1" onAction={handleClick} />
    <DropdownMenu.Item label="Item 2" onAction={handleClick} />
  </DropdownMenu.Content>
</DropdownMenu.Root>;
```

Props (Root):

- `children`: `ReactNode`
- `defaultOpen`: `boolean`
- `isOpen`: `boolean`
- `onChange`: `(isOpen: boolean) => void`
- `placement`: `Placement` (default: `'bottom-start'`)

Trigger variants:

- `DropdownMenu.Trigger`: text-based (`label`, `size`, `variant`)
- `DropdownMenu.IconTrigger`: icon-based (`icon`, `label`)

Props (DropdownMenu.Content):

- `children`: `ReactNode`

Props (DropdownMenu.IconTrigger):

- `icon`: `ReactNode` (required)
- `label`: `string` (required)

Props (DropdownMenu.Item):

- `label`: `string` (required)
- `onAction`: `() => void` (required)

`DropdownMenu.SubMenu` is a nested menu. Hovering the `label` row, or opening it from the keyboard, opens the child menu to the right.

Props (DropdownMenu.SubMenu):

- `label`: `string` (required)
- `children`: `ReactNode`

Props (DropdownMenu.Trigger):

- `label`: `string` (required)
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)
- `variant`: `ComponentProps<typeof Button>['variant']` (default: `'solid'`)

### ListBox

List selection, as a compound component. The choices use the same `Option` (`{ value, label }`) as `Select`.

```tsx
import { ListBox } from '@k8ordo/ui';

<ListBox.Root
  onChange={onChange}
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ]}
  value={value}
>
  <ListBox.Trigger label="Items per page" size="md" />
  <ListBox.Content />
</ListBox.Root>;
```

Props (Root):

- `options`: `readonly Option[]` (required)
- `children`: `ReactNode`
- `defaultValue`: `Option['value']`
- `onChange`: `(value: Option['value']) => void`
- `placement`: `Placement` (default: `'bottom'`)
- `value`: `Option['value']`

Trigger variants:

- `ListBox.Trigger`: text-based (`size`, `label`)
- `ListBox.IconTrigger`: icon-based (`size`, `icon`, `label`)

Passing `label` makes the trigger's accessible name "label + current value". Omit it and only the current value is used, so pass it when there is no heading nearby.

Props (Content):

- `helpContent`: `ReactElement`

Props (ListBox.IconTrigger):

- `icon`: `ReactElement` (required)
- `label`: `string`
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)

Props (ListBox.Trigger):

- `label`: `string`
- `size`: `ComponentProps<typeof Button>['size']` (default: `'md'`)

## Providers

### UIProvider

Wrap the app root once. It includes ToastProvider and the message dictionary (i18n, below).

```tsx
import { UIProvider } from '@k8ordo/ui';

<UIProvider>
  <App />
</UIProvider>;
```

Props:

- `children`: `ReactNode`
- `messages`: `Partial<Messages>`

### PortalRootProvider

Sets the root element for portals.

```tsx
import { PortalRootProvider, usePortalRoot } from '@k8ordo/ui';

<PortalRootProvider value={containerRef}>{children}</PortalRootProvider>;
```

Props:

- `children`: `ReactNode`
- `value`: `RefObject<HTMLElement | null>`

## i18n (message dictionary)

The wording components own internally (close, required, loading, …) comes from a dictionary. **It defaults to Japanese**, and works without a provider and without passing `messages`.

To switch to English, pass `en` from `@k8ordo/ui/i18n`.

```tsx
import { UIProvider } from '@k8ordo/ui';
import { en } from '@k8ordo/ui/i18n';

<UIProvider messages={en}>
  <App />
</UIProvider>;
```

To replace only part of it, spread the dictionary and override those keys (`Partial<Messages>`, so you need not fill in every key).

```tsx
<UIProvider messages={{ ...en, close: 'Dismiss' }}>
  <App />
</UIProvider>
```

To stay in Japanese and change only one string, pass just that key.

```tsx
<UIProvider messages={{ close: '閉じる（Esc）' }}>
  <App />
</UIProvider>
```

### Resolution order

**Component prop > the dictionary passed to the provider > the built-in default (Japanese)**.

A component with a wording prop of its own — `Spinner`'s `label`, `Alert`'s `closeLabel`, `PasswordInput`'s `showLabel` / `hideLabel`, `Pagination`'s `prevLabel` / `nextLabel` — takes that prop over the dictionary.

```tsx
// Even with the en dictionary, this one Spinner reads 「保存中」
<Spinner label="保存中" />
```

### Exports

```tsx
import { en, ja, type Messages } from '@k8ordo/ui/i18n';
```

`ja` and `en` are exported only from the `@k8ordo/ui/i18n` subpath, not the root, so the dictionaries stay out of the main bundle.

### Key list

Every key in the `Messages` type. All values are `string`.

| Category      | Keys                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Common        | `close`, `required`, `loading`, `avatar`, `color`                                                                                  |
| Alert         | `alertSuccess`, `alertInfo`, `alertWarning`, `alertError`                                                                          |
| Toast         | `toastRegion`                                                                                                                      |
| Autocomplete  | `autocompletePlaceholder`, `autocompleteRemoveTag`, `autocompleteClear`, `autocompleteEmpty`                                       |
| FileField     | `fileFieldRemove`                                                                                                                  |
| NumberField   | `numberFieldIncrement`, `numberFieldDecrement`                                                                                     |
| PasswordInput | `passwordShow`, `passwordHide`                                                                                                     |
| ListBox       | `listBoxPlaceholder`                                                                                                               |
| Breadcrumb    | `breadcrumb`                                                                                                                       |
| Pagination    | `paginationLabel`, `paginationPrevious`, `paginationNext`                                                                          |
| AI chat       | `chat`, `scrollToLatest`, `reasoning`, `reasoningStreaming`, `suggestions`, `send`, `stop`, `toolInput`, `toolOutput`, `toolError` |
