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
  `Card`, `Modal`, …). Absent for every other component.
- `value`: present on a field. `value.prop` is the prop that carries the value
  the field starts from (`defaultValue`, `defaultChecked`, or `defaultPage`), and
  `value.initial(props)` is what it starts from when nothing is bound to it.

```ts
catalog.TextField;
// {
//   description: 'Single-line text input.',
//   props: z.object({ name, placeholder, defaultValue, … }),
//   value: { prop: 'defaultValue', initial: (props) => props.defaultValue ?? '' },
// }
```

The types follow the table: `CatalogName` is the union of the names,
`CatalogProps<'Button'>` the props of one component, and `CatalogValueOf<'Slider'>`
the value of one field (`never` for a component that is not a field).

The key order of every `props` schema is part of the contract. A format with
positional arguments (OpenUI Lang) maps the arguments back to props by that
order, so keys are only ever appended.

## Drawing

`renderers` has the same names as `catalog`. Call one with the props the format
resolved and the children it drew — one node per child, keyed; `Children.toArray`
keys them. A field also takes its value and a setter, so the format decides
where the value lives: in its own state, or in the component's.

```tsx
'use client';
import { renderers } from '@k8ordo/ui/catalog/render';

renderers.Button({ props: { label: 'Save' }, children: [] });
renderers.TextField({
  props: { name: 'title' },
  children: [],
  value,
  setValue,
});
```

## Connecting a format

The glue for a format does three things, each by mapping over `catalog`:

1. **Register** every component with the format, by name, with its
   `description` and its `props` schema. A component with `children: true`
   gets the format's way of holding children — json-render's `slots`, a
   `children` prop in OpenUI.
2. **Bind** each field: read the format's state at `value.prop` (json-render's
   `$bindState`, OpenUI's form state by `name`, A2UI's `{"@path": ...}` into
   the data model), starting from `value.initial(props)` when nothing is bound.
3. **Draw** each component through `renderers`.

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

A prop the format resolves later, such as one a json-render spec binds with
`{ "$bindState": "/form/name" }`, cannot be checked as a value yet. Name it in
`unresolved`: its name is still checked, its value is not, and a required one
is not reported missing.

```ts
catalogPropIssues(
  'TextField',
  { name: 'nickname', defaultValue: { $bindState: '/form/nickname' } },
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
  has an entry of its own, and `AlertIcon` is the `StatusIcon` entry.
- **Toasts** are a `Toast` entry, standing in for `ToastProvider` and
  `useToast`: a self-contained widget whose `triggerLabel` button shows the
  toast.
- **Overlays** (`Modal`, `Dialog`, `Drawer`, `Popover`, `Tooltip`,
  `DropdownMenu`) are self-contained widgets too. Each declares its own trigger
  with `triggerLabel` and handles opening and closing itself.
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
- `InView`, `Resize` — they report to a callback and draw nothing of their own,
  and a spec has no code to receive the report.
- `UIProvider` — your application mounts it once, around the generated UI as
  well.
- `PortalRootProvider`, `usePortalRoot` — wiring for your own `createPortal`
  calls. The generated overlays open their own surfaces.
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
- `TableOfContents` — it points at the ids of the document's headings and
  follows the scroll. The headings a spec places carry no id, so there would be
  nothing to point at.

## Exports at a glance

| Export                      | Kind           | Contents                                                                                                 |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| `@k8ordo/ui/catalog`        | server-safe    | `catalog`, `catalogRules`, `catalogPropIssues`, types (`CatalogName`, `CatalogProps`, `CatalogEntry`, …) |
| `@k8ordo/ui/catalog/render` | `'use client'` | `renderers`, types (`RenderArgs`, `Renderer`)                                                            |

> The drawn components assume you have loaded `@k8ordo/ui/styles.css` (or
> `@k8ordo/ui/tailwind.css` after Tailwind, in a Tailwind CSS 4 project) and
> wrapped the tree in `UIProvider`.
