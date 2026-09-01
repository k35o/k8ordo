# @k8ordo/form

One zod schema produces the HTML constraint attributes, the messages, and the
server-side validation. The DOM holds the values; React state holds only what
the DOM cannot express.

The shared discipline — React 19 / RSC assumed, Baseline newly available only,
no polyfills — is in the [repository root `CLAUDE.md`](../../../CLAUDE.md).

## The shape of it

```
server    formFields(schema)  →  { title: { input, messages }, … }   plain data
            ↓ props (zod does not cross)
client    useForm(fields, state)  →  attributes to spread, message to show
            ↓ submit
server    parseForm(schema, formData)  →  typed data, or per-field errors
```

`formFields` runs on the server — in a Server Component or at module scope. Its
result is JSON, so it crosses the RSC boundary as props and zod never enters the
client bundle.

## Writing a form

```ts
// schema.ts
export const talkSchema = z.object({
  title: z.string().min(1).max(120),
  eventUrl: z.url(),
  blogId: z.coerce.number().int().positive(),
});
```

Type conversion stays in the schema. `parseForm` handles what only it can —
an unchecked checkbox arrives as a missing key, a repeated name arrives as
several entries, everything is a string — and `z.coerce` handles `'42'` → `42`.
That way the schema keeps describing what it actually validates.

```tsx
// page.tsx — Server Component
const { fields } = formFields(talkSchema); // module scope: derived once

export default function Page() {
  return <TalkForm action={createTalk} fields={fields} />;
}
```

```tsx
// talk-form.tsx
'use client';

export const TalkForm = ({ action, fields }: TalkFormProps) => {
  const [state, formAction] = useActionState(action, {});
  const form = useForm(fields, state);
  const title = form.field('title');

  return (
    <form {...form.props} action={formAction}>
      <input {...title.input} />
      {title.error !== undefined && <p>{title.error}</p>}
    </form>
  );
};
```

`form.props` attaches to the `<form>` and nowhere else. There is no per-field
registration to forget.

```ts
// actions.ts
'use server';

export async function createTalk(_prev: FormState, formData: FormData) {
  const parsed = parseForm(talkSchema, formData);
  if (!parsed.success) return parsed.state;

  await insertTalk(parsed.data); // typed
  redirect('/talks');
}
```

## What it guarantees

**The wording cannot drift.** Client messages are obtained by running the
schema against a probe value, so the text shown next to the input is the text
zod itself produces. A custom `min(1, '…')` reaches both sides.

**`required` means the same thing on both sides.** JSON Schema's `required`
means "the key is present", but a form always sends every field — an empty one
as `''`. The attribute is emitted only when the schema rejects `''`, so the
browser blocks exactly what the server would have rejected.

**Nothing is dropped in silence.** Checks HTML cannot express — `refine`,
cross-field rules, an exclusive bound on a float — are returned in `dropped`.
They still run on the server; you are told they do not run on the client.

**A missing name is loud.** If the schema has a field that never arrived in the
FormData, `parseForm` throws instead of reporting it as a validation failure.
Forgetting to spread `input` is a wiring mistake, not something the person
filling in the form did.

**Secrets are never echoed.** `parseForm` returns the submitted values so a
retry without JavaScript keeps the input. Fields marked
`.meta({ input: 'password' })` are excluded automatically.

## What it does not do yet

- Nested (`user.email`) and repeated (`items[0].name`) field names
- Serializable cross-field rules; `refine` is server-only for now
- `isDirty` / `isTouched` derived from the DOM
- Asynchronous per-field validation
- Input masking

## Working with @k8ordo/ui

`@k8ordo/form` does not depend on `@k8ordo/ui`. Attributes go to the input;
`FormControl` gets only what it uses, and generates the `id` and `aria-*`
links itself.

```tsx
const title = form.field('title');

<FormControl
  errorText={title.error}
  invalid={title.invalid}
  label="タイトル"
  required={title.required}
  renderInput={(props) => <TextField {...props} {...title.input} />}
/>;
```
