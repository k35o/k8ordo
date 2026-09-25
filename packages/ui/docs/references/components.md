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

Every component can be rendered from a Server Component, compound ones
included: `Dialog.Root`, `Tabs.Root`, `Popover.Trigger`, and the rest are
composed outside the client modules, so the parts resolve on the server. Only
the interactive parts carry `'use client'`.

## Render props

Two different contracts are spelled `render*`, and mixing them up is the usual
source of surprise.

**Replacing the element** — `renderItem` on `Button` and `IconButton`,
`renderAnchor` on `Anchor` and `Breadcrumb.Link`. The component computes
everything and hands back the exact props it would have put on its own element,
so substituting an `<a>`, a framework `<Link>`, or your own button loses
nothing. For `Button` and `IconButton` that is the resolved `className`, the
composed `children` (icons and the pending spinner included), the click handler,
the disabled and pending state, the `ref`, and every `aria-*` / `data-*` /
native attribute the caller passed in. Spread the bag onto whatever you render.

- Handlers and the `ref` are typed for `HTMLElement` rather than for the
  element the component would have rendered, so the bag spreads onto any tag.
- `disabled` and `type` are the only members that exist on `<button>` alone.
  Destructure them away when you render something else — `aria-disabled` in the
  same bag carries the state, and the supplied `onClick` already does nothing
  and calls `preventDefault()` while disabled, so a disabled link will not
  navigate. The examples below name them `_disabled` / `_type` so the discarded
  bindings pass a `no-unused-vars` rule.
- Spreading onto a real `<button>` is exact, but write `type` on the element
  anyway: the `button-has-type` lint rule cannot see a `type` that arrives
  through a spread.

The link components own less, so their bags are smaller:

- `Anchor` hands back `href`, `className`, `children` (with the new-tab icon on
  an external link), `target` / `rel` on an external link, and every other
  anchor attribute the caller passed, plus `kind` (`'internal'` |
  `'external'`). `kind` is not an attribute: destructure it away before
  spreading, or use it to choose between a framework `<Link>` and a plain `<a>`.
  There is no `ref` and no disabled state.
- `Breadcrumb.Link` hands back `href`, `className`, and `children` only — it
  takes no other attributes. A `current` link renders
  `<span aria-current="page">` and does not call `renderAnchor`.

**Filling a slot** — `renderInput` on `FormControl`, `renderItem` on
`Popover.Trigger`, `Tooltip.Trigger`, `FileField.Trigger`, and `Alert`'s
`action`. Here the component owns no element of its own. It computes wiring —
ids, ARIA relationships, open/close handlers — and you supply the element that
wiring belongs to. Those bags carry only the wiring, and they are required
rather than optional.

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
- `renderItem`: `(props: ButtonRenderItemProps) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `startIcon`: `ReactNode`
- `type`: `'button'` | `'submit'` (default: `'button'`)
- `variant`: `'solid'` | `'outline'` | `'skeleton'` (default: `'solid'`)
- Other props are forwarded to `ComponentPropsWithRef<'button'>`, except `className` / `style`.

`renderItem` replaces the `<button>`; see [Render props](#render-props) for the
contract. It receives `className`, the composed `children`, `ref`, `type`,
`disabled`, `aria-disabled`, `aria-busy`, `onClick`, and every other attribute
passed to `Button`. Use it to render a link — the same shape works for things
like Next.js's `<Link>`.

```tsx
<Button
  color="base"
  variant="outline"
  renderItem={({ children, disabled: _disabled, type: _type, ...props }) => (
    <a href="/page" {...props}>
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
- `renderItem`: `(props: IconButtonRenderItemProps) => ReactNode`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `tooltipDisabled`: `boolean` (default: `false`)
- `tooltipPlacement`: `Placement` (default: `'top'`)
- Other props are forwarded to `ComponentPropsWithRef<'button'>`, except `type` / `className` / `style`.

`renderItem` replaces the `<button>` under the same contract as `Button`'s,
with one addition: the tooltip wiring is kept in a nested `triggerProps` so it
stays free of any element type. Spread it too, and `label` shows as a tooltip on
hover and focus. `triggerProps` also carries the merged `ref` and any
`onMouseEnter` / `onMouseLeave` / `onFocus` / `onBlur` the caller passed, so the
flat part of the bag holds neither.

```tsx
<IconButton
  color="base"
  label="Mail"
  renderItem={({
    children,
    disabled: _disabled,
    triggerProps,
    type: _type,
    ...props
  }) => (
    <a href="/contact" {...props} {...triggerProps}>
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
- Other props are forwarded to `AnchorHTMLAttributes<HTMLAnchorElement>`, except `target` / `rel` / `className` / `style`.

`renderAnchor` replaces the `<a>`; its bag is described under
[Render props](#render-props).

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

`Breadcrumb.Link`'s `renderAnchor` receives `href`, `className`, and `children`;
see [Render props](#render-props).

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
- Other props are forwarded to `HTMLAttributes<HTMLElement>`, except `className` / `style` / `children`.

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

Selecting a tab is a transition: the panels cross-fade through React's
`<ViewTransition>` (off under `prefers-reduced-motion`), and a panel that
suspends keeps the current one on screen until it is ready.

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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLSpanElement>`, except `children` / `role` / `aria-orientation` / `className` / `style`.

### ScrollLinked

Shows scroll progress as a progress bar. Tracks the window unless `container`
names an element to track instead.

```tsx
import { ScrollLinked } from '@k8ordo/ui';

<ScrollLinked />;

// a scroll container rather than the window
const [container, setContainer] = useState<HTMLElement | null>(null);

<div ref={setContainer} style={{ overflowY: 'auto' }}>
  <ScrollLinked container={container} />…
</div>;
```

Hold `container` in state, not a `RefObject`: tracking has to start once the
element exists. While it is still `null` the bar tracks nothing — it does not
fall back to the window.

Props:

- `container`: `Element` | `null`

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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `className` / `style`.

## Forms

Form components are used together with `FormControl`'s `renderInput` pattern. Every form component except `FileField` supports both controlled and uncontrolled use; `FileField.Root` takes only `defaultValue` and keeps the selected files itself.

`ref` reaches the real element (`input` / `textarea` / `select` / `fieldset`). `FileField` uses a ref internally but composes it with yours, so the `ref` you pass still reaches the element. `Radio` (a group that renders several inputs) puts its `ref` on the radiogroup `<div>`, and `FormControl` (a wrapper) on its wrapper element — a `<div>`, or a `<fieldset>` with `labelAs="legend"`.

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
- `ref`: `Ref<HTMLFormElement>`
- Other props are forwarded to `FormHTMLAttributes<HTMLFormElement>`, except `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLElement>`, except `className` / `style` / `children`.

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
- `type`: `'email'` | `'search'` | `'tel'` | `'text'` | `'url'` (default: `'text'`)
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `className` / `style`.

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
- Other props are forwarded to `TextareaHTMLAttributes<HTMLTextAreaElement>`, except `className` / `style`.

### NumberField

```tsx
import { NumberField } from '@k8ordo/ui';

// Uncontrolled: starts empty unless defaultValue is given
<NumberField
  id="quantity"
  name="quantity"
  min={0}
  max={100}
  invalid={false}
  disabled={false}
  required={false}
/>;

// Controlled: null is an empty field
const [value, setValue] = useState<number | null>(null);
<NumberField
  id="quantity"
  min={0}
  max={100}
  value={value}
  onChange={setValue}
  invalid={false}
  disabled={false}
  required={false}
/>;
```

An empty field is `null`, never `0`. While empty the input submits `''` and
has no `aria-valuenow`, and leaving it keeps it empty; clearing the field
reports `null` to `onChange`. The first ArrowUp / ArrowDown or stepper press on
an empty field fills in `0`, or the nearer of `min` / `max` when `0` is out of
range. `required` reaches the input itself, so an empty required field fails
native validation.

A form reset — `form.reset()`, a reset button, or React resetting the form after
an action — puts an uncontrolled field back to `defaultValue` (or to empty) and
reports that value to `onChange`. A controlled field keeps its `value`; reset
your own state from the form's `onReset`.

Props:

- `defaultValue`: `number`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `9_007_199_254_740_991`)
- `min`: `number` (default: `-9_007_199_254_740_991`)
- `onChange`: `(value: number | null) => void`
- `precision`: `number` (default: `0`)
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number` | `null`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `role` / `className` / `style` / `children`.

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
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `className` / `style`.

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
- Other props are forwarded to `SelectHTMLAttributes<HTMLSelectElement>`, except `className` / `style`.

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
- `defaultValue`: `string[]`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLInputElement>`
- `value`: `string[]`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `role` / `className` / `style` / `children` / `autoComplete` / `aria-autocomplete` / `aria-controls` / `aria-expanded` / `aria-activedescendant`.

### Checkbox

The label is passed as the `label` prop, not as children. `onChange` is `(checked, event)`.

`itemValue` is the input's `value`: the string a checked box submits under its `name`. Without it the box renders no `value` and submits the browser's default, `on`. There is no `value` prop — on a checkbox it is easily mistaken for the checked state, which is `checked`.

```tsx
import { Checkbox } from '@k8ordo/ui';

// Controlled
<Checkbox checked={checked} label="I agree" onChange={onChange} />

// Uncontrolled
<Checkbox defaultChecked label="I agree" />

// Submits inStock=true when checked, instead of inStock=on
<Checkbox itemValue="true" label="In stock only" name="inStock" />
```

Props:

- `label`: `string` (required)
- `checked`: `boolean`
- `defaultChecked`: `boolean`
- `invalid`: `boolean` (default: `false`)
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `className` / `style` / `value` / `children`.

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
- `defaultChecked`: `boolean`
- `invalid`: `boolean` (default: `false`)
- `itemValue`: `string`
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `className` / `style` / `value` / `children`.

Props (CheckboxGroup.Root):

- `aria-labelledby`: `string` (required)
- `name`: `string` (required)
- `children`: `ReactNode`
- `defaultValue`: `string[]`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`
- Other props are forwarded to `FieldsetHTMLAttributes<HTMLFieldSetElement>`, except `className` / `style` / `role`.

### CheckboxCard

A card-styled checkbox.

```tsx
import { CheckboxCard } from '@k8ordo/ui';

<CheckboxCard
  aria-labelledby="plan-checkbox"
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
- `defaultValue`: `string[]`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string[]) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string[]`
- Other props are forwarded to `FieldsetHTMLAttributes<HTMLFieldSetElement>`, except `className` / `style` / `children` / `role`.

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
- `defaultValue`: `string`
- `disabled`: `boolean` (default: `false`)
- `invalid`: `boolean` (default: `false`)
- `name`: `string`
- `onChange`: `(value: string, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLDivElement>`
- `required`: `boolean` (default: `false`)
- `value`: `string`
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `role` / `className` / `style` / `children`.

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
- `defaultValue`: `string`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(value: string) => void`
- `ref`: `Ref<HTMLFieldSetElement>`
- `value`: `string`
- Other props are forwarded to `FieldsetHTMLAttributes<HTMLFieldSetElement>`, except `className` / `style` / `children` / `role`.

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

- `defaultValue`: `number`
- `invalid`: `boolean` (default: `false`)
- `max`: `number` (default: `100`)
- `min`: `number` (default: `0`)
- `onChange`: `(value: number) => void`
- `ref`: `Ref<HTMLInputElement>`
- `step`: `number` (default: `1`)
- `value`: `number`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `className` / `style` / `children`.

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
- `defaultChecked`: `boolean`
- `invalid`: `boolean` (default: `false`)
- `onChange`: `(checked: boolean, event: ChangeEvent<HTMLInputElement>) => void`
- `ref`: `Ref<HTMLInputElement>`
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `role` / `className` / `style` / `value` / `children`.

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
- Other props are forwarded to `InputHTMLAttributes<HTMLInputElement>`, except `type` / `className` / `style` / `value`.

Props (FileField.ItemList):

- `clearable`: `boolean`
- `showWebkitRelativePath`: `boolean`

Props (FileField.Trigger):

- `renderItem`: `(props: { onClick: () => void; disabled: boolean; invalid: boolean; }) => ReactElement` (required)

## Data display

### Heading

A semantic heading. The `level` prop selects the HTML element.

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
- Other props are forwarded to `HTMLAttributes<HTMLHeadingElement>`, except `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLSpanElement>`, except `role` / `aria-label` / `className` / `style`.

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
- `interactive`: `boolean`
- `size`: `'sm'` | `'md'` | `'lg'`
- `tone`: `'neutral'` | `'info'` | `'success'` | `'warning'` | `'error'`
- `variant`: `'solid'` | `'outline'`
- Other props are forwarded to `ButtonHTMLAttributes<HTMLButtonElement> | HTMLAttributes<HTMLSpanElement>`, except `children` / `className` / `style` / `type`.

### Code

Inline code.

```tsx
import { Code } from '@k8ordo/ui';

<Code>{`const x = 1;`}</Code>;
```

Props:

- `children`: `string` (required)
- Other props are forwarded to `HTMLAttributes<HTMLElement>`, except `className` / `style`.

### Kbd

One keyboard key, drawn as a key cap. A shortcut is several `Kbd` side by side,
one per key. When the key is a symbol a screen reader would not say usefully
(`⌘`, `⇧`), pass `label`: the symbol stays on screen and the label is what is
read out.

```tsx
import { Kbd } from '@k8ordo/ui';

<Kbd>Esc</Kbd>

<Kbd label="Command">⌘</Kbd>
<Kbd>K</Kbd>
```

Props:

- `children`: `string` (required)
- `label`: `string`
- Other props are forwarded to `HTMLAttributes<HTMLElement>`, except `className` / `style`.

### Carousel

Slides that scroll along the inline axis, snapping one slide at a time, with
previous and next buttons under them. It is built on scroll snapping, so a
trackpad, a touch swipe, and the arrow keys (the track takes focus) all move it
as well; the buttons move one slide per press and are disabled at either end.

```tsx
import { Carousel } from '@k8ordo/ui';

<Carousel.Root label="Featured posts" slideSize="md">
  {posts.map((post) => (
    <Carousel.Slide key={post.id} label={post.title}>
      <PostCard post={post} />
    </Carousel.Slide>
  ))}
</Carousel.Root>;
```

`slideSize` sets how much of the track one slide takes: `full` (one at a time),
`lg` (the next one peeks in), `md` (two), `sm` (three). With `full` and `lg` the
current position is shown as `2 / 5`; with several slides in view there is no
single current slide, so no position is shown. The region is announced as a
carousel and each slide as a slide (`aria-roledescription`); give a slide a
`label` when its content has a title. The slides follow the writing mode, so
under `.writing-v` the track scrolls vertically. There is no autoplay.

Props (Carousel.Root):

- `label`: `string` (required)
- `children`: `ReactNode`
- `slideSize`: `'full'` | `'lg'` | `'md'` | `'sm'` (default: `'full'`)

Props (Carousel.Slide):

- `children`: `ReactNode`
- `label`: `string`

### Table

A data table, as a compound component. `Table.EmptyState` is the row to put in
`Table.Body` when there are no rows: it spans `colSpan` columns and draws an
`EmptyState` with the rest of its props.

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
- Other props are forwarded to `HTMLAttributes<HTMLTableSectionElement>`, except `className` / `style`.

Props (Table.Caption):

- `children`: `ReactNode`
- Other props are forwarded to `HTMLAttributes<HTMLTableCaptionElement>`, except `className` / `style`.

Props (Table.Cell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `color`: `'base'` | `'mute'` (default: `'base'`)
- Other props are forwarded to `TdHTMLAttributes<HTMLTableCellElement>`, except `className` / `style`.

Props (Table.EmptyState):

- `colSpan`: `number` (required)
- `title`: `string` (required)
- `action`: `ReactNode`
- `description`: `ReactNode`
- `icon`: `ReactNode`
- Other props are forwarded to `ComponentProps<typeof EmptyState>`.

Props (Table.Head):

- `children`: `ReactNode`
- Other props are forwarded to `HTMLAttributes<HTMLTableSectionElement>`, except `className` / `style`.

Props (Table.HeaderCell):

- `align`: `CellAlign` (default: `'left'`)
- `children`: `ReactNode`
- `scope`: `'col'` | `'row'` | `'colgroup'` | `'rowgroup'` (default: `'col'`)
- Other props are forwarded to `ThHTMLAttributes<HTMLTableCellElement>`, except `className` / `style`.

Props (Table.Root):

- `children`: `ReactNode`
- Other props are forwarded to `TableHTMLAttributes<HTMLTableElement>`, except `className` / `style`.

Props (Table.Row):

- `children`: `ReactNode`
- `interactive`: `boolean` (default: `false`)
- Other props are forwarded to `HTMLAttributes<HTMLTableRowElement>`, except `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `children` / `role` / `className` / `style`.

`action` is an `AlertAction`, `{ label: string; renderItem: (props: { children: ReactNode }) => ReactNode }`.
`renderItem` receives `label` as `children`; render your own button or link
around it.

### EmptyState

What a list, a table, or a search shows when there is nothing in it: a title,
an optional description and icon, and an optional action. Inside a table, use
`Table.EmptyState`, which puts the same content in a row spanning the columns.

```tsx
import { Button, EmptyState, TableIcon } from '@k8ordo/ui';

<EmptyState
  action={<Button onClick={clearFilters}>Clear filters</Button>}
  description="Try removing a filter."
  icon={<TableIcon size="lg" />}
  title="No matching posts"
/>;
```

Props:

- `title`: `string` (required)
- `action`: `ReactNode`
- `description`: `ReactNode`
- `icon`: `ReactNode`
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `children` / `className` / `style`.

### Toast

```tsx
import { useToast } from '@k8ordo/ui';

const { open, close, closeAll } = useToast();

open('success', 'Saved');
open('error', 'Something went wrong');

const syncingId = open('info', 'Syncing…', {
  duration: Number.POSITIVE_INFINITY,
});
close(syncingId);
```

`ToastProvider` is already inside `UIProvider`, so no extra wrapper is needed.

What `useToast()` returns:

- `open`: `(tone: Status, message: string, options?: ToastOptions) => string` (returns the toast's id; `ToastOptions` is `{ duration?: number; action?: ToastAction }`. `duration` is in milliseconds and defaults to `5000`; `Number.POSITIVE_INFINITY` keeps the toast until it is closed. `ToastAction` is the same type as `AlertAction`.)
- `close`: `(id: string) => void` (closes only the toast with the id `open` returned)
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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `children` / `className` / `style`.

### Spinner

A loading spinner.

```tsx
import { Spinner } from '@k8ordo/ui';

<Spinner size="md" label="Loading" />;
```

Props:

- `label`: `string`
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- Other props are forwarded to `OutputHTMLAttributes<HTMLOutputElement>`, except `children` / `aria-label` / `className` / `style`.

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
- Other props are forwarded to `HTMLAttributes<HTMLDivElement>`, except `children` / `className` / `style`.

## Observers

Components that watch their children and report back without adding a wrapper
element. They are built on React's Fragment refs, so whatever the children
render is what gets observed — including host elements that mount later.

### InView

Reports whether its children are inside the viewport, or inside `root`.

```tsx
import { InView } from '@k8ordo/ui';

const [isInView, setIsInView] = useState(false);

<InView onChange={setIsInView}>
  <section>…</section>
</InView>;

// inside a scroll container, and only until it has been seen once
const [container, setContainer] = useState<HTMLElement | null>(null);

<div ref={setContainer} style={{ overflowY: 'auto' }}>
  <InView once onChange={reveal} root={container} rootMargin="0px 0px 24px 0px">
    <img alt="" src="…" />
  </InView>
</div>;
```

- `onChange` reports the state as soon as a host element is observed, then again
  each time it flips. The same value is never reported twice in a row, even
  when `root` changes and the observer is re-created.
- With several host elements, `isInView` is `true` while **any** of them
  intersects, and it follows children that mount or unmount later. While the
  children render no host element, `onChange` is not called at all — the first
  report comes once one mounts.
- `once` stops observing after the first `true`.
- Hold `root` in state, not a `RefObject`: the observer has to be re-created
  once the element exists.

Props:

- `children`: `ReactNode` (required)
- `onChange`: `(isInView: boolean) => void` (required)
- `once`: `boolean` (default: `false`)
- `root`: `Element` | `null` (default: `null`)
- `rootMargin`: `string` (default: `'0px'`)
- `threshold`: `number` (default: `0`)

### Resize

Calls `onChange` when the size of its children changes.

```tsx
import { Resize } from '@k8ordo/ui';

<Resize onChange={remeasure}>
  <div>…</div>
</Resize>;
```

- `onChange` is also called once when observation starts, as a native
  `ResizeObserver` is.
- It takes no argument; read what you need from the DOM in the handler.

Props:

- `children`: `ReactNode` (required)
- `onChange`: `() => void` (required)

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

## Icons

Decorative icons, all from the root entry. Each renders an `<svg>` with
`aria-hidden` and `focusable="false"`, so the accessible name belongs to the
control around it — an `IconButton`'s `label`, for example.

```tsx
import { AlertIcon, ChevronIcon, CloseIcon } from '@k8ordo/ui';

<CloseIcon />
<ChevronIcon direction="down" size="sm" />
<AlertIcon status="warning" />
```

Every icon takes one optional prop and nothing else:

- `size`: `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'` | `'2xl'` | `'3xl'` (default: `'md'`)

Two of them also require a prop that picks the glyph:

- `ChevronIcon`: `direction`: `Direction` (`'up'` | `'down'` | `'left'` | `'right'`)
- `AlertIcon`: `status`: `Status` (`'success'` | `'info'` | `'warning'` | `'error'`)

The icons: `AccessibilityIcon`, `AIIcon`, `AlertIcon`, `AssistantIcon`,
`AtomIcon`, `BadIcon`, `BlogIcon`, `BoringIcon`, `CheckIcon`, `ChevronIcon`,
`ChromeIcon`, `CloseIcon`, `CodeXmlIcon`, `ColorContrastIcon`, `ColorInfoIcon`,
`ColorScaleIcon`, `CopyIcon`, `DarkModeIcon`, `DifficultIcon`, `EasyIcon`,
`EdgeIcon`, `ExternalLinkIcon`, `FirefoxIcon`, `FlaskIcon`, `ForkIcon`,
`FormIcon`, `FullscreenIcon`, `GitHubIcon`, `GoodIcon`, `HistoryIcon`,
`HorizontalWritingIcon`, `InformativeIcon`, `InterestingIcon`,
`LightModeIcon`, `LinkIcon`, `ListIcon`, `LocationIcon`, `LockIcon`,
`LockOpenIcon`, `LogoIcon`, `MailIcon`, `MinusIcon`, `MixedColorIcon`,
`NavigationMenuIcon`, `NewsIcon`, `PackageIcon`, `PaletteIcon`, `PlusIcon`,
`PrepareIcon`, `PublishDateIcon`, `QiitaIcon`, `RefreshIcon`, `RSSIcon`,
`SafariIcon`, `SendIcon`, `ShallowIcon`, `ShieldCheckIcon`, `SlideIcon`,
`SparklesIcon`, `SquircleIcon`, `SubscribeIcon`, `TableIcon`, `TagIcon`,
`TwitterIcon`, `UpdateDateIcon`, `VerticalWritingIcon`, `ViewIcon`,
`ViewOffIcon`.

`Logo` is the mark `LogoIcon` draws, as a bare `<svg>` without the sizing: it
takes `className`, `aria-hidden`, and `focusable` (`Partial<IconRenderProps>`)
instead of `size`. The types `BaseIconProps` (`{ size }`) and
`IconRenderProps` (`{ className: string; 'aria-hidden': true; focusable: 'false' }`)
are exported as well.

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

A context that shares a portal container with your own `createPortal` calls;
read it with `usePortalRoot()`. The library's overlays do not read it — they
open in the top layer (`<dialog>`, the Popover API), and toasts go where
`ToastProvider`'s `portalRef` points. `Modal` passes its own `<dialog>` as the
value, so a portal placed through `usePortalRoot()` inside a modal stays in it.

```tsx
import { PortalRootProvider, usePortalRoot } from '@k8ordo/ui';

<PortalRootProvider value={containerRef}>{children}</PortalRootProvider>;
```

Props:

- `value`: `RefObject<HTMLElement | null>` (required)
- `children`: `ReactNode`

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

`dictionaries` from the same entry holds every built-in dictionary by its tag (`{ ja, en }`), for an application that picks one by the locale it is rendering: `messages={dictionaries[locale]}`.

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
import {
  dictionaries,
  en,
  ja,
  useMessages,
  type Messages,
} from '@k8ordo/ui/i18n';
```

`ja` and `en` are exported only from the `@k8ordo/ui/i18n` subpath, not the root, so the dictionaries stay out of the main bundle.

### Reading the wording in your own elements

`useMessages` returns the wording in effect: the built-in dictionary with whatever you passed to `UIProvider` laid over it. Read from it in an element you draw through `renderItem`, or in a component of your own that sits beside the library, and it follows the same language and overrides as the components do. It is a client hook.

```tsx
'use client';

import { useMessages } from '@k8ordo/ui/i18n';

function DismissButton({ onDismiss }) {
  const { close } = useMessages();
  return (
    <button aria-label={close} onClick={onDismiss} type="button">
      ×
    </button>
  );
}
```

### Key list

Every key in the `Messages` type. All values are `string`.

| Category      | Keys                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Common        | `close`, `required`, `loading`, `avatar`, `color`                                                                                                |
| Alert         | `alertSuccess`, `alertInfo`, `alertWarning`, `alertError`                                                                                        |
| Toast         | `toastRegion`                                                                                                                                    |
| Autocomplete  | `autocompletePlaceholder`, `autocompleteRemoveTag`, `autocompleteClear`, `autocompleteEmpty`                                                     |
| FileField     | `fileFieldRemove`, `fileFieldTrigger`                                                                                                            |
| NumberField   | `numberFieldIncrement`, `numberFieldDecrement`                                                                                                   |
| PasswordInput | `passwordShow`, `passwordHide`                                                                                                                   |
| ListBox       | `listBoxPlaceholder`                                                                                                                             |
| Breadcrumb    | `breadcrumb`                                                                                                                                     |
| Tabs          | `tabList`                                                                                                                                        |
| Pagination    | `paginationLabel`, `paginationPrevious`, `paginationNext`                                                                                        |
| Carousel      | `carousel`, `carouselSlide`, `carouselPrevious`, `carouselNext`                                                                                  |
| AI chat       | `chat`, `scrollToLatest`, `reasoning`, `reasoningStreaming`, `suggestions`, `send`, `stop`, `toolInput`, `toolOutput`, `toolError`, `toolDenied` |
| Response      | The `response*` keys below                                                                                                                       |

`fileFieldTrigger` and `tabList` are the trigger text and tab-list name the
generative-UI renderers fall back to when a spec leaves them out.

The `response*` keys label the controls `Response` draws (`@k8ordo/ui/ai/response`):
`responseCopied`, `responseCopyCode`, `responseCopyLink`, `responseCopyTable`,
`responseCopyTableAsCsv`, `responseCopyTableAsMarkdown`,
`responseCopyTableAsTsv`, `responseDownloadDiagram`,
`responseDownloadDiagramAsMmd`, `responseDownloadDiagramAsPng`,
`responseDownloadDiagramAsSvg`, `responseDownloadFile`,
`responseDownloadImage`, `responseDownloadTable`,
`responseDownloadTableAsCsv`, `responseDownloadTableAsMarkdown`,
`responseExitFullscreen`, `responseViewFullscreen`,
`responseImageNotAvailable`, `responseOpenExternalLink`,
`responseExternalLinkWarning`, `responseOpenLink`.
