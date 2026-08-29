# Generative UI (json-render / OpenUI)

`@k8ordo/ui` ships official adapters that let an LLM generate UI out of
`@k8ordo/ui` components only. The generated UI is pinned to the design tokens,
so it cannot drift off-brand. Two frameworks are supported:
[json-render](https://json-render.dev) and [OpenUI](https://www.openui.com).

Both are optional peer dependencies — install only the one you use.

```bash
# json-render
pnpm add @json-render/core @json-render/react zod
# OpenUI
pnpm add @openuidev/react-lang zod
# Add this too if you use OpenUI's server-safe prompt entry:
pnpm add @openuidev/lang-core
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
import { JsonRenderUI } from '@k8ordo/ui/json-render/registry';

export function GenUi({ spec }: { spec: unknown }) {
  return <JsonRenderUI spec={spec} />;
}
```

For an advanced setup (your own `navigate`, `handlers`, or
`validationFunctions`), pass the low-level `registry` straight to
`@json-render/react`'s `JSONUIProvider` / `Renderer`.

### 3. Validate LLM output, then render or repair it

`validateGeneratedSpec` applies mechanical fixes, validates the structure, then
validates props per component. On failure it returns a repair prompt you can
send straight back to the LLM. Use it instead of `catalog.validate()`, which
rejects valid specs in the current upstream version.

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

`ComponentName` and `ComponentProps<K>` are exported as well, so you can pull
out the props type of a specific component.

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

In OpenUI a `Stack` or `Grid` cannot sit directly inside another `Stack` or
`Grid` (self-referential schemas are unsupported). When you need nested layout,
put the `Stack` / `Grid` inside a `Card`. json-render is slot-based and nests
freely.

## Exports at a glance

| Export                            | Kind           | Contents                                                           |
| --------------------------------- | -------------- | ------------------------------------------------------------------ |
| `@k8ordo/ui/json-render`          | server-safe    | `catalog`, `validateGeneratedSpec`, `uiRules`, types (`UISpec`, …) |
| `@k8ordo/ui/json-render/registry` | `'use client'` | `JsonRenderUI` (pre-wired), `registry` (low level)                 |
| `@k8ordo/ui/openui`               | `'use client'` | `library` (rendering)                                              |
| `@k8ordo/ui/openui/prompt`        | server-safe    | `prompt()` (prompt generation)                                     |

> All of them assume you have loaded `@k8ordo/ui/styles.css` (or
> `@k8ordo/ui/tailwind.css` in a Tailwind CSS 4 project) and wrapped the tree in
> `UIProvider`.
