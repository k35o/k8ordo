# @k8ordo/form

One zod schema produces the HTML constraint attributes, the messages, and the
server-side validation. The DOM holds the values; React state holds only what
the DOM cannot express.

Like every k8ordo package it assumes React 19 and Server Components, uses only
what has reached Baseline newly available, and ships no polyfills or legacy
fallbacks.

## zod, or zod/mini

The conversion is taken from zod's shared core, so a schema written with either
entry works. `zod/mini` is the same validator with a much smaller surface —
bundled for the browser, the `talkSchema` below comes to about a quarter of the
size — so if the schema module is also imported somewhere on the client, that
is the one to reach for.

Nothing in this package notices which one you chose. Note that under this
design the schema is imported only by server code — the Server Component that
derives the fields, and the Server Action that parses the submission — so zod
does not reach the browser either way. Reach for `zod/mini` when something on
the client imports the schema module anyway.

## The shape of it

```
server    formFields(schema)  →  { fields: { title: { input, messages, secret }, … },
                                   arrays, rules, dropped }   plain data
            ↓ props (zod does not cross)
client    useForm(fields, state)  →  attributes to spread, message to show
            ↓ submit
server    parseForm(schema, formData)  →  typed data, or per-field errors
```

`formFields` runs on the server — in a Server Component or at module scope. Its
result is JSON, so it crosses the RSC boundary as props and zod never enters the
client bundle. The messages are read when it runs, and module scope runs once,
before any request: when a message follows the request (its locale, say, with
`@k8ordo/i18n`), call `formFields` during the render instead.

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

Because every submitted value is a string, a plain `z.number()` could not accept
any submission at all; `formFields` refuses it instead of deriving a form that
always fails. An empty numeric control is not 0 either — it submits nothing, so
`z.coerce.number()` is required and `z.coerce.number().optional()` is not. That
makes an untouched field a type error, which is where its wording comes from:

```ts
z.coerce.number('数値を入力してください');
```

Depending on the zod version, that wording also replaces the default message of
every other check on the field that has none of its own (4.5.4 does this, 4.4.3
does not), so give `.int()` or `.min()` theirs.

Each leaf derives the control that submits what it validates:

| Schema                                           | `input`                                                                                   |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `z.string()`                                     | `type="text"`                                                                             |
| `z.email()` / `z.url()`                          | `type="email"` / `type="url"`                                                             |
| `z.iso.date()` / `z.iso.time()`                  | `type="date"` / `type="time"`                                                             |
| `z.iso.datetime({ local: true })`                | `type="datetime-local"`                                                                   |
| `z.coerce.number()`                              | `type="number"`; `step` from `.multipleOf()`, else `1` after `.int()` and `any` otherwise |
| `z.boolean()`, `z.literal(true)`                 | `type="checkbox"`                                                                         |
| `z.file()`                                       | `type="file"`                                                                             |
| a password ([below](#what-it-guarantees))        | `type="password"`                                                                         |
| `z.enum([…])`                                    | no `type`: spread it onto a `<select>`, not a radio ([Radio groups](#radio-groups))       |
| `z.array(z.enum([…]))`                           | no `type`: one checkbox per option ([Checkbox groups](#checkbox-groups))                  |
| anything else (`z.uuid()`, `z.coerce.date()`, …) | `type="text"`                                                                             |

```tsx
// page.tsx — Server Component
const talkFields = formFields(talkSchema); // module scope: derived once

export default function Page() {
  return <TalkForm action={createTalk} fields={talkFields} />;
}
```

`useForm` takes the whole result — fields, arrays, rules, and the `dropped`
report travel together.

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
registration to forget. Its `onSubmit` checks the form
([below](#what-it-guarantees)) — an `onSubmit` of your own written after the
spread replaces it, so call `form.props.onSubmit(event)` from yours — and it
also hears the form being reset — by a reset
button, by `form.reset()`, or by React itself after every form action, whatever
it returned — and forgets what it knew about the old values: the messages,
which server errors were still current, the rows that were added, and
`isDirty`.

A form with no action behind it — a GET filter, say — calls `useForm(fields)`
and leaves the state out. It is still checked on submit, so a filter that
breaks its schema never reaches the URL.

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

When a new state arrives, focus moves to the first failure on the page, so the
failure is announced where it happened. That is the first failed field in
document order — not the first key of `state.errors`, which follows the schema
— or the form-level message below, when it comes before every failed field. A
server error stays on its field until the person edits that field, and a
message the browser raises takes precedence over it. Responses are told apart
by their content plus `state.token`, which `parseForm` sets on every parse — a
state built by hand needs a fresh `token` too, or a second identical failure
reads as the same response, and focus does not move.

An issue with no path — a `.refine()` on the whole schema that names no
`path` — lands in `state.formError`, not on a field. No control can take focus
for it, so `form.formError` hands over the message and the props for the
element that shows it — an `id` and `tabIndex={-1}`, which lets the script
focus it without adding it to the Tab order. Without them the message is drawn
but never focused, and a screen reader says nothing about it. Put it above the
fields, the way an error summary is placed: it then takes focus even when
fields failed too, the person hears what went wrong with the submission as a
whole first, and Tab moves on through the fields.

```tsx
<form {...form.props} action={formAction}>
  {form.formError.message !== undefined && (
    <p {...form.formError.props}>{form.formError.message}</p>
  )}
  {/* … */}
</form>
```

Focus carries the message rather than a live region because focus moves on
every response: a live region already holding the same text announces nothing
when the same failure comes back.

## What it guarantees

**The wording cannot drift.** Client messages are obtained by running the
schema against a probe value, so the text shown next to the input is the text
zod itself produces. A custom `min(1, '…')` reaches both sides.

**`required` means the same thing on both sides.** JSON Schema's `required`
means "the key is present", but a form always submits something for every
control. What that is depends on the control: `''` for a text field, `false` for
an unchecked checkbox, and nothing at all for a number, a `z.coerce.bigint()`, a
file, or a choice — an empty numeric field is not 0 (nor 0n), an unfilled file
input is not the zero-byte file the browser sends, and neither a radio group
with nothing selected nor a `<select>` left on a `value=""` placeholder has
chosen anything. The attribute is emitted only when the schema rejects that
empty submission, and `parseForm` hands the schema exactly what the derivation
probed, so the two sides always agree: a plain `z.boolean()` checkbox is not
required, while `z.literal(true, '…')` — a consent box — is, and shows zod's own
wording; `z.enum([…])` is required, while `z.enum([…]).optional()` can be left
on its placeholder.

**Checks the client skips are reported.** What HTML cannot express — a
`refine` on the schema as a whole, cross-field rules, an exclusive bound on a
float, a regex whose flags or anchoring the `pattern` attribute would silently
reinterpret, several regexes on one string (the attribute holds one), a regex on
a control that ignores `pattern` such as `type="date"`, a `.mime()` that
`accept` only suggests to the file picker, a `z.iso.datetime()` no
`datetime-local` control can ever satisfy,
a leaf whose constraints could not be read at all because a `.transform()` or a
`z.custom()` left nothing to read — are returned in `dropped`. They still run
on the server; you are told they do not run on the client. Outside production
`formFields` also logs the list once per schema with `console.warn`, so it is
seen without anyone remembering to read it. One kind is not reported yet: a
`refine` on a single field, a nested object, or a row (see
[What it does not do yet](#what-it-does-not-do-yet)).

**The control follows the format, whatever is stacked on it.** `z.email()`
derives `type="email"` and `z.iso.date()` `type="date"`, and a check added on
top — `.regex()`, `.startsWith()`, `.lowercase()` — does not turn either into a
text input. The check itself becomes the `pattern` when it is the only regex
the browser would have to run (`z.url().lowercase()`), and is listed in
`dropped` otherwise (`z.email().regex(…)`, whose format already carries one).

**A schema this package cannot express fails at derive time.** `z.record`,
tuples, a repeat nested inside a repeat, nullable objects, keys containing
`.` or brackets — `formFields` throws with the reason, instead of deriving a
form that would silently misparse what the person typed. So does a leaf no
control could ever satisfy, because every value arrives as a string:
`z.number()` (use `z.coerce.number()`), `z.literal(1)`, `z.date()`,
`z.bigint()` — or, for a checkbox, as a boolean: `z.stringbool()` (use
`z.boolean()`). A form that can never validate is a mistake to report, not a
check to drop. A schema that coerces reads strings and is kept, so
`z.coerce.date()` and `z.coerce.bigint()` derive as text inputs.

**A missing name is loud.** If the schema has a field that never arrived in the
FormData, `parseForm` throws instead of reporting it as a validation failure.
Forgetting to spread `input` is a wiring mistake, not something the person
filling in the form did. The exceptions are the controls that submit no entry
at all when left alone — a state the person can reach: a radio group with
nothing selected reaches the schema as no value, the same as a `<select>` on
its placeholder (a validation error unless the enum accepts `undefined`), an
unchecked checkbox as `false`, and a checkbox group with nothing checked as
`[]`. A forgotten spread on one of those is not caught either.

**A failing submission stops in the browser, with JavaScript or without.**
`noValidate` is applied from JavaScript on mount, never rendered into the
markup, so with scripts disabled or not yet loaded the browser's own checks
stay on. Once the hook is live it runs the same check on every submit, in
zod's wording: every field, the ones nobody touched included, and the
cross-field [rules](#checks-html-has-no-attribute-for). A failure stops the submission, shows each failed field's message, and
moves focus to the first failed field on the page. A submit button marked
`formNoValidate` skips the check, as it skips the browser's. The server stays
the arbiter: what passes still goes to it, and the checks in `dropped` run
there alone.

**Secrets are never echoed.** `parseForm` returns the submitted values so a
retry keeps the input — they render as the controls' defaults, which is also
what React's reset after the action restores. Fields marked as passwords are
excluded automatically, and typed as `password` in the markup:

```ts
z.string().min(8).meta({ input: 'password' }); // zod
z.string().check(z.minLength(8), z.meta({ input: 'password' })); // zod/mini
globalRegistry.add(password, { input: 'password' }); // zod or zod/mini
```

`.meta()` is shorthand for the registry, and `zod/mini` has no such method —
pass `z.meta()` to `.check()` there. The registry route works with either.

**`isDirty` costs one boolean.** `form.isDirty` compares each control — text,
checkbox, `<select>`, a `HiddenValue` — with the value it was rendered with,
read straight from the DOM; adding or removing a row counts too. It flips at
most twice, so it never becomes a per-keystroke re-render. A reset — React's
own after every form action included — is read from the DOM once it is
through, so it takes the flag back to `false` for everything the browser
restores. A `HiddenValue` is not among those: its value is the caller's
state, which React writes straight back, so a form holding an edited one
stays dirty until that state is reset too.

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

`items.error` is the server's message about the array itself — too few or too
many rows for its `.min()` / `.max()` — which no row's field carries, so render
it next to the rows. `row.index` is the row's current position.

`parseForm` reports how many rows arrived in `state.rows`, so a retry without
JavaScript rebuilds the same number of rows. Row counts are read from the
submitted names but never trusted beyond the schema's `.max()` (or a hard
ceiling), so a forged index cannot make the server allocate.

A nested object behind `.optional()` / `.default()` keeps its fields — the
wrapper is peeled the same way on both sides. A repeat nested inside a repeat
has no unambiguous name; the types let it through, but `formFields` and
`parseForm` throw on it.

## Radio groups

Do not spread an enum's `input` onto a radio: once `state` carries `values`,
`input` holds the echoed choice as `defaultValue`, which collides with each
radio's own `value` and restores no selection. Take `name` and `required` from
it and restore the choice per option:

```tsx
const plan = form.field('plan');

<input
  defaultChecked={state.values?.plan === option}
  name={plan.input.name}
  required={plan.input.required}
  type="radio"
  value={option}
/>;
```

## Checkbox groups

An array of enums is a fixed option set the person picks several of — one
name shared by every box, not repeated rows. It derives as a single field:

```tsx
const prefs = z.object({ tags: z.array(z.enum(['a', 'b', 'c'])).min(2) });

const tags = form.field('tags');

{
  ['a', 'b', 'c'].map((option) => (
    <input
      defaultChecked={
        Array.isArray(state.values?.tags) && state.values.tags.includes(option)
      }
      key={option}
      name={tags.input.name}
      type="checkbox"
      value={option}
    />
  ));
}
```

`parseForm` reads every checked box under the shared name — none checked is
`[]`, never a wiring error. The `.min(2)` cannot become an HTML attribute (on
a group, `required` would mean "check every box"), so it is reported in
`dropped`; declare `minChecked('tags', 2, '…')` to run the same bound in the
browser. After a submission `state.values.tags` holds what was checked as an
array — `['a']` for one box, `[]` for none — and `tags.input` carries only the
`name`, so each box restores itself from that array.

## Files

`z.file()` derives `type="file"`, and `.mime([…])` becomes `accept`. `accept`
only decides what the file picker offers first — the person can still pick any
file, and the browser never checks the type — so the check runs on the server
and is listed in `dropped`. An unfilled file input still submits — an unnamed,
zero-byte File, which `z.file()` would otherwise accept as a real upload — so it
reaches the schema as nothing entered and `required` keeps meaning what it says.

Size bounds (`.min()` / `.max()` on a file) are byte counts, and no HTML
attribute carries them: they run on the server and are reported in `dropped`.
A file is never echoed into `state.values`, because no browser lets a value be
put back into a file control.

## Paths are checked at compile time

`formFields` derives the set of valid paths from the schema type, so a typo in
`form.field()` or `form.array()` is a build error rather than something you
find by clicking. Rules are typed against the same paths.

```tsx
form.field('titel'); // error: not a field in the schema
form.field('items'); // error: an array of objects, reached through array()
form.array('user'); // error: an object, not an array
form.array('tags'); // error: a checkbox group is a field
defineForm(schema, [sameAs('confrim', 'password', '…')]); // error: typo
```

A row's `row.field(key)` is the exception: the key is a plain string, and a
typo in it throws when the row renders.

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
message arrives through the same path as every other one. When several rules
break the same field, both sides show the one declared first.

Available: `sameAs(field, other, message)`, `minChecked(field, min, message)`,
and `requiredWhen(field, when, equals, message)` —
`requiredWhen('reason', 'status', 'rejected', '…')` requires `reason` while
`status` is `'rejected'`. Anything else stays a `.refine()` and runs on the
server only. A `refine` on the schema as a whole is listed in `dropped`; one on
a single field, a nested object, or a row is not yet.

## Asking the server about one field

Whether a name is already taken is something only the server knows. `useAsyncCheck`
runs on blur, keeps the newest answer when replies arrive out of order, and
applies the result with `setCustomValidity` — so the answer shows up through the
same path as every other message. Leaving the field while it still holds the
value the last answer was about does not ask again — a blur while a check is
still in flight does — and emptying the field and leaving it clears the last
answer.

`check` receives the field's value and resolves to the message to show, or to
`undefined` when the value is fine. A rejected promise applies no verdict
either way; the server still checks the submission.

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
<HiddenValue name="body" value={body} />
```

The value is an ordinary form entry, so it goes out with the rest of the
FormData and needs no submit-time code. `HiddenValue` is a component rather
than a props helper because React updates a controlled value without any DOM
event — the component announces each change with one, so cross-field rules and
`isDirty` hear it like any keystroke.

## Multi-step forms

Keep every step mounted and hide the ones you are not on. The values stay in
the DOM, so moving between steps costs nothing and losing a step is impossible.
Hide steps only once hydrated — a step hidden in the server's HTML is out of
reach without JavaScript — and, once hydrated, render the submit button only on
the last step: Enter in a text field can click the form's first submit button
even when it is hidden, which would send the whole form from an earlier step.

```tsx
const subscribe = () => () => {};
const hydrated = useSyncExternalStore(subscribe, () => true, () => false);

<fieldset hidden={hydrated && step !== 0} ref={stepOne}>
  {/* … */}
</fieldset>
<fieldset hidden={hydrated && step !== 1}>
  {/* … */}
  {(!hydrated || step === 1) && <button type="submit">送信</button>}
</fieldset>
```

Validate one step before advancing by checking only the controls inside that
step's container — the hidden steps are not filled in yet, so checking the
whole form would always fail:

```tsx
const stepIsValid = [
  ...(stepOne.current?.querySelectorAll('input, select, textarea') ?? []),
].every((control) => (control as HTMLInputElement).checkValidity());
```

After a failed submit, `useForm` moves focus to the first failed field on the
page, but a control inside a hidden step cannot take focus. When a new state
arrives, switch during render to the earliest step holding a key of
`state.errors`, so the field is visible by the time focus moves. The check on
submit covers the hidden steps too, and stops the submission for a failure
there without being able to show it — checking each step before advancing is
what keeps the earlier steps from failing at the end.

Without JavaScript this degrades to one long form that submits in a single
request — which is the correct behaviour, not a broken one.

## What it does not do yet

- Several files in one control. `z.array(z.file())` derives repeated
  single-file rows rather than one `multiple` input, and `parseForm` reads one
  file per name.
- Constraints that sit behind a `.transform()`, or a `.pipe()` whose output
  JSON Schema cannot describe. The schema no longer says what the control
  submits, so the field derives as a bare text input and is listed in
  `dropped`; every check still runs on the server.
- A `z.custom()` that rejects the strings a text control submits. Nothing about
  it is readable, so it cannot be refused at derive time the way `z.date()` is
  — it derives as a text input, is listed in `dropped`, and fails on the server.
- Reporting a `.refine()` / `.superRefine()` on a single field, on a nested
  object, or on a row. Of `.refine()` / `.superRefine()` checks, `dropped`
  counts only the ones on the schema as a whole; the others run on the server
  without a word on the client.
- Rules on fields inside repeated rows. Rule field names are typed against the
  schema's field paths, and a row's fields are not among them.
- Input masking. Rewriting `el.value` on input works with the DOM as the source
  of truth, but managing the caret is a separate problem from wiring a form.

## Working with @k8ordo/ui

`@k8ordo/form` does not depend on `@k8ordo/ui`. Attributes go to the input;
`FormControl` gets only what it uses, and generates the `id` and `aria-*`
links itself. A derived `type` is any string while `TextField` takes only its
own text types, so take `type` out of `input` and set it on the component when
the field is not plain text. Take it out for `PasswordInput` too: it sets
`type` itself to show and hide the value, and a spread `type` overrides that
toggle without a type error.

```tsx
const title = form.field('title');
const { type: _type, ...titleInput } = title.input;

<FormControl
  errorText={title.error}
  invalid={title.invalid}
  label="タイトル"
  required={title.required}
  renderInput={(props) => <TextField {...props} {...titleInput} />}
/>;
```

The form-level message fits `Alert`, which passes `id` and `tabIndex` through
to its element. Its `role="alert"` means a screen reader may read the message
twice — once when it appears, once when focus lands on it — the same trade an
error summary with an alert role makes.

```tsx
{
  form.formError.message !== undefined && (
    <Alert
      {...form.formError.props}
      message={form.formError.message}
      tone="error"
    />
  );
}
```
