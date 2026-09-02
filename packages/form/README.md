# @k8ordo/form

Derive HTML constraint attributes, error messages, and server-side validation
from one zod schema — forms whose two sides cannot disagree, because the client
side is derived, never written. Works with JavaScript disabled or not yet
loaded.

Like every [k8ordo](https://ordo.k8o.me) package it assumes React 19 and Server
Components, uses only what has reached Baseline newly available, and ships no
polyfills or legacy fallbacks.

- **Documentation**: https://ordo.k8o.me/form
- **Design guide**: [docs/GUIDE.md](docs/GUIDE.md) — shipped inside this package

## Installation

```bash
npm install @k8ordo/form zod
# or
pnpm add @k8ordo/form zod
```

## Peer Dependencies

| Package        | Version  | Needed for                    |
| -------------- | -------- | ----------------------------- |
| `react`        | ≥19.2.6  | `useForm` and Server Actions  |
| `react-dom`    | ≥19.2.6  | rendering                     |
| `zod`          | ^4.4.3   | the schema (`zod/mini` works) |
| `typescript`   | ≥7.0.2   | the shipped type declarations |
| `@types/react` | ≥19.2.18 | the shipped type declarations |

zod never reaches the browser: the schema is read on the server and crosses the
RSC boundary as plain data. The client entry is ~2.7 kB gzipped.

## Quick Start

One schema drives everything — the attributes, the messages, and the
server-side validation:

```ts
// schema.ts
export const talkSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(120),
  eventUrl: z.url(),
});
```

```tsx
// page.tsx — Server Component
import { formFields } from '@k8ordo/form/server';

const talkFields = formFields(talkSchema); // derived once, plain data

export default function Page() {
  return <TalkForm action={createTalk} fields={talkFields} />;
}
```

```tsx
// talk-form.tsx
'use client';
import { useForm } from '@k8ordo/form';

export const TalkForm = ({ action, fields }: TalkFormProps) => {
  const [state, formAction] = useActionState(action, {});
  const form = useForm(fields, state);
  const title = form.field('title');

  return (
    <form {...form.props} action={formAction}>
      <input {...title.input} />
      {title.error && <p>{title.error}</p>}
      <button type="submit">送信</button>
    </form>
  );
};
```

```ts
// actions.ts
'use server';
import { parseForm } from '@k8ordo/form/server';

export async function createTalk(_prev: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;
  await insertTalk(parsed.data); // typed
  redirect('/talks');
}
```

The [design guide](docs/GUIDE.md) covers the rest: nested objects and repeated
rows, checkbox groups, cross-field rules typed against the schema's paths,
async per-field checks, components that render no input of their own, and what
the package guarantees (nothing dropped in silence, native validation kept
without JavaScript, secrets never echoed).

## AI Agent Documentation

The docs ship **inside the package**, so an agent always reads the exact
version you installed — there is no snapshot to copy or re-sync on upgrade.

Point your agent at them once by pasting this into your project's `CLAUDE.md` /
`AGENTS.md`:

```markdown
Use `@k8ordo/form` for forms. Before writing or changing a form, read
`node_modules/@k8ordo/form/docs/GUIDE.md`. One zod schema is the single
source: derive with `formFields(schema)` on the server, wire with
`useForm(fields, state)` on the client, validate with
`parseForm(schema, formData)` in the Server Action. Never duplicate a
constraint in JSX that the schema already states, and check the `dropped`
report for validations that do not reach the client.
```

What each surface gives an agent:

| Surface                    | Where                                          |
| -------------------------- | ---------------------------------------------- |
| Design guide (entry point) | `node_modules/@k8ordo/form/docs/GUIDE.md`      |
| Docs index for LLMs        | `docs/llms.txt` · https://ordo.k8o.me/llms.txt |
| Markdown twin on the web   | https://ordo.k8o.me/form/docs/GUIDE.md         |

## License

MIT License - see [LICENSE](https://github.com/k35o/k8ordo/blob/main/LICENSE) for details.
