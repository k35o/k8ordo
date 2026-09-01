# @k8ordo/form

One zod schema produces the HTML constraint attributes, the messages, and the
server-side validation. The DOM holds the values; React state holds only what
the DOM cannot express.

The shared discipline — React 19 / RSC assumed, Baseline newly available only,
no polyfills — is in the [repository root `CLAUDE.md`](../../../CLAUDE.md).

## zod, or zod/mini

The conversion is taken from zod's shared core, so a schema written with either
entry works. `zod/mini` is the same validator with a much smaller surface — if
the schema module is also imported somewhere on the client, that is the one to
reach for.

```
zod        63 kB gzipped
zod/mini   10 kB gzipped
```

Nothing in this package notices which one you chose. Note that under this
design the schema is imported only by server code — the Server Component that
derives the fields, and the Server Action that parses the submission — so zod
does not reach the browser either way. Reach for `zod/mini` when something on
the client imports the schema module anyway.

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
retry without JavaScript keeps the input. Fields marked as passwords are
excluded automatically, and typed as `password` in the markup:

```ts
z.string().min(8).meta({ input: 'password' }); // zod
globalRegistry.add(password, { input: 'password' }); // zod or zod/mini
```

`.meta()` is shorthand for the registry and is not available on `zod/mini`;
the registry route works with either.

**`isDirty` costs one boolean.** `form.isDirty` compares each control's value
with the value it was rendered with, read straight from the DOM. It flips at
most twice, so it never becomes a per-keystroke re-render.

## Nested objects and repeated rows

A nested field is addressed by its dotted path, which is also the `name` the
browser submits.

```tsx
const email = form.field('user.email'); // name="user.email"
```

A repeated group is reached through `array()`. React state holds only the
identity of each row — the values stay in the DOM, so adding or removing a row
never copies anything into React.

```tsx
const items = form.array('items');

{
  items.rows.map((row) => (
    <div key={row.key}>
      <input {...row.field('name').input} /> {/* name="items[0].name" */}
      {items.canRemove && (
        <button onClick={row.remove} type="button">
          削除
        </button>
      )}
    </div>
  ));
}
{
  items.canAdd && (
    <button onClick={items.add} type="button">
      追加
    </button>
  );
}
```

`canAdd` and `canRemove` come from the schema's `.min()` / `.max()`, so the
buttons disappear at exactly the bounds the server enforces. For an array of
scalars (`z.array(z.string())`) the item has a single unnamed field:
`row.field()`.

`parseForm` reports how many rows arrived in `state.rows`, so a retry without
JavaScript rebuilds the same number of rows.

## Paths are checked at compile time

`formFields` derives the set of valid paths from the schema type, so a typo is
a build error rather than something you find by clicking.

```tsx
form.field('titel'); // error: not a field in the schema
form.field('items'); // error: an array, reached through array()
form.array('user'); // error: an object, not an array
```

## Checks HTML has no attribute for

Password confirmation, "tick at least two", "required only when rejected" —
none of these map to a constraint attribute, and a `.refine()` cannot cross to
the client because it is a function. Declare them next to the schema instead:

```ts
export const signup = defineForm(
  z.object({
    password: z.string().min(8),
    confirm: z.string(),
  }),
  [sameAs('confirm', 'password', 'パスワードが一致しません')],
);
```

Pass the definition where you passed the schema — `formFields(signup)` and
`parseForm(signup, formData)`. The rules are plain data, so they travel with
the fields, and **both sides run the same evaluator**: the browser against the
live form, the server against the submission. There is no second
implementation to drift from the first.

On the client a breach is applied with `setCustomValidity`, so it is
indistinguishable from a built-in check — `:user-invalid` matches and the
message arrives through the same path as every other one.

Available: `sameAs`, `minChecked`, `requiredWhen`. Anything else stays a
`.refine()`, runs on the server, and is listed in `dropped`.

## Asking the server about one field

Whether a name is already taken is something only the server knows. `useAsyncCheck`
runs on blur, keeps the newest answer when replies arrive out of order, and
applies the result with `setCustomValidity` — so the answer shows up through the
same path as every other message.

```tsx
const slug = form.field('slug');
const taken = useAsyncCheck(checkSlugAvailable); // a Server Action

<input {...slug.input} {...taken.props} />;
<button disabled={taken.isChecking} type="submit">
  保存
</button>;
```

## Components that submit nothing

A rich text editor or a third-party combobox renders no `<input name>`, so
FormData never sees it. Park its value in a hidden input rather than pulling it
into React state and pushing it back out at submit:

```tsx
<Editor onChange={setBody} value={body} />
<input {...hiddenValue('body', body)} />
```

This is all `Controller` does in react-hook-form, and it is the one place that
binding silently breaks there. Here the value is in the form, so it submits
whether or not anything else works.

## Multi-step forms

Keep every step mounted and hide the ones you are not on. The values stay in
the DOM, so moving between steps costs nothing and losing a step is impossible:

```tsx
<div hidden={step !== 1}>{/* … */}</div>
```

Validate one step before advancing by checking only its controls:

```tsx
const stepIsValid = [...form.elements].every(
  (element) =>
    !(element instanceof HTMLInputElement) || element.checkValidity(),
);
```

Without JavaScript this degrades to one long form that submits in a single
request — which is the correct behaviour, not a broken one.

## What it does not do yet

- Input masking. Rewriting `el.value` on input works with the DOM as the source
  of truth, but managing the caret is a separate problem from wiring a form.

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
