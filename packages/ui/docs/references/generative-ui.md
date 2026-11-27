# Generative UI (the catalog)

`@k8ordo/ui` describes its own components for an LLM, for no generative-UI
format in particular: what each component is, the props a model may write,
whether it holds children, and which prop holds a field's value. The props are
pinned to the design tokens, so a UI a model composes from them cannot drift
off-brand.

The library ties itself to no format. json-render, OpenUI, A2UI, or your own
format each needs a small piece of glue that maps over the catalog — see
[Connecting a format](#connecting-a-format). `zod` is the only peer the catalog
needs:

```bash
pnpm add zod
```

## The two entries

- `@k8ordo/ui/catalog` is **server-safe**: it imports no React, so a Server
  Component or an API route can build the system prompt from it.
- `@k8ordo/ui/catalog/render` is `'use client'`: how each component is drawn.

```ts
import { catalog, catalogRules, catalogPropIssues } from '@k8ordo/ui/catalog';
```

```tsx
'use client';
import { renderers } from '@k8ordo/ui/catalog/render';
```

## What an entry says

`catalog` maps each component's name to an entry:

- `description`: what the component is, for the model.
- `props`: a zod object of the props the model writes.
- `children: true`: the component lays out children of its own (`Stack`,
  `Card`, `Dialog`, …). Absent for every other component.
- `value`: present on a field. `value.prop` is the prop that carries the value
  the field starts from (`defaultValue`, `defaultChecked`, or `defaultPage`), and
  `value.initial(props)` is what it starts from when nothing is bound to it.
- `events`: present on a component the user acts on in a way the application
  should hear about. It maps each event's name to a description for the model.
  `Button`, `IconButton`, `Card`, and `DropdownMenuItem` have one, `press`.

```ts
catalog.TextField;
// {
//   description: 'Single-line text input. type picks the kind of value: …',
//   props: z.object({ name, label, placeholder, … }),
//   value: { prop: 'defaultValue', initial: (props) => props.defaultValue ?? '' },
// }
```

The types follow the table: `CatalogName` is the union of the names,
`CatalogProps<'Button'>` the props of one component, `CatalogValueOf<'Slider'>`
the value of one field (`never` for a component that is not a field), and
`CatalogEventOf<'Card'>` the events of one component (`never` for none).

The key order of every `props` schema is part of the contract. A format with
positional arguments (OpenUI Lang) maps the arguments back to props by that
order, so an optional key is only ever appended. A new required key breaks every
saved string of its entry anyway, so it goes where it reads best: a field's
`label` comes right after its `name`.

Some entries' `props` also check props against each other (see
[Checking what a model wrote](#checking-what-a-model-wrote)). zod keeps such a
check only on the schema it was written on: `.omit()`, `.pick()`, and
`.partial()` throw on these entries, and `.extend()` throws when it replaces a
key, so a glue that derives a schema from one uses `.safeExtend()`. The checks
do not reach JSON Schema either (`z.toJSONSchema` leaves them out): only a zod
parse, or `catalogPropIssues`, applies them.

## Drawing

`renderers` has the same names as `catalog`. Call one with props that fit the
entry's schema (see below) and the children the format drew — one node per
child, keyed; `Children.toArray` keys them. A field also takes its value and a setter, so the format decides
where the value lives: in its own state, or in the component's. A component
with events takes `on`, the handler of each event the model bound. Leave an
event out of `on` when the model bound nothing to it: an unbound `Card` is not
pressable, and an unbound button presses to no effect. A handler may return a
promise; the button or card is busy until it settles.

```tsx
'use client';
import { renderers } from '@k8ordo/ui/catalog/render';

renderers.Button({
  props: { label: 'Save' },
  children: [],
  on: { press: () => sendToAgent('save') },
});
renderers.TextField({
  props: { name: 'title', label: 'Title' },
  children: [],
  value,
  setValue,
});
```

The props a renderer takes are values that fit the entry's `props` schema, with
no `null`: a prop the model left out is absent or `undefined`. A renderer does
not tidy up what a format wrote; the glue does, before it calls one. It drops
every `null` key, nested ones included (OpenUI Lang, for one, writes an omitted
positional argument as `null`), parses the rest with the entry's `props`
schema, and hands the renderer what the parse returns. A format's own
validation is not enough: JSON Schema leaves zod's own checks out, and OpenUI
does not check `pattern`. An element whose props do not parse is drawn as
nothing; while a spec streams in, it appears once they do. A field's value
bound to the format's state is left out of the parse, since the user, not the
model, wrote it.

`Form` submits nothing, not even on Enter in a field: a submission is the press
of a `Button` inside it. A `Button` or `Card` with `href` is a link and reports
no press.

Draw the generated UI inside your application's `ToastProvider`, the one its own
`useToast` reads. A `Toast` opens its toast there, in the same region, under the
same limit, as the application's own. Outside one, drawing a `Toast` fails with
`useToast`'s error.

## Connecting a format

The glue for a format does three things, each by mapping over `catalog`:

1. **Register** every component with the format, by name, with its
   `description` and its `props` schema. A component with `children: true`
   gets the format's way of holding children — json-render's `slots`, a
   `children` prop in OpenUI.
2. **Bind** each field: read the format's state at `value.prop` (json-render's
   `$bindState`, OpenUI's form state by `name`, A2UI's `{"@path": ...}` into
   the data model), starting from `value.initial(props)` when nothing is bound.
   Bind each of `events` to the format's own action — A2UI's `action` prop,
   json-render's `on`, an OpenUI action prop — and hand the bound ones to the
   renderer as `on`. What an action does then (report to the agent, or change
   the format's own state) is the format's.
3. **Draw** each component through `renderers`: drop the `null` keys, parse
   the rest with the entry's `props` schema, and hand the renderer what the
   parse returns. Draw nothing for an element that fails (see
   [Drawing](#drawing)).

Since no step names a component, a component added to `@k8ordo/ui` reaches
every format without a change to the glue, and a new format is one new piece of
glue.

The repository keeps working glue for A2UI 1.0, json-render, OpenUI, and the AI SDK in
[`examples/ui-integrations`](https://github.com/k35o/k8ordo/tree/main/examples/ui-integrations),
run in a real browser on every change. Copy the one you use into your
application and own it: the glue depends on the format's own release cycle, not
on `@k8ordo/ui`'s.

json-render, for example, is registered like this (the full glue adds the
system prompt, validation, and a ready-wired `<JsonRenderUI spec={spec} />`):

```ts
import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react/schema';
import { catalog as k8ordo } from '@k8ordo/ui/catalog';

export const catalog = defineCatalog(schema, {
  components: Object.fromEntries(
    Object.entries(k8ordo).map(([name, entry]) => [
      name,
      {
        props: entry.props,
        description:
          entry.value === undefined
            ? entry.description
            : `${entry.description} ${entry.value.prop} can be bound to state with $bindState.`,
        ...(entry.children === true ? { slots: ['default'] } : {}),
      },
    ]),
  ),
  actions: {},
});
```

## Checking what a model wrote

`catalogPropIssues(type, props)` checks one component the model wrote and
returns what is wrong with it, in English, ready to send back to the model. An
empty array means the component exists and its props are valid.

```ts
catalogPropIssues('Anchor', {
  label: 'Docs',
  href: 'ftp://example.com',
  rel: 'x',
});
// [
//   'Anchor.href: …',
//   'Anchor: Unknown prop "rel". Allowed props: label, href, …',
// ]
```

Unknown props are reported too. zod drops a key the schema does not know rather
than failing, so a prop the model invented would otherwise pass and render as if
it were not there. Run it on every element of a spec, after the format's own
structural check, and send the issues back as a repair prompt.

Props are also checked against each other, each issue under the path it is at
and in the same round as the other issues of the component, as long as the
props the check reads are valid themselves. Every row of a `Table` or
`DataTable` must have as many cells as there are columns. A `TextField` whose
`type` is a date or time kind takes a `defaultValue` in the input format of
that kind, as `DatePicker` does: a real calendar day as `YYYY-MM-DD` for
`date`, `HH:MM` or `HH:MM:SS` for `time`, `YYYY-MM-DDTHH:MM` with optional
seconds for `datetime-local`, `YYYY-MM` for `month`, and `YYYY-Www` for
`week`. The `defaultValue` of `Select`, `Radio`,
`RadioCard`, `ListBox`, `CheckboxGroup`, and `CheckboxCard` must be the `value`
of one of its `options` (each entry of it, for the two that take an array):

```ts
catalogPropIssues('Table', {
  caption: 3,
  columns: [{ label: 'Name' }, { label: 'Qty' }],
  rows: [['Apple', '3'], ['Orange']],
});
// [
//   'Table.caption: Invalid input: expected string, received number',
//   'Table.rows.1: Expected 2 cells (one per column), received 1',
// ]

catalogPropIssues('CheckboxGroup', {
  name: 'tags',
  label: 'Tags',
  options: [
    { value: 'news', label: 'News' },
    { value: 'blog', label: 'Blog' },
  ],
  defaultValue: ['news', 'Blog'],
});
// ['CheckboxGroup.defaultValue.1: Expected the value of an option ("news" | "blog"), received "Blog"']
```

A prop the format resolves later, such as one a json-render spec binds with
`{ "$bindState": "/form/name" }`, cannot be checked as a value yet. Name it in
`unresolved`: its name is still checked, its value is not, and a required one
is not reported missing. A check across props that needs it is not made.

```ts
catalogPropIssues(
  'TextField',
  {
    name: 'nickname',
    label: 'Nickname',
    defaultValue: { $bindState: '/form/nickname' },
  },
  { unresolved: ['defaultValue'] },
);
// []
```

## Prompt language

Everything the catalog hands the model — the descriptions, the schemas'
descriptions, `catalogRules`, and the issues `catalogPropIssues` returns — is
English, whatever your application's locale. The model reads it; your users
never see it.

`catalogRules` holds the cross-cutting constraints a model most often breaks
(a `Table` row with as many cells as there are columns, the `href` format, plain
text inside `Tabs` and `Accordion`). Pass it to the format's system prompt, and
add a rule of your own to pin the language of the text the model writes into the
UI:

```ts
// json-render
catalog.prompt({
  customRules: [...catalogRules, 'Write all UI text in Japanese.'],
});
// OpenUI
prompt({
  additionalRules: [...catalogRules, 'Write all UI text in Japanese.'],
});
```

## What the catalog covers

Most entries are the exported component of the same name. A few are shaped for a
model instead:

- **Icons** are one `Icon` entry whose `name` picks the glyph. Every icon in
  `@k8ordo/ui/icons` that needs nothing but a size is there, under its name in
  kebab-case without the suffix: `eye-closed` is `EyeClosedIcon`. `ChevronIcon`
  and `AlertIcon` are not there by name: each draws one of the icons above,
  picked by `direction` or `status`, so a spec names that icon instead
  (`chevron-down`, `circle-check`).
- **Fields** each take a required `label` and an optional `helpText`, and are
  drawn through `FormControl`'s `renderInput`. The label is a `<label for>`
  tied to the input, or, for a group (`Radio`, `RadioCard`, `CheckboxGroup`,
  `CheckboxCard`, `RangeSlider`, `FileField`), the heading the group is named
  by (`labelAs="group"`). The help text sits under the field and describes it.
  `Checkbox` and `Switch` are not wrapped in `FormControl`: their `label` is
  their own, and they draw `helpText` themselves. `ListBox` is a button that
  opens a list, and its required `label` names the button.
- **Toasts** are a `Toast` entry, standing in for `useToast`: a widget whose
  `triggerLabel` button opens the toast through your application's
  `ToastProvider` (see [Drawing](#drawing)).
- **Overlays** (`Dialog`, `Drawer`, `Popover`, `Tooltip`, `DropdownMenu`) are
  self-contained widgets. Each declares its own trigger with `triggerLabel` and
  handles opening and closing itself. `Dialog` opens in the center or along the
  bottom edge and `Drawer` along the left or right one, each by its `side`, as
  the components do. The items of a `DropdownMenu` are its children, each a
  `DropdownMenuItem` with its own `press`, so the menu needs no event of its
  own to say which item was chosen.
- **Compound components** (`Tabs`, `Accordion`, `Table`, `Breadcrumb`, …) are
  one entry each, with their parts flattened into data such as
  `tabs: [{ label, content }]`. `Carousel` is one container entry whose
  children are its slides, one child per slide.
- **Kbd** takes `keys: string[]` and draws the whole shortcut, one key cap per
  entry, where the component itself is one key.

Every other component the package exports is either in the catalog or in the
list below, and the package's tests keep it that way.

## What the catalog leaves out

These exports are left out on purpose, so a model cannot place them:

- `ContextMenu` — it opens on a right-click, which nothing on screen invites,
  so actions put in it would be hidden in a generated UI. It belongs on your
  application's own content (a file, a row).
- `Conversation`, `Message`, `PromptInput`, `Reasoning`, `Suggestion`,
  `ToolInvocation`, `Attachment`, and `Source` from `@k8ordo/ui/ai`, and
  `Response` from
  `@k8ordo/ui/ai/response` — the chat the generated UI is shown in. Your
  application builds it from its message stream; a spec does not place it.
- `CodeBlock` from `@k8ordo/ui/code-block` — it highlights on the server, as an
  async Server Component. The generated UI renders on the client, where it
  cannot run, and placing it there would ship the highlighter to the browser.
  `Code` (inline code) is in the catalog.
- `CommandPalette` — every item runs a function of your application, which a
  spec cannot write, and it is chrome your application opens from a shortcut
  rather than something placed in a reply. For actions inside the generated UI,
  use `Button` or `DropdownMenu`.
- `ResizablePanels` — it divides a parent of fixed size into a workspace, the
  frame an application draws around its content. The generated UI flows inside
  a message and has no height to divide; to set things side by side, use
  `Grid`.
- `Prose` — it typesets the bare HTML that Markdown renders to. A spec places
  components, which keep their own look, so it would have nothing to typeset;
  lay a flow out with `Stack`.
- `BaseIcon` — the base your own icons are drawn on. It has no glyph of its
  own, and a spec picks a glyph by `name`.
- `FormControl` — every field in the catalog takes its own `label` and
  `helpText` and is drawn through `FormControl` already (see
  [What the catalog covers](#what-the-catalog-covers)). An entry for the frame
  alone would be a second way to write the same field.
- `TableOfContents` — it points at the ids of the document's headings and
  follows the scroll. The headings a spec places carry no id, so there would be
  nothing to point at.

## Exports at a glance

| Export                      | Kind           | Contents                                                                                                 |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `@k8ordo/ui/catalog`        | server-safe    | `catalog`, `catalogRules`, `catalogPropIssues`, types (`CatalogName`, `CatalogProps`, `CatalogEntry`, …) |
| `@k8ordo/ui/catalog/render` | `'use client'` | `renderers`, types (`RenderArgs`, `Renderer`)                                                            |

> The drawn components assume you have loaded `@k8ordo/ui/styles.css` (or
> `@k8ordo/ui/tailwind.css` after Tailwind, in a Tailwind CSS 4 project).
