# Generative UI (json-render / OpenUI)

`@k8ordo/ui` ships official adapters that let an LLM generate UI out of
`@k8ordo/ui` components only. The generated UI is pinned to the design tokens,
so it cannot drift off-brand. Two frameworks are supported:
[json-render](https://json-render.dev) and [OpenUI](https://www.openui.com).

Both are optional peer dependencies — install only the one you use.

```bash
# json-render
pnpm add @json-render/core @json-render/react zod
# OpenUI — both entries import lang-core directly, so install both packages
pnpm add @openuidev/react-lang @openuidev/lang-core zod
```

`@openuidev/lang-core` is not optional for OpenUI: `@k8ordo/ui/openui` builds its
component library with it and `@k8ordo/ui/openui/prompt` is the React-free entry
on top of it. `@openuidev/react-lang` depends on it as well, but pnpm will not
let your app resolve a dependency of a dependency — declare it yourself.

Both frameworks are 0.x, where a minor bump is a breaking release, so
`@k8ordo/ui` declares a range that stops at the next minor (`>=0.20.0 <0.21.0`
for json-render, `>=0.2.10 <0.3.0` and `>=0.2.9 <0.3.0` for OpenUI). Pick a
version inside it.

Within that range, resolve exactly **one copy** of each framework. The adapters
read the framework's own React context — `useStateField` for OpenUI,
`useBoundProp` for json-render — so if your app and `@k8ordo/ui` end up on two
different copies, the context objects are different objects: every schema check,
the types, and the build all pass, and the form views throw
`useOpenUI must be used within a <Renderer /> component.` at render time. With
pnpm this happens as soon as your version differs from the one `@k8ordo/ui`
resolves, even when both satisfy the range.

## What the catalog covers

Both adapters register the same components, and the prompts they generate list
them. Most are the exported component of the same name. A few are shaped for a
model instead:

- **Icons** are one `Icon` entry whose `name` picks the glyph from a curated
  set of icons that need nothing but a size. `ChevronIcon` has an entry of its
  own, and `AlertIcon` is the `StatusIcon` entry.
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

## Prompt language

Everything the adapters hand the model — component descriptions, `uiRules`,
schema descriptions, and the repair prompt — is English, whatever your
application's locale. The model reads it; your users never see it. To pin the
language of the text the model writes into the UI, add a rule of your own:

```tsx
// json-render
catalog.prompt({ customRules: [...uiRules, 'Write all UI text in Japanese.'] });
// OpenUI
prompt({ additionalRules: ['Write all UI text in Japanese.'] });
```

## json-render

The catalog (schemas and prompt) is separate from the registry (rendering), and
the catalog is **server-safe**.

### 1. Generate the prompt on the server

```tsx
import { catalog, uiRules } from '@k8ordo/ui/json-render';

// customRules injects the cross-cutting constraints an LLM most often breaks
// (cell count matching columns in Table, href format, text-only content in
// Tabs and Accordion).
const systemPrompt = catalog.prompt({ customRules: [...uiRules] });
```

### 2. Render on the client

`JsonRenderUI` already wires up `JSONUIProvider` + `Renderer` + registry
internally, so passing the spec is enough. Pass `onStateChange` when you need to
collect form values.

```tsx
'use client';
import type { UISpec } from '@k8ordo/ui/json-render';
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: UISpec }) {
  return <JsonRenderUI spec={spec} />;
}
```

Props:

- `spec`: `Spec | null` (required; a `UISpec` is assignable to json-render's `Spec` without a cast, and `null` renders nothing)
- `loading`: boolean (passed to `Renderer`: set it while the spec is still streaming in, so children that have not arrived yet are skipped without a warning)
- `onStateChange`: `(changes: Array<{ path: string; value: unknown }>) => void` (called once per state update with every changed path and its new value)

For an advanced setup (your own `navigate`, `handlers`, or
`validationFunctions`), pass the low-level `registry` straight to
`@json-render/react`'s `JSONUIProvider` / `Renderer`.

### 3. Validate LLM output, then render or repair it

`validateGeneratedSpec` applies mechanical fixes, validates the structure, then
validates props per component. On failure it returns the `issues` it found (each
a `message`, plus the `elementKey` of the offending element when there is one)
and a repair prompt built from them that you can send straight back to the LLM.
Use it instead of `catalog.validate()`, which rejects valid specs in the current
upstream version. The result and issue types are exported as
`ValidateGeneratedSpecResult` and `GeneratedSpecIssue`.

```tsx
import { validateGeneratedSpec } from '@k8ordo/ui/json-render';

const result = validateGeneratedSpec(JSON.parse(llmOutput));
if (result.ok) {
  // result.fixes lists what was auto-corrected
  return <JsonRenderUI spec={result.spec} />;
}
// If it is broken, regenerate with the repair prompt
const retried = await llm(result.repairPrompt);
```

### 4. Typed specs (optional)

Writing `satisfies UISpec` turns a typo in a component name or prop into a
compile error, and removes the need for `as unknown as Spec`.

```tsx
import type { UISpec } from '@k8ordo/ui/json-render';

const spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { direction: 'column' }, children: ['ok'] },
    ok: { type: 'Button', props: { label: 'OK' } },
  },
} satisfies UISpec;
```

`UISpecElement` (one element of a `UISpec`), `ComponentName`, and
`ComponentProps<K>` are exported as well, so you can pull out the props type of a
specific component.

## OpenUI

A model where children are expressed as typed subcomponents
(`z.array(Child.ref)`). Rendering is `'use client'`.

```tsx
'use client';
import { library } from '@k8ordo/ui/openui';
import { Renderer } from '@openuidev/react-lang';

export function GenUi({ response }: { response: string }) {
  return <Renderer library={library} response={response} />;
}
```

The system prompt comes from a dedicated server-safe entry, mirroring
json-render's `catalog.prompt()`.

```tsx
import { prompt } from '@k8ordo/ui/openui/prompt';

const systemPrompt = prompt(); // No React dependency — callable from RSC or an API route
```

`prompt` takes an optional `PromptOptions` from `@openuidev/lang-core`
(`preamble`, `additionalRules`, `examples`, …) and passes it straight through to
the library's prompt generation.

Containers nest freely in OpenUI, as they do in json-render: `Stack`, `Grid`,
`Card`, `Form`, `Modal`, `Dialog`, `Drawer`, and `Popover` each list every
container among their children, so a `Card` can sit inside a `Stack` and a
`Stack` inside another `Stack`.

## Exports at a glance

| Export                            | Kind           | Contents                                                           |
| --------------------------------- | -------------- | ------------------------------------------------------------------ |
| `@k8ordo/ui/json-render`          | server-safe    | `catalog`, `validateGeneratedSpec`, `uiRules`, types (`UISpec`, …) |
| `@k8ordo/ui/json-render/registry` | `'use client'` | `JsonRenderUI` (pre-wired), `registry` (low level)                 |
| `@k8ordo/ui/openui`               | `'use client'` | `library` (rendering)                                              |
| `@k8ordo/ui/openui/prompt`        | server-safe    | `prompt(options?)` (prompt generation)                             |

> All of them assume you have loaded `@k8ordo/ui/styles.css` (or
> `@k8ordo/ui/tailwind.css` in a Tailwind CSS 4 project) and wrapped the tree in
> `UIProvider`.
